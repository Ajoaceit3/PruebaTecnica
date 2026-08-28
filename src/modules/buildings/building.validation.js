const { z } = require('zod');

const buildingIdParamsSchema = z.object({
  buildingId: z.coerce
    .number()
    .int()
    .positive()
});

module.exports = {
  buildingIdParamsSchema
};