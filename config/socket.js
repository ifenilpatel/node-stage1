require('../env.js');

const { Server } = require('socket.io');

const socketOptions = {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingInterval: Number(process.env.SOCKET_PING_INTERVAL) || 25000,
  pingTimeout: Number(process.env.SOCKET_PING_TIMEOUT) || 20000,
  transports: ['websocket', 'polling']
};

let io = null;

const initSocket = (httpServer) => {
  if (io) {
    return io;
  }

  io = new Server(httpServer, socketOptions);

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized. Call initSocket(httpServer) first.');
  }

  return io;
};

const closeSocket = async () => {
  if (!io) {
    return;
  }

  await io.close();
  io = null;
};

module.exports = {
  socketOptions,
  initSocket,
  getIO,
  closeSocket
};
