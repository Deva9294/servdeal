import Chat from '../models/Chat.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

export const getOrCreateChat = catchAsync(async (req, res) => {
  const { bookingId, participantId } = req.body;
  let chat = await Chat.findOne({
    booking: bookingId,
    participants: { $all: [req.user._id, participantId] },
  });
  if (!chat) {
    chat = await Chat.create({
      booking: bookingId,
      participants: [req.user._id, participantId],
      messages: [],
    });
  }
  res.json({ success: true, data: chat });
});

export const sendMessage = catchAsync(async (req, res) => {
  const chat = await Chat.findById(req.params.id);
  if (!chat) throw new AppError('Chat not found', 404);
  chat.messages.push({ sender: req.user._id, text: req.body.text });
  chat.lastMessageAt = new Date();
  await chat.save();

  const io = req.app.get('io');
  io?.to(`chat:${chat._id}`).emit('chat:message', {
    chatId: chat._id,
    message: chat.messages[chat.messages.length - 1],
  });

  res.json({ success: true, data: chat });
});

export const getChats = catchAsync(async (req, res) => {
  const chats = await Chat.find({ participants: req.user._id })
    .populate('participants', 'name avatar')
    .sort('-lastMessageAt');
  res.json({ success: true, data: chats });
});
