const {
  Machine,
  Building,
  UserBuildingPermission
} = require('../../database/models');

async function findAllByBuildingId(buildingId) {
  return Machine.findAll({
    where: {
      buildingId
    },

    attributes: [
      'id',
      'buildingId',
      'name',
      'serialNumber',
      'status'
    ],

    order: [['id', 'ASC']]
  });
}

async function findAccessibleById(userId, machineId) {
  return Machine.findOne({
    where: {
      id: machineId
    },

    attributes: [
      'id',
      'buildingId',
      'name',
      'serialNumber',
      'status'
    ],

    include: [
      {
        model: Building,
        as: 'building',

        attributes: ['id'],

        required: true,

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
      }
    ]
  });
}

async function updateStatus(machine, status) {
  machine.status = status;

  return machine.save();
}

module.exports = {
  findAllByBuildingId,
  findAccessibleById,
  updateStatus
};