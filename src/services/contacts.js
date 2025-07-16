import { Contact } from '../db/models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await Contact.findOne({ _id: contactId });
  return contact;
};

export const createContact = async (contactData) => {
  const newContact = await Contact.create(contactData);
  return newContact;
};

export const deleteContact = async (contactId) => {
  const deletedContact = await Contact.findByIdAndDelete(contactId);
  return deletedContact;
};

export const updateContact = async (contactId, contactData, options = {}) => {
  const rawResult = await Contact.findByIdAndUpdate(
    { _id: contactId },
    contactData,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult) {
    return null;
  }

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject?.upserted),
  };
};
