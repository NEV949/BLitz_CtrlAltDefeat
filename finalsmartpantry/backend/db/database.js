import Datastore from 'nedb-promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storageDir = path.join(__dirname, 'storage');

export const usersDb = Datastore.create({
  filename: path.join(storageDir, 'users.db'),
  autoload: true,
  timestampData: true
});

usersDb.ensureIndex({ fieldName: 'email', unique: true });
