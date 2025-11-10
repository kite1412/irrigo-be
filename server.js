import http from 'http';
import app from './src/app.js';
import { setupWebSocket } from './src/services/websocket.service.js';

const PORT = process.env.PORT || 5001;
const server = http.createServer(app);

setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
