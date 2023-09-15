import { couponModel } from '../../DB/Models/coupon.model.js'
import moment from 'moment-timezone'

export const isCouponValid = async ({ couponCode, userId} = {}) => {
  const coupon = await couponModel.findOne({ couponCode })
  if (!coupon) {
    return {
      msg: 'please enter a valid coupon code',
    }
  }
  //===================== coupon expired ======================

  if (
    coupon.couponStatus == 'Expired' ||
    moment(new Date(coupon.toDate)).isBefore(moment().tz('Africa/Cairo'))
  ) {
    return {
      msg: 'coupon is expired',
    }
  }
  //===================== coupon not start ======================
  if (
    coupon.couponStatus == 'Valid' &&
    moment().isBefore(moment(new Date(coupon.fromDate)).tz('Africa/Cairo'))
  ) {
    return {
      msg: 'coupon doesot started yet',
    }
  }

  let notAssginedUsers = []
  let exceeedMaxUsage = false
  for (const user of coupon.couponAssginedToUsers) {
    // coupon not assgined to user
    notAssginedUsers.push(user.userId.toString())
    // exceed the max usage
    if (userId.toString() == user.userId.toString()) {
      if (user.maxUsage <= user.usageCount) {
        exceeedMaxUsage = true
      }
    }
  }
  //================================= not Asssgined to users ====================
  if (!notAssginedUsers.includes(userId.toString())) {
    return {
      notAssgined: true,
      msg: 'this user not assgined for this coupon',
    }
  }
  if (exceeedMaxUsage) {
    return {
      msg: 'exceed the max usage for this coupon',
    }
  }
  return true
}
