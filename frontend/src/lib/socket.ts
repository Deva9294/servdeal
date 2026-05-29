import { io, Socket } from 'socket.io-client';

const URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(URL, { autoConnect: false, transports: ['websocket', 'polling'] });
  }
  return socket;
};
