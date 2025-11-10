import {
  getWaterContainersByDeviceId,
  createNewWaterContainer,
  updateExistingWaterContainer,
  deleteExistingWaterContainer,
} from '../services/waterContainer.service.js';
import {
  createWaterContainerSchema,
  updateWaterContainerSchema,
} from '../validators/waterContainer.validator.js';

export const fetchWaterContainers = async (req, res) => {
  const { deviceId } = req.params;
  try {
    const containers = await getWaterContainersByDeviceId(Number(deviceId));
    res.status(200).json({ success: true, data: containers });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const addWaterContainer = async (req, res) => {
  const { deviceId } = req.params;
  const containerData = req.body;
  try {
    const { error, value } = createWaterContainerSchema.validate(containerData);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const newContainer = await createNewWaterContainer(Number(deviceId), value);
    res.status(201).json({ success: true, data: newContainer });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const modifyWaterContainer = async (req, res) => {
  const { containerId } = req.params;
  const containerData = req.body;
  try {
    const { error, value } = updateWaterContainerSchema.validate(containerData);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const updatedContainer = await updateExistingWaterContainer(Number(containerId), value);
    res.status(200).json({ success: true, data: updatedContainer });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const removeWaterContainer = async (req, res) => {
  const { containerId } = req.params;
  try {
    await deleteExistingWaterContainer(Number(containerId));
    res.status(200).json({ success: true, message: 'Water container deleted successfully' });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};
