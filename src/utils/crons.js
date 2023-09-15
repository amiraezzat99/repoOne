import { scheduleJob } from 'node-schedule'
import { couponModel } from '../../DB/Models/coupon.model.js'
import moment from 'moment-timezone'

export const changeStatusOfCoupons = () => {
  scheduleJob('* */60 * * * *', async function () {
    const coupons = await couponModel.find({ couponStatus: 'Valid' })
    for (const coupon of coupons) {
      if (moment(coupon.toDate).isBefore(moment().tz('Africa/Cairo'))) {
        coupon.couponStatus = 'Expired'
      }
      await coupon.save()
    }
    console.log(`cron changeStatusOfCoupons() is running ....`)
  })
}
