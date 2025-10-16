const Joi = require('joi');

/**
 * Validation schema cho translation request
 */
const translateSchema = Joi.object({
  text: Joi.string()
    .required()
    .min(1)
    .max(5000)
    .messages({
      'string.base': 'Text must be a string',
      'string.empty': 'Text cannot be empty',
      'string.min': 'Text must be at least 1 character long',
      'string.max': 'Text must not exceed 5000 characters',
      'any.required': 'Text is required',
    }),
  sourceLang: Joi.string()
    .valid('auto', 'en', 'zh', 'zh-CN', 'zh-TW')
    .default('auto')
    .messages({
      'string.base': 'Source language must be a string',
      'any.only': 'Source language must be one of: auto, en, zh, zh-CN, zh-TW',
    }),
});

/**
 * Validation schema cho chat message request
 */
const chatSchema = Joi.object({
  message: Joi.string()
    .required()
    .min(1)
    .max(2000)
    .messages({
      'string.base': 'Message must be a string',
      'string.empty': 'Message cannot be empty',
      'string.min': 'Message must be at least 1 character long',
      'string.max': 'Message must not exceed 2000 characters',
      'any.required': 'Message is required',
    }),
  language: Joi.string()
    .valid('auto', 'en', 'zh', 'vi')
    .default('auto')
    .messages({
      'string.base': 'Language must be a string',
      'any.only': 'Language must be one of: auto, en, zh, vi',
    }),
});

/**
 * Validation schema cho detect language request
 */
const detectLanguageSchema = Joi.object({
  text: Joi.string()
    .required()
    .min(1)
    .max(1000)
    .messages({
      'string.base': 'Text must be a string',
      'string.empty': 'Text cannot be empty',
      'string.min': 'Text must be at least 1 character long',
      'string.max': 'Text must not exceed 1000 characters',
      'any.required': 'Text is required',
    }),
});

/**
 * Validation schema cho batch translate request
 */
const batchTranslateSchema = Joi.object({
  texts: Joi.array()
    .items(
      Joi.string()
        .min(1)
        .max(2000)
        .messages({
          'string.base': 'Each text must be a string',
          'string.empty': 'Text cannot be empty',
          'string.min': 'Text must be at least 1 character long',
          'string.max': 'Text must not exceed 2000 characters',
        })
    )
    .min(1)
    .max(50)
    .required()
    .messages({
      'array.base': 'Texts must be an array',
      'array.min': 'At least one text is required',
      'array.max': 'Maximum 50 texts can be translated at once',
      'any.required': 'Texts array is required',
    }),
  sourceLang: Joi.string()
    .valid('auto', 'en', 'zh', 'zh-CN', 'zh-TW')
    .default('auto')
    .messages({
      'string.base': 'Source language must be a string',
      'any.only': 'Source language must be one of: auto, en, zh, zh-CN, zh-TW',
    }),
});

/**
 * Validation schema cho chat with history request
 */
const chatWithHistorySchema = Joi.object({
  message: Joi.string()
    .required()
    .min(1)
    .max(2000)
    .messages({
      'string.base': 'Message must be a string',
      'string.empty': 'Message cannot be empty',
      'string.min': 'Message must be at least 1 character long',
      'string.max': 'Message must not exceed 2000 characters',
      'any.required': 'Message is required',
    }),
  history: Joi.array()
    .items(
      Joi.object({
        userMessage: Joi.string().required().messages({
          'any.required': 'User message is required in history',
        }),
        aiResponse: Joi.string().required().messages({
          'any.required': 'AI response is required in history',
        }),
      })
    )
    .max(20)
    .default([])
    .messages({
      'array.base': 'History must be an array',
      'array.max': 'History can contain maximum 20 conversations',
    }),
});

module.exports = {
  translateSchema,
  chatSchema,
  detectLanguageSchema,
  batchTranslateSchema,
  chatWithHistorySchema,
};
