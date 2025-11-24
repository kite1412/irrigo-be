import { sendDummyNotification } from '../services/fcm.service.js';

export const testNotification = async (req, res) => {
  try {
    const { title, body } = req.body;
    await sendDummyNotification(
      title || 'Test Notification',
      body || 'This is a test notification'
    );
    res.status(200).json({ message: 'Test notification sent successfully' });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};
