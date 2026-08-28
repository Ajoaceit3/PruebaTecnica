const machineService = require('./machine.service');

async function getMachinesByBuilding(req, res, next) {
  try {
    const { buildingId } = req.validated.params;

    const machines =
      await machineService.getMachinesByBuilding(
        req.user.id,
        buildingId
      );

    return res.status(200).json({
      data: machines
    });
  } catch (error) {
    return next(error);
  }
}

async function getMachineById(req, res, next) {
  try {
    const { machineId } = req.validated.params;

    const machine =
      await machineService.getMachineById(
        req.user.id,
        machineId
      );

    return res.status(200).json({
      data: machine
    });
  } catch (error) {
    return next(error);
  }
}

async function updateMachineStatus(req, res, next) {
  try {
    const { machineId } = req.validated.params;
    const { status } = req.validated.body;

    const machine =
      await machineService.updateMachineStatus(
        req.user.id,
        machineId,
        status
      );

    req.log.info(
      {
        userId: req.user.id,
        machineId,
        status
      },
      'Machine status updated'
    );

    return res.status(200).json({
      data: machine
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getMachinesByBuilding,
  getMachineById,
  updateMachineStatus
};