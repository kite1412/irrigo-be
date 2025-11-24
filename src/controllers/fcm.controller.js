import { sendDummyNotification } from '../services/fcm.service.js';

export const testNotification = async (req, res, next) => {
  try {
    const { msg } = req.body;
    await sendDummyNotification(msg || 'This is a test notification');
    res.status(200).json({ message: 'Test notification sent successfully' });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};
