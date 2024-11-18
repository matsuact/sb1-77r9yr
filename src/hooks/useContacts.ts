import { useState, useEffect } from 'react';
import { Contact } from '../types';
import { log } from '../utils/logger';

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const storedContacts = localStorage.getItem('contacts');
    if (storedContacts) {
      setContacts(JSON.parse(storedContacts));
    }
  }, []);

  const saveContacts = (newContacts: Contact[]) => {
    localStorage.setItem('contacts', JSON.stringify(newContacts));
    setContacts(newContacts);
  };

  const addContact = (contact: Omit<Contact, 'id'>) => {
    const newContact = { ...contact, id: Date.now().toString() };
    const updatedContacts = [...contacts, newContact];
    saveContacts(updatedContacts);
    log('Contact added successfully');
  };

  const updateContact = (updatedContact: Contact) => {
    const updatedContacts = contacts.map(c => 
      c.id === updatedContact.id ? updatedContact : c
    );
    saveContacts(updatedContacts);
    log('Contact updated successfully');
  };

  const deleteContact = (id: string) => {
    const updatedContacts = contacts.filter(c => c.id !== id);
    saveContacts(updatedContacts);
    log('Contact deleted successfully');
  };

  return { contacts, addContact, updateContact, deleteContact };
};