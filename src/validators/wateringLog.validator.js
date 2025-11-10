import Joi from 'joi';

export const wateringLogSchema = Joi.object({
  device_id: Joi.number().integer().required(),
  duration_ms: Joi.number().integer().min(1).required(),
  manual: Joi.boolean().required(),
  created_at: Joi.date().optional(),
});
