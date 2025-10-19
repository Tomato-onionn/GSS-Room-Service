const Joi = require('joi');

/**
 * Validation schema cho tạo feedback
 */
const createFeedbackSchema = Joi.object({
  module_type: Joi.string()
    .valid('meeting_room', 'mentor', 'user', 'course', 'system', 'chatbot', 'other')
    .required()
    .messages({
      'any.required': 'Module type is required',
      'any.only': 'Module type must be one of: meeting_room, mentor, user, course, system, chatbot, other'
    }),
  module_id: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .messages({
      'number.base': 'Module ID must be a number',
      'number.integer': 'Module ID must be an integer',
      'number.positive': 'Module ID must be positive'
    }),
  user_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'User ID is required',
      'number.base': 'User ID must be a number',
      'number.integer': 'User ID must be an integer',
      'number.positive': 'User ID must be positive'
    }),
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      'any.required': 'Rating is required',
      'number.base': 'Rating must be a number',
      'number.integer': 'Rating must be an integer',
      'number.min': 'Rating must be between 1 and 5',
      'number.max': 'Rating must be between 1 and 5'
    }),
  comment: Joi.string()
    .max(2000)
    .allow('', null)
    .messages({
      'string.base': 'Comment must be a string',
      'string.max': 'Comment must not exceed 2000 characters'
    })
});

/**
 * Validation schema cho cập nhật feedback
 */
const updateFeedbackSchema = Joi.object({
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .messages({
      'number.base': 'Rating must be a number',
      'number.integer': 'Rating must be an integer',
      'number.min': 'Rating must be between 1 and 5',
      'number.max': 'Rating must be between 1 and 5'
    }),
  comment: Joi.string()
    .max(2000)
    .allow('', null)
    .messages({
      'string.base': 'Comment must be a string',
      'string.max': 'Comment must not exceed 2000 characters'
    }),
  status: Joi.string()
    .valid('pending', 'reviewed', 'resolved', 'archived')
    .messages({
      'any.only': 'Status must be one of: pending, reviewed, resolved, archived'
    })
}).min(1);

/**
 * Validation schema cho phản hồi feedback
 */
const respondFeedbackSchema = Joi.object({
  admin_response: Joi.string()
    .required()
    .max(2000)
    .messages({
      'any.required': 'Admin response is required',
      'string.base': 'Admin response must be a string',
      'string.max': 'Admin response must not exceed 2000 characters'
    }),
  responded_by: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'Responded by is required',
      'number.base': 'Responded by must be a number',
      'number.integer': 'Responded by must be an integer',
      'number.positive': 'Responded by must be positive'
    }),
  status: Joi.string()
    .valid('pending', 'reviewed', 'resolved', 'archived')
    .default('reviewed')
    .messages({
      'any.only': 'Status must be one of: pending, reviewed, resolved, archived'
    })
});

/**
 * Validation schema cho query parameters
 */
const queryParamsSchema = Joi.object({
  page: Joi.number()
    .integer()
    .positive()
    .default(1)
    .messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.positive': 'Page must be positive'
    }),
  limit: Joi.number()
    .integer()
    .positive()
    .max(100)
    .default(20)
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.positive': 'Limit must be positive',
      'number.max': 'Limit must not exceed 100'
    }),
  status: Joi.string()
    .valid('pending', 'reviewed', 'resolved', 'archived')
    .messages({
      'any.only': 'Status must be one of: pending, reviewed, resolved, archived'
    }),
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .messages({
      'number.base': 'Rating must be a number',
      'number.integer': 'Rating must be an integer',
      'number.min': 'Rating must be between 1 and 5',
      'number.max': 'Rating must be between 1 and 5'
    }),
  module_type: Joi.string()
    .valid('meeting_room', 'mentor', 'user', 'course', 'system', 'chatbot', 'other')
    .messages({
      'any.only': 'Module type must be one of: meeting_room, mentor, user, course, system, chatbot, other'
    }),
  module_id: Joi.number()
    .integer()
    .positive()
    .messages({
      'number.base': 'Module ID must be a number',
      'number.integer': 'Module ID must be an integer',
      'number.positive': 'Module ID must be positive'
    })
});

module.exports = {
  createFeedbackSchema,
  updateFeedbackSchema,
  respondFeedbackSchema,
  queryParamsSchema
};
