const Joi = require('joi');

const createMeetingRoomSchema = Joi.object({
  room_name: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Room name must be at least 3 characters',
    'string.max': 'Room name cannot exceed 100 characters',
    'any.required': 'Room name is required'
  }),
  mentor_id: Joi.number().integer().positive().required().messages({
    'number.positive': 'Mentor ID must be a positive number',
    'any.required': 'Mentor ID is required'
  }),
  user_id: Joi.number().integer().positive().required().messages({
    'number.positive': 'User ID must be a positive number',
    'any.required': 'User ID is required'
  }),
  start_time: Joi.date().iso().required().messages({
    'any.required': 'Start time is required'
  }),
  end_time: Joi.date().iso().greater(Joi.ref('start_time')).optional().messages({
    'date.greater': 'End time must be after start time'
  }),
  details: Joi.object({
    // Accept either a full URL or a short code (alphanumeric, 4-32 chars)
    meeting_link: Joi.alternatives().try(
      Joi.string().uri(),
      Joi.string().pattern(/^[A-Za-z0-9_-]{4,32}$/)
    ).optional().messages({
      'string.uri': 'Meeting link must be a valid URL',
      'string.pattern.base': 'Meeting link code must be 4-32 chars, alphanumeric, - or _'
    }),
    meeting_password: Joi.string().max(50).optional(),
    notes: Joi.string().optional(),
    recorded_url: Joi.string().uri().optional().messages({
      'string.uri': 'Recorded URL must be a valid URL'
    })
  }).optional(),
  participants: Joi.array().items(Joi.number().integer().positive()).optional()
});

const updateMeetingRoomSchema = Joi.object({
  room_name: Joi.string().min(3).max(100).optional(),
  mentor_id: Joi.number().integer().positive().optional(),
  user_id: Joi.number().integer().positive().optional(),
  start_time: Joi.date().iso().optional(),
  end_time: Joi.date().iso().optional(),
    details: Joi.object({
    // Accept either a full URL or a short code (alphanumeric, 4-32 chars)
    meeting_link: Joi.alternatives().try(
      Joi.string().uri(),
      Joi.string().pattern(/^[A-Za-z0-9_-]{4,32}$/)
    ).optional(),
    meeting_password: Joi.string().max(50).optional(),
    notes: Joi.string().optional(),
    recorded_url: Joi.string().uri().optional()
  }).optional(),
  participants: Joi.array().items(Joi.number().integer().positive()).optional()
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('scheduled', 'ongoing', 'completed', 'canceled').required().messages({
    'any.only': 'Status must be one of: scheduled, ongoing, completed, canceled',
    'any.required': 'Status is required'
  })
});

const addParticipantsSchema = Joi.object({
  userIds: Joi.array().items(Joi.number().integer().positive()).min(1).required().messages({
    'array.min': 'At least one user ID is required',
    'any.required': 'User IDs are required'
  })
});

module.exports = {
  createMeetingRoomSchema,
  updateMeetingRoomSchema,
  updateStatusSchema,
  addParticipantsSchema
};