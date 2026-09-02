import 'dotenv/config';
import { app } from './app.js';
import { serverConfig } from './config.js';

app.listen(serverConfig.port, 'localhost', () => {
  console.log(`API http://localhost:${serverConfig.port} adresinde çalışıyor.`);
});
