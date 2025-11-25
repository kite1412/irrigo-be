import dotenv from 'dotenv';
import express from 'express';
import soilMoistureLogRoutes from './routes/soilMoistureLog.route.js';
import deviceRoutes from './routes/device.route.js';
import waterContainerRoutes from './routes/waterContainer.route.js';
import waterCapacityLogRoutes from './routes/waterCapacityLog.route.js';
import wateringLogRoutes from './routes/wateringLog.route.js';
import lightIntensityLogRoutes from './routes/lightIntensityLog.route.js';
import wateringConfigRoutes from './routes/wateringConfig.route.js';
import waterCapacityConfigRoutes from './routes/waterCapacityConfig.route.js';
import deviceTokenRoutes from './routes/deviceToken.route.js';
import fcmRoutes from './routes/fcm.route.js';
// import mqtt service
import './services/mqtt.service.js';
// import cors from 'cors';

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/soil-moisture-logs', soilMoistureLogRoutes);
app.use('/devices', deviceRoutes);
app.use('/light-intensity-logs', lightIntensityLogRoutes);
app.use('/water-containers', waterContainerRoutes);
app.use('/water-capacity-logs', waterCapacityLogRoutes);
app.use('/watering-logs', wateringLogRoutes);
app.use('/watering-config', wateringConfigRoutes);
app.use('/water-capacity-config', waterCapacityConfigRoutes);
app.use('/register-device-token', deviceTokenRoutes);
app.use('/fcm', fcmRoutes);

export default app;
