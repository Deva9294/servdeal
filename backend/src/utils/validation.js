// Validation schemas for KritiX
import Joi from 'joi';

// Auth validation
export const validateSignup = Joi.object({
  name: Joi.string().required().min(2).max(100),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6).max(100),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')),
});

export const validateLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Channel validation
export const validateChannelCreate = Joi.object({
  name: Joi.string().required().min(3).max(100),
  description: Joi.string().max(1000),
  category: Joi.string()
    .valid('Education', 'Entertainment', 'Gaming', 'Music', 'News', 'Sports', 'Tech', 'Other')
    .default('Other'),
});

export const validateChannelUpdate = Joi.object({
  name: Joi.string().min(3).max(100),
  description: Joi.string().max(1000),
  logo: Joi.string().uri(),
  banner: Joi.string().uri(),
  category: Joi.string().valid(
    'Education',
    'Entertainment',
    'Gaming',
    'Music',
    'News',
    'Sports',
    'Tech',
    'Other'
  ),
  aiSettings: Joi.object({
    defaultVoiceType: Joi.string().valid('male', 'female', 'neutral'),
    defaultLanguage: Joi.string().length(2),
    defaultStyle: Joi.string().valid(
      'educational',
      'entertainment',
      'news',
      'tutorial',
      'storytelling'
    ),
  }),
});

// Video validation
export const validateVideoCreate = Joi.object({
  title: Joi.string().required().min(3).max(200),
  description: Joi.string().max(5000),
  channelId: Joi.string().required().hex().length(24),
  tags: Joi.array().items(Joi.string()).max(30),
  category: Joi.string()
    .valid('Education', 'Entertainment', 'Gaming', 'Music', 'News', 'Sports', 'Tech', 'Other')
    .default('Other'),
  visibility: Joi.string().valid('public', 'private', 'unlisted').default('private'),
});

export const validateVideoUpdate = Joi.object({
  title: Joi.string().min(3).max(200),
  description: Joi.string().max(5000),
  tags: Joi.array().items(Joi.string()).max(30),
  visibility: Joi.string().valid('public', 'private', 'unlisted'),
});

// AI Generation validation
export const validateAIGeneration = Joi.object({
  channelId: Joi.string().required().hex().length(24),
  prompt: Joi.string().required().min(10).max(2000),
  duration: Joi.number().default(300).min(60).max(3600),
  style: Joi.string()
    .valid('educational', 'entertainment', 'news', 'tutorial', 'storytelling')
    .default('educational'),
  language: Joi.string().length(2).default('en'),
});

// Comment validation
export const validateComment = Joi.object({
  content: Joi.string().required().min(1).max(5000),
});

// Payment validation
export const validatePayment = Joi.object({
  plan: Joi.string().valid('free', 'pro', 'enterprise').required(),
  paymentMethod: Joi.string().valid('card', 'upi', 'netbanking', 'wallet'),
});

// Utility validation function
export const validate = (schema, data) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    throw { status: 400, message: 'Validation error', errors };
  }

  return value;
};

export default {
  validateSignup,
  validateLogin,
  validateChannelCreate,
  validateChannelUpdate,
  validateVideoCreate,
  validateVideoUpdate,
  validateAIGeneration,
  validateComment,
  validatePayment,
  validate,
};
