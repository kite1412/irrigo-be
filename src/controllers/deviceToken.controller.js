import { upsertNewDeviceToken } from '../services/deviceToken.service.js';
import { deviceTokenSchema } from '../validators/deviceToken.validator.js';

export const registerDeviceToken = async (req, res) => {
  try {
    const { error, value } = deviceTokenSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { android_id, fcm_token } = value;
    const deviceToken = await upsertNewDeviceToken(android_id, fcm_token);
    res.status(200).json({ success: true, data: deviceToken });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};
