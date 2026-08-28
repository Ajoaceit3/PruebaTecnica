const {
  Building,
  UserBuildingPermission
} = require('../../database/models');

async function findAccessibleByUserId(userId) {
  return Building.findAll({
    attributes: [
      'id',
      'name',
      'address',
      'created_at',
      'updated_at'
    ],

    include: [
      {
        model: UserBuildingPermission,
        as: 'userPermissions',

        where: {
          userId,
          canRead: true
        },

        attributes: [
          'canRead',
          'canControl'
        ],

        required: true
      }
    ],

    order: [['id', 'ASC']]
  });
}

async function findAccessibleById(userId, buildingId) {
  return Building.findOne({
    where: {
      id: buildingId
    },

    attributes: [
      'id',
      'name',
      'address'
    ],

    include: [
      {
        model: UserBuildingPermission,
        as: 'userPermissions',

        where: {
          userId,
          canRead: true
        },

        attributes: [
          'canRead',
          'canControl'
        ],

        required: true
      }
    ]
  });
}

module.exports = {
  findAccessibleByUserId,
  findAccessibleById
};