const express = require('express');

const authentication =
  require('../../middleware/authentication');

const validate =
  require('../../middleware/validate');

const {
  buildingIdParamsSchema
} = require('../buildings/building.validation');

const {
  machineIdParamsSchema,
  updateMachineStatusSchema
} = require('./machine.validation');

const machineController =
  require('./machine.controller');


const buildingMachinesRouter =
  express.Router({
    mergeParams: true
  });

const machineRouter =
  express.Router();


buildingMachinesRouter.get(
  '/',
  authentication,
  validate(buildingIdParamsSchema, 'params'),
  machineController.getMachinesByBuilding
);


machineRouter.get(
  '/:machineId',
  authentication,
  validate(machineIdParamsSchema, 'params'),
  machineController.getMachineById
);


machineRouter.patch(
  '/:machineId/status',
  authentication,
  validate(machineIdParamsSchema, 'params'),
  validate(updateMachineStatusSchema, 'body'),
  machineController.updateMachineStatus
);


module.exports = {
  buildingMachinesRouter,
  machineRouter
};