const { z } = require('zod');

const actionIdParamsSchema = z.object({
  actionId: z.coerce
    .number()
    .int()
    .positive()
});

const requestActionSchema = z
  .object({
    actionType: z.enum([
      'RESTART',
      'ENABLE',
      'DISABLE',
      'SET_MAINTENANCE'
    ])
  })
  .strict();

module.exports = {
  actionIdParamsSchema,
  requestActionSchema
};