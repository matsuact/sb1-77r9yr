import React, { useState, useCallback, useEffect } from 'react';
import { Phone, Book } from 'lucide-react';
import DialPad from './components/DialPad';
import CallButton from './components/CallButton';
import CallerInfo from './components/CallerInfo';
import Phonebook from './components/Phonebook';
import DebugOverlay from './components/DebugOverlay';
import ErrorModal from './components/ErrorModal';
import ContactForm from './components/ContactForm';
import CallScreen from './components/CallScreen';
import PageTransition from './components/PageTransition';
import useVoiceCall from './hooks/useVoiceCall';
import { useContacts } from './hooks/useContacts';
import { Contact } from './types';
import { log } from './utils/logger';
import './styles/transitions.css';

const App: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [showPhonebook, setShowPhonebook] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [showDebugOverlay, setShowDebugOverlay] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const { contacts, addContact, updateContact, deleteContact } = useContacts();
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const { 
    startCall,
    endCall,
    startListening,
    stopListening,
    isListening,
    transcript, 
    chatHistory,
    synthesizeAndPlayAudio,
    error
  } = useVoiceCall(apiKey, currentContact?.systemPrompt || '');

  const handleCornerTap = useCallback(() => {
    setTapCount(prevCount => {
      if (prevCount === 4) {
        setShowDebugOverlay(prev => {
          const newState = !prev;
          log(newState ? 'デバッグオーバーレイ表示' : 'デバッグオーバーレイ非表示');
          return newState;
        });
        return 0;
      }
      return prevCount + 1;
    });
  }, []);

  const handleDial = (digit: string) => {
    setPhoneNumber(prev => prev + digit);
    log(`ダイヤル: ${digit}`);
  };

  const handleDelete = () => {
    setPhoneNumber(prev => prev.slice(0, -1));
    log('最後の数字を削除');
  };

  const handleClear = () => {
    setPhoneNumber('');
    log('電話番号クリア');
  };

  const handleCall = () => {
    const contact = contacts.find(c => c.number === phoneNumber);
    if (isCalling) {
      endCall();
      setIsCalling(false);
      setCurrentContact(null);
    } else if (contact) {
      startCall();
      setIsCalling(true);
      setCurrentContact(contact);
    } else {
      setErrorMessage('おかけになった電話番号は現在使われておりません。');
      setShowErrorModal(true);
      setPhoneNumber('');
      log('無効な電話番号');
    }
  };

  const handleSpeakerToggle = () => {
    setSpeakerOn(!speakerOn);
    log(`スピーカー: ${!speakerOn ? 'オン' : 'オフ'}`);
  };

  const handleContactSelect = (contact: Contact) => {
    setPhoneNumber(contact.number);
    setShowPhonebook(false);
    log(`連絡先選択: ${contact.name}`);
  };

  const handleAddContact = () => {
    setEditingContact(null);
    setShowContactForm(true);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setShowContactForm(true);
  };

  const handleSaveContact = (contact: Contact) => {
    if (editingContact) {
      updateContact(contact);
    } else {
      addContact(contact);
    }
    setShowContactForm(false);
    setEditingContact(null);
  };

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      setShowErrorModal(true);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="absolute top-0 right-0 w-16 h-16" onClick={handleCornerTap}></div>
        <PageTransition isVisible={!isCalling}>
          <div className="h-[600px] flex flex-col">
            <CallerInfo name="電話" icon={<Phone className="w-12 h-12 text-blue-500" />} />
            <div className="mt-4 flex items-center">
              <input
                type="text"
                value={phoneNumber}
                readOnly
                className="w-full p-2 text-2xl text-center border rounded bg-gray-700 text-white"
              />
              <button
                onClick={() => setShowPhonebook(!showPhonebook)}
                className="ml-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors duration-200"
              >
                <Book className="w-6 h-6" />
              </button>
            </div>
            <DialPad onDial={handleDial} onDelete={handleDelete} onClear={handleClear} />
            <div className="flex justify-center mt-4">
              <CallButton isCalling={isCalling} onClick={handleCall} />
            </div>
          </div>
        </PageTransition>
        <PageTransition isVisible={isCalling}>
          <CallScreen
            contact={currentContact}
            transcript={transcript}
            chatHistory={chatHistory}
            onEndCall={handleCall}
            onSpeakerToggle={handleSpeakerToggle}
            speakerOn={speakerOn}
            synthesizeAndPlayAudio={synthesizeAndPlayAudio}
            startListening={startListening}
            stopListening={stopListening}
          />
        </PageTransition>
      </div>
      {showPhonebook && (
        <Phonebook 
          contacts={contacts} 
          onSelect={handleContactSelect} 
          onAdd={handleAddContact}
          onEdit={handleEditContact}
          onDelete={deleteContact}
          onClose={() => setShowPhonebook(false)}
        />
      )}
      <DebugOverlay isVisible={showDebugOverlay} onClose={() => setShowDebugOverlay(false)} />
      <ErrorModal 
        isVisible={showErrorModal} 
        message={errorMessage} 
        onClose={() => {
          setShowErrorModal(false);
          setErrorMessage('');
        }} 
      />
      {showContactForm && (
        <ContactForm
          contact={editingContact}
          onSave={handleSaveContact}
          onCancel={() => setShowContactForm(false)}
        />
      )}
    </div>
  );
};

export default App;