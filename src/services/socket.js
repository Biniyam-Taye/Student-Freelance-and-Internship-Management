import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

let socket = null;

export const connectSocket = (token) => {
    socket = io(SOCKET_URL, {
        auth: { token },
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    });
    socket.connect();
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const getSocket = () => socket;

export const emitEvent = (event, data) => {
    if (socket) socket.emit(event, data);
};

export const onEvent = (event, callback) => {
    if (socket) socket.on(event, callback);
};

export const offEvent = (event) => {
    if (socket) socket.off(event);
};

export default { connectSocket, disconnectSocket, getSocket, emitEvent, onEvent, offEvent };
