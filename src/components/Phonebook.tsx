import React from 'react';
import { Contact } from '../types';
import { Plus, Edit, Trash, X } from 'lucide-react';

interface PhonebookProps {
  contacts: Contact[];
  onSelect: (contact: Contact) => void;
  onAdd: () => void;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const Phonebook: React.FC<PhonebookProps> = ({ contacts, onSelect, onAdd, onEdit, onDelete, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">電話帳</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <button
          onClick={onAdd}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded mb-4 flex items-center justify-center transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          新しい連絡先を追加
        </button>
        <ul className="space-y-2">
          {contacts.map((contact) => (
            <li
              key={contact.id}
              className="flex items-center justify-between p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors duration-200"
            >
              <div onClick={() => onSelect(contact)} className="flex items-center flex-grow cursor-pointer">
                <span className="mr-2">{contact.icon}</span>
                <span className="text-white">{contact.name}</span>
                <span className="ml-auto text-gray-400">{contact.number}</span>
              </div>
              <div className="flex">
                <button
                  onClick={() => onEdit(contact)}
                  className="ml-2 text-blue-400 hover:text-blue-300 p-1 rounded transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(contact.id)}
                  className="ml-2 text-red-400 hover:text-red-300 p-1 rounded transition-colors duration-200"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Phonebook;