const express = require('express');

const authentication =
  require('../../middleware/authentication');

const validate =
  require('../../middleware/validate');

const {
  machineIdParamsSchema
} = require('../machines/machine.validation');

const {
  actionIdParamsSchema,
  requestActionSchema
} = require('./action.validation');

const actionController =
  require('./action.controller');


const machineActionsRouter =
  express.Router({
    mergeParams: true
  });

const actionRouter =
  express.Router();


machineActionsRouter.post(
  '/',
  authentication,
  validate(machineIdParamsSchema, 'params'),
  validate(requestActionSchema, 'body'),
  actionController.requestAction
);


machineActionsRouter.get(
  '/',
  authentication,
  validate(machineIdParamsSchema, 'params'),
  actionController.getActionsByMachine
);


actionRouter.get(
  '/:actionId',
  authentication,
  validate(actionIdParamsSchema, 'params'),
  actionController.getActionById
);


module.exports = {
  machineActionsRouter,
  actionRouter
};