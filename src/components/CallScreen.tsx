import React, { useRef, useEffect } from 'react';
import { Phone, Volume2, VolumeX, Play } from 'lucide-react';
import CallerInfo from './CallerInfo';
import { Contact } from '../types';
import { log } from '../utils/logger';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  isLoading?: boolean;
  audioUrl?: string;
}

interface CallScreenProps {
  contact: Contact | null;
  transcript: string;
  chatHistory: ChatMessage[];
  onEndCall: () => void;
  onSpeakerToggle: () => void;
  speakerOn: boolean;
  synthesizeAndPlayAudio: (text: string) => Promise<string>;
  startListening: () => void;
  stopListening: () => void;
}

const CallScreen: React.FC<CallScreenProps> = ({
  contact,
  transcript,
  chatHistory,
  onEndCall,
  onSpeakerToggle,
  speakerOn,
  synthesizeAndPlayAudio,
  startListening,
  stopListening,
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, transcript]);

  useEffect(() => {
    startListening();
    log('通話画面マウント時に音声認識開始');
    return () => {
      stopListening();
      log('通話画面アンマウント時に音声認識停止');
    };
  }, [startListening, stopListening]);

  const handlePlayAudio = async (message: ChatMessage) => {
    try {
      log('音声再生開始');
      let audioUrl = message.audioUrl;
      if (!audioUrl && message.content) {
        log('音声URLが存在しないため、新しく生成します');
        audioUrl = await synthesizeAndPlayAudio(message.content);
      }
      if (audioUrl) {
        log(`音声URL: ${audioUrl}`);
        const audio = new Audio(audioUrl);
        audio.oncanplaythrough = () => {
          log('音声データ読み込み完了、再生開始');
          audio.play().catch(error => {
            console.error('音声再生中にエラーが発生しました:', error);
            log('音声再生エラー');
          });
        };
        audio.onerror = (error) => {
          console.error('音声の読み込み中にエラーが発生しました:', error);
          log('音声読み込みエラー');
        };
      } else {
        console.error('音声URLが利用できません');
        log('音声URL不在');
      }
    } catch (error) {
      console.error('音声再生中にエラーが発生しました:', error);
      log('音声再生処理エラー');
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      <CallerInfo name={contact?.name || '不明'} icon={contact?.icon || '👤'} />
      <div ref={chatContainerRef} className="flex-grow mt-4 overflow-y-auto px-4">
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-700 text-white rounded-bl-none'
              }`}
            >
              {message.isLoading ? (
                <div className="loading-dots">
                  <span>.</span><span>.</span><span>.</span>
                </div>
              ) : (
                <>
                  <p>{message.content}</p>
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => handlePlayAudio(message)}
                      className="mt-2 text-sm text-gray-300 hover:text-white focus:outline-none transition-colors duration-200"
                    >
                      <Play className="w-4 h-4 inline-block mr-1" />
                      再生
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
        {transcript && (
          <div className="flex justify-end mb-2">
            <div className="max-w-[70%] p-3 bg-gray-600 text-white rounded-lg rounded-br-none">
              <p>{transcript}</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-between mt-4 px-4">
        <button
          onClick={() => {
            log('通話終了ボタンクリック');
            onEndCall();
          }}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center transition-colors duration-200"
        >
          <Phone className="w-4 h-4 mr-2" />
          通話終了
        </button>
        <button
          onClick={() => {
            log(`スピーカー${speakerOn ? 'オフ' : 'オン'}ボタンクリック`);
            onSpeakerToggle();
          }}
          className={`flex items-center justify-center p-2 rounded transition-colors duration-200 ${
            speakerOn ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
          }`}
        >
          {speakerOn ? (
            <Volume2 className="w-6 h-6 text-white" />
          ) : (
            <VolumeX className="w-6 h-6 text-gray-300" />
          )}
        </button>
      </div>
    </div>
  );
};

export default CallScreen;