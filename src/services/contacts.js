import { Contact } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = 'createdAt',
  filter = {},
}) => {
  const skip = (page - 1) * perPage;
  const limit = perPage;
  const contactsQuery = Contact.find({ userId: filter.userId });

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  if (filter.isFavourite !== undefined) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [contactsCount, contacts] = await Promise.all([
    Contact.find({ userId: filter.userId })
      .merge(contactsQuery)
      .countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });
  return contact;
};

export const createContact = async (contactData) => {
  const newContact = await Contact.create(contactData);
  return newContact;
};

export const deleteContact = async (contactId, userId) => {
  const deletedContact = await Contact.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return deletedContact;
};

export const updateContact = async (
  contactId,
  contactData,
  userId,
  options = {},
) => {
  const rawResult = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    contactData,
    {
      new: true,
      ...options,
    },
  );

  if (!rawResult) {
    return null;
  }

  return {
    contact: rawResult,
    isNew: false, // findOneAndUpdate ile upsert true ise yeni oluşturulmuş olabilir, ama burada basitçe false bırakıyoruz
  };
};
