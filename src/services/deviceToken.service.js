import { findAllDeviceTokens, upsertDeviceToken } from '../repositories/deviceToken.repository.js';

export const getAllDeviceTokens = async () => {
  return await findAllDeviceTokens();
};

export const upsertNewDeviceToken = async (androidId, fcmToken) => {
  return await upsertDeviceToken(androidId, fcmToken);
};
