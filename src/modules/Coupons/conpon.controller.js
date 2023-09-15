import { couponModel } from '../../../DB/Models/coupon.model.js'
import { productModel } from '../../../DB/Models/product.model.js'
import { userModel } from '../../../DB/Models/user.model.js'

export const addCoupon = async (req, res, next) => {
  const { test } = req.headers //req.headers
  console.log(req.headers)
  const {
    couponCode,
    couponAmount,
    isPercentage,
    isFixedAmount,
    fromDate,
    toDate,
    couponAssginedToUsers,
  } = req.body

  const isCouponCodeDuplicated = await couponModel.findOne({ couponCode })
  if (isCouponCodeDuplicated) {
    return next(new Error('duplicate coupon code', { cause: 400 }))
  }

  if ((!isFixedAmount && !isPercentage) || (isFixedAmount && isPercentage)) {
    return next(
      new Error('please select if teh coupon is percentage or fixedAmount', {
        cause: 400,
      }),
    )
  }
  // const products = await productModel
  //   .find({ price: { $gte: 40000 } })
  //   .select('_id')
  // const couponAssginedToProduct = products

  //======================== assgin to users ==================
  let usersIds = []
  for (const user of couponAssginedToUsers) {
    usersIds.push(user.userId)
  }

  const usersCheck = await userModel.find({
    _id: {
      $in: usersIds,
    },
  })

  if (usersIds.length !== usersCheck.length) {
    return next(new Error('invalid userIds', { cause: 400 }))
  }

  const couponObject = {
    couponCode,
    couponAmount,
    isPercentage,
    isFixedAmount,
    fromDate,
    toDate,
    couponAssginedToUsers,
    // couponAssginedToProduct,
    createdBy: req.authUser._id,
  }
  const couponDb = await couponModel.create(couponObject)
  if (!couponDb) {
    return next(new Error('fail to add coupon', { cause: 400 }))
  }
  res.status(201).json({ message: 'done', couponDb })
}
