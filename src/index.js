import { initMongoDB } from './db/initMongoDb.js';
import { startServer } from './server.js';

const boostrap = async () => {
  await initMongoDB();
  startServer();
};

boostrap();
