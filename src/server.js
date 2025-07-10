import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import { getAllContacts, getContactById } from './services/contacts.js';

const PORT = env('PORT', 3000);

export const setupServer = async () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use(
    pino({
      level: 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
        },
      },
    }),
  );

  app.get('/', (req, res) => {
    res.status(200).json({
      message: 'Welcome to the Contacts API!',
    });
  });

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await getAllContacts();
      res.status(200).json({
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (e) {
      res.status(404).json({
        message: 'Contacts not found!',
        error: e.message,
      });
    }
  });

  app.get('/contacts/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const contact = await getContactById(id);
      res.status(200).json({
        message: 'Successfully found contact!',
        data: contact,
      });
    } catch (e) {
      res.status(404).json({
        message: 'Contact not found!',
        error: e.message,
      });
    }
  });

  app.use((req, res) => {
    res.status(404).json({
      error: 'Not Found',
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Internal Server Error',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};
