export const initSocket = (io) => {
  io.on('connection', (socket) => {
    socket.on('join:booking', (bookingId) => {
      socket.join(`booking:${bookingId}`);
    });

    socket.on('join:chat', (chatId) => {
      socket.join(`chat:${chatId}`);
    });

    socket.on('join:user', (userId) => {
      socket.join(`user:${userId}`);
    });

    socket.on('typing', ({ chatId, userId }) => {
      socket.to(`chat:${chatId}`).emit('chat:typing', { userId });
    });

    socket.on('location:update', ({ bookingId, lat, lng }) => {
      io.to(`booking:${bookingId}`).emit('location:update', { lat, lng });
    });

    socket.on('disconnect', () => {});
  });
};
