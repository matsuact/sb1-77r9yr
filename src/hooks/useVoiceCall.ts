import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { log } from '../utils/logger';
import { defaultConfig } from '../config/voiceSynthesis';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  isLoading?: boolean;
  audioUrl?: string;
}

const useVoiceCall = (apiKey: string, systemPrompt: string = '') => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isProcessingRef = useRef(false);

  const startCall = useCallback(() => {
    log('通話開始');
    setChatHistory([]);
    setError(null);
  }, []);

  const endCall = useCallback(() => {
    log('通話終了');
    setIsListening(false);
    setTranscript('');
    setError(null);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const startListening = useCallback(() => {
    log('音声認識開始');
    setIsListening(true);
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  }, []);

  const stopListening = useCallback(() => {
    log('音声認識停止');
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const sendMessageToChatGPT = async (message: string) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            ...chatHistory.map(msg => ({ role: msg.role, content: msg.content })),
            { role: 'user', content: message },
          ],
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('ChatGPT APIエラー:', error);
      log('ChatGPT APIエラー');
      setError('ChatGPT APIエラーが発生しました。');
      return null;
    }
  };

  const synthesizeAndPlayAudio = async (text: string): Promise<string> => {
    try {
      log('音声合成開始');
      const g2pResponse = await axios.post('https://matsuap-style-bert-vits2-editor-demo.hf.space/api/g2p', { text });
      const moraToneList = g2pResponse.data;
      log('G2P変換完了');

      const synthesisResponse = await axios.post('https://matsuap-style-bert-vits2-editor-demo.hf.space/api/synthesis', {
        ...defaultConfig,
        text,
        moraToneList,
        assistText: "",
      }, {
        responseType: 'arraybuffer'
      });

      log('音声合成完了');
      const audioBlob = new Blob([synthesisResponse.data], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      log(`音声URL生成: ${audioUrl}`);

      const audio = new Audio(audioUrl);
      await audio.play();
      
      return new Promise((resolve) => {
        audio.onended = () => {
          log('音声再生完了');
          isProcessingRef.current = false;
          startListening();
          resolve(audioUrl);
        };
      });
    } catch (error) {
      console.error('音声合成中にエラーが発生しました:', error);
      log('音声合成エラー、ブラウザのTTSにフォールバック');
      setError('音声合成中にエラーが発生しました。');
      isProcessingRef.current = false;
      startListening();
      return '';
    }
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'ja-JP';

      recognitionRef.current.onresult = async (event: SpeechRecognitionEvent) => {
        const current = event.resultIndex;
        const transcriptResult = event.results[current][0].transcript;
        log(`音声認識結果: ${transcriptResult}`);
        setTranscript(transcriptResult);

        if (event.results[current].isFinal && !isProcessingRef.current) {
          isProcessingRef.current = true;
          stopListening();
          setChatHistory(prev => [...prev, { role: 'user', content: transcriptResult }]);
          setTranscript('');
          
          // ChatGPTに送信
          const response = await sendMessageToChatGPT(transcriptResult);
          if (response) {
            const newMessage: ChatMessage = { role: 'assistant', content: response, isLoading: true };
            setChatHistory(prev => [...prev, newMessage]);
            
            // 音声合成と再生
            const audioUrl = await synthesizeAndPlayAudio(response);
            setChatHistory(prev => prev.map(msg => 
              msg === newMessage ? { ...msg, isLoading: false, audioUrl } : msg
            ));
          } else {
            isProcessingRef.current = false;
            startListening();
          }
        }
      };

      recognitionRef.current.onend = () => {
        if (isListening && !isProcessingRef.current) {
          recognitionRef.current?.start();
        }
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('音声認識エラー:', event.error);
        log(`音声認識エラー: ${event.error}`);
        setError(`音声認識エラー: ${event.error}`);
        if (event.error === 'not-allowed') {
          setIsListening(false);
        }
      };
    } else {
      console.error('Speech recognition is not supported in this browser.');
      log('音声認識非対応');
      setError('お使いのブラウザは音声認識に対応していません。');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening, apiKey, systemPrompt]);

  return { 
    startCall, 
    endCall, 
    startListening,
    stopListening,
    isListening, 
    transcript, 
    chatHistory,
    synthesizeAndPlayAudio,
    error
  };
};

export default useVoiceCall;