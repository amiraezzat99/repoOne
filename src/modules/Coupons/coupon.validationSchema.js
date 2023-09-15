import Joi from 'joi'

export const addCouponSchema = {
  body: Joi.object({
    couponCode: Joi.string().min(4).max(55).required(),
    couponAmount: Joi.number().positive().min(1).max(100).required(),
    isPercentage: Joi.boolean().optional(),
    isFixedAmount: Joi.boolean().optional(),
    fromDate: Joi.date()
      .greater(Date.now() - 24 * 60 * 60 * 1000)
      .required(),
    toDate: Joi.date().greater(Joi.ref('fromDate')).required(),
    couponAssginedToUsers: Joi.array().items().required(),
  }).required(),
  headers: Joi.object({
    test: Joi.string().required(),
  }).options({ allowUnknown: true }),
}
