import Joi from 'joi';

export const createWaterContainerSchema = Joi.object({
  device_id: Joi.number().integer().required(),
  height_cm: Joi.number().precision(2).min(0.001).required(),
  capacity_litres: Joi.number().precision(2).min(0.001).required(),
});

export const updateWaterContainerSchema = Joi.object({
  height_cm: Joi.number().precision(2).min(0.001).optional(),
  capacity_litres: Joi.number().precision(2).min(0.001).optional(),
}).min(1);
