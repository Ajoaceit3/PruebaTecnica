const express = require('express');

const validate = require('../../middleware/validate');
const authentication = require('../../middleware/authentication');

const buildingController = require('./building.controller');

const {
  buildingIdParamsSchema
} = require('./building.validation');

const router = express.Router();

router.get(
  '/',
  authentication,
  buildingController.getBuildings
);

router.get(
  '/:buildingId',
  authentication,
  validate(buildingIdParamsSchema, 'params'),
  buildingController.getBuildingById
);

module.exports = router;