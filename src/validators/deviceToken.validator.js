import Joi from 'joi';

export const deviceTokenSchema = Joi.object({
  android_id: Joi.string().required(),
  fcm_token: Joi.string().required(),
});
