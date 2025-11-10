import dotenv from 'dotenv';
import express from 'express';
import client from './services/mqtt.service.js';
import soilMoistureLogRoutes from './routes/soilMoistureLog.route.js';
import deviceRoutes from './routes/device.route.js';
import waterContainerRoutes from './routes/waterContainer.route.js';
import waterCapacityLogRoutes from './routes/waterCapacityLog.route.js';
import wateringLogRoutes from './routes/wateringLog.route.js';
// import cors from 'cors';

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/soil-moisture-logs', soilMoistureLogRoutes);
app.use('/devices', deviceRoutes);
app.use('/water-containers', waterContainerRoutes);
app.use('/water-capacity-logs', waterCapacityLogRoutes);
app.use('/watering-logs', wateringLogRoutes);

export default app;
