const actionRepository = require('./action.repository');
const machineRepository = require('../machines/machine.repository');

const AppError = require('../../shared/errors/AppError');

function toActionResponse(action) {
  const data = action.toJSON();

  return {
    id: data.id,
    machineId: data.machineId,
    requestedByUserId: data.requestedByUserId,
    actionType: data.actionType,
    status: data.status,
    requestedAt: data.requested_at
  };
}

async function requestAction(
  userId,
  machineId,
  actionType
) {
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

  const action =
    await actionRepository.createAction({
      machineId,
      requestedByUserId: userId,
      actionType
    });

  return toActionResponse(action);
}

async function getActionsByMachine(
  userId,
  machineId
) {
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

  const actions =
    await actionRepository.findAllByMachineId(
      machineId
    );

  return actions.map(toActionResponse);
}

async function getActionById(
  userId,
  actionId
) {
  const action =
    await actionRepository.findAccessibleById(
      userId,
      actionId
    );

  if (!action) {
    throw new AppError(
      'Action not found',
      404,
      'ACTION_NOT_FOUND'
    );
  }

  return toActionResponse(action);
}

module.exports = {
  requestAction,
  getActionsByMachine,
  getActionById
};