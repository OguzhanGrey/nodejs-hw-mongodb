import { Contact } from '../db/contacts.js';

export const getAllContacts = async () => {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw new Error('Could not fetch contacts');
  }
};

export const getContactById = async (id) => {
  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      throw new Error('Contact not found');
    }
    return contact;
  } catch (error) {
    console.error(`Error fetching contact with ID ${id}:`, error);
    throw new Error('Could not fetch contact');
  }
};
