const buildingService = require('./building.service');

async function getBuildings(req, res, next) {
  try {
    const buildings =
      await buildingService.getAccessibleBuildings(req.user.id);

    return res.status(200).json({
      data: buildings
    });
  } catch (error) {
    return next(error);
  }
}

async function getBuildingById(req, res, next) {
  try {
    const { buildingId } = req.validated.params;

    const building =
      await buildingService.getAccessibleBuildingById(
        req.user.id,
        buildingId
      );

    return res.status(200).json({
      data: building
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getBuildings,
  getBuildingById
};