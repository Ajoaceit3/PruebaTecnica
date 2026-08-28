const actionService = require('./action.service');

async function requestAction(req, res, next) {
  try {
    const { machineId } =
      req.validated.params;

    const { actionType } =
      req.validated.body;

    const action =
      await actionService.requestAction(
        req.user.id,
        machineId,
        actionType
      );

    req.log.info(
      {
        userId: req.user.id,
        machineId,
        actionId: action.id,
        actionType
      },
      'Machine action requested'
    );

    return res.status(201).json({
      data: action
    });
  } catch (error) {
    return next(error);
  }
}

async function getActionsByMachine(
  req,
  res,
  next
) {
  try {
    const { machineId } =
      req.validated.params;

    const actions =
      await actionService.getActionsByMachine(
        req.user.id,
        machineId
      );

    return res.status(200).json({
      data: actions
    });
  } catch (error) {
    return next(error);
  }
}

async function getActionById(
  req,
  res,
  next
) {
  try {
    const { actionId } =
      req.validated.params;

    const action =
      await actionService.getActionById(
        req.user.id,
        actionId
      );

    return res.status(200).json({
      data: action
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  requestAction,
  getActionsByMachine,
  getActionById
};