import mqtt from 'mqtt';
import { createNewWaterCapacityLog } from './waterCapacityLog.service.js';
import { createNewSoilMoistureLog } from './soilMoistureLog.service.js';

const mqttServer = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
const client = mqtt.connect(mqttServer);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('devices/+/+', { qos: 1 }, (err) => {
    if (err) console.error('Subscribe error', err);
    else console.log('Subscribed to all devices');
  });
});

client.on('message', async (topic, message) => {
  const payload = message.toString();

  console.log('---------------------------------');
  console.log('MQTT message received:');
  console.log('Topic :', topic);
  console.log('Message :', payload);
  console.log('---------------------------------');

  const parts = topic.split('/'); // ['devices', '1', 'soil']
  if (parts.length !== 3) return;

  const device_id = parseInt(parts[1]);
  const sensorType = parts[2];

  try {
    switch (sensorType) {
      case 'ultrasonic':
        await createNewWaterCapacityLog({ device_id, distance: parseInt(payload) });
        break;
      case 'soil':
        await createNewSoilMoistureLog({ device_id, moist_value: parseInt(payload) });
        break;
      default:
        console.log(`Unknown sensor type: ${sensorType}`);
    }
  } catch (err) {
    console.error('Error saving sensor data:', err);
  }
});

export default client;
