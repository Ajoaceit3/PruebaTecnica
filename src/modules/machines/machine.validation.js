const { z } = require('zod');

const machineIdParamsSchema = z.object({
  machineId: z.coerce
    .number()
    .int()
    .positive()
});

const updateMachineStatusSchema = z
  .object({
    status: z.enum([
      'ONLINE',
      'OFFLINE',
      'OUT_OF_SERVICE',
      'ERROR',
      'MAINTENANCE',
      'DISABLED'
    ])
  })
  .strict();

module.exports = {
  machineIdParamsSchema,
  updateMachineStatusSchema
};