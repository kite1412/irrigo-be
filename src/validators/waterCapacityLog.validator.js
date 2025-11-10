import Joi from 'joi';

export const waterCapacityLogSchema = Joi.object({
  device_id: Joi.number().integer().required(),
  current_height_cm: Joi.number().precision(2).min(0).required(),
  current_litres: Joi.number().precision(2).min(0).required(),
  created_at: Joi.date().optional(),
});
