const {
  MachineAction,
  Machine,
  Building,
  UserBuildingPermission,
  User
} = require('../../database/models');

async function createAction({
  machineId,
  requestedByUserId,
  actionType
}) {
  return MachineAction.create({
    machineId,
    requestedByUserId,
    actionType,
    status: 'PENDING'
  });
}

async function findAllByMachineId(machineId) {
  return MachineAction.findAll({
    where: {
      machineId
    },

    attributes: [
      'id',
      'machineId',
      'requestedByUserId',
      'actionType',
      'status',
      'requested_at'
    ],

    include: [
      {
        model: User,
        as: 'requestedBy',
        attributes: [
          'id',
          'name',
          'email'
        ]
      }
    ],

    order: [
      ['requested_at', 'DESC']
    ]
  });
}

async function findAccessibleById(userId, actionId) {
  return MachineAction.findOne({
    where: {
      id: actionId
    },

    attributes: [
      'id',
      'machineId',
      'requestedByUserId',
      'actionType',
      'status',
      'requested_at'
    ],

    include: [
      {
        model: Machine,
        as: 'machine',

        attributes: [
          'id',
          'buildingId',
          'name'
        ],

        required: true,

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
      }
    ]
  });
}

module.exports = {
  createAction,
  findAllByMachineId,
  findAccessibleById
};