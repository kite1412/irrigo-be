import Joi from 'joi';

export const soilMoistureLogSchema = Joi.object({
  device_id: Joi.number().integer().required(),
  moist_value: Joi.number().integer().min(0).max(1023).required(),
  created_at: Joi.date().optional(),
});
