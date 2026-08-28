const buildingRepository = require('./building.repository');
const AppError = require('../../shared/errors/AppError');

function toBuildingResponse(building) {
  const data = building.toJSON();

  const permission = data.userPermissions[0];

  return {
    id: data.id,
    name: data.name,
    address: data.address,

    permissions: {
      read: permission.canRead,
      control: permission.canControl
    }
  };
}

async function getAccessibleBuildings(userId) {
  const buildings =
    await buildingRepository.findAccessibleByUserId(userId);

  return buildings.map(toBuildingResponse);
}

async function getAccessibleBuildingById(userId, buildingId) {
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

  return toBuildingResponse(building);
}

module.exports = {
  getAccessibleBuildings,
  getAccessibleBuildingById
};