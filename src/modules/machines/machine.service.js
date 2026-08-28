const machineRepository = require('./machine.repository');
const buildingRepository = require('../buildings/building.repository');

const AppError = require('../../shared/errors/AppError');

function toMachineResponse(machine) {
  const data = machine.toJSON();

  return {
    id: data.id,
    buildingId: data.buildingId,
    name: data.name,
    serialNumber: data.serialNumber,
    status: data.status
  };
}

async function getMachinesByBuilding(userId, buildingId) {
  const building =
    await buildingRepository.findAccessibleById(
      userId,
      buildingId
    );

  if (!building) {
    throw new AppError(
      'Building not found',
      404,
      'BUILDING_NOT_FOUND'
    );
  }

  const machines =
    await machineRepository.findAllByBuildingId(buildingId);

  return machines.map(toMachineResponse);
}

async function getMachineById(userId, machineId) {
  const machine =
    await machineRepository.findAccessibleById(
      userId,
      machineId
    );

  if (!machine) {
    throw new AppError(
      'Machine not found',
      404,
      'MACHINE_NOT_FOUND'
    );
  }

  return toMachineResponse(machine);
}

async function updateMachineStatus(userId, machineId, status) {
  const machine =
    await machineRepository.findAccessibleById(
      userId,
      machineId
    );

  if (!machine) {
    throw new AppError(
      'Machine not found',
      404,
      'MACHINE_NOT_FOUND'
    );
  }

  const permission =
    machine.building.userPermissions[0];

  if (!permission.canControl) {
    throw new AppError(
      'Control permission required',
      403,
      'CONTROL_PERMISSION_REQUIRED'
    );
  }

  const updatedMachine =
    await machineRepository.updateStatus(
      machine,
      status
    );

  return toMachineResponse(updatedMachine);
}

module.exports = {
  getMachinesByBuilding,
  getMachineById,
  updateMachineStatus
};