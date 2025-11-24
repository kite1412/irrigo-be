import admin from '../config/firebase.js';
import { getAllDeviceTokens } from './deviceToken.service.js';

export const sendNotification = async (data = {}) => {
  const deviceTokens = await getAllDeviceTokens();
  console.log(deviceTokens);
  if (deviceTokens.length === 0) {
    console.log('No device available for FCM notification.');
    return;
  }

  const tokens = deviceTokens.map((dt) => dt.fcm_token);
  const message = {
    tokens,
    // notification: { title, body },
    data: Object.fromEntries(Object.entries(data).map(([key, value]) => [key, String(value)])),
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);

    response.responses.forEach((res, idx) => {
      if (!res.success) {
        console.error('Error token:', tokens[idx], res.error);
      }
    });
  } catch (error) {
    console.error('Error sending FCM notification:', error);
  }
};

export const sendDummyNotification = async (title, body) => {
  await sendNotification({ type: 'dummy', title, body, timestamp: new Date() });
};
