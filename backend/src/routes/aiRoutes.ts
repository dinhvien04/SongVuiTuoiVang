import express from 'express';
import { chat, chatStream } from '../controllers/aiController';

const router = express.Router();

/**
 * @route   POST /api/ai/chat
 * @desc    Chat với AI chatbot
 * @access  Public
 */
router.post('/chat', chat);

/**
 * @route   POST /api/ai/chat/stream
 * @desc    Chat với AI chatbot (streaming)
 * @access  Public
 */
router.post('/chat/stream', chatStream);

export default router;

