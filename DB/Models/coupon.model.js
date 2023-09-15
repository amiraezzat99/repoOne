import { Schema, model } from 'mongoose'

const couponSchema = new Schema(
  {
    couponCode: {
      type: String,
      required: true,
      lowercase: true,
    },
    couponAmount: {
      type: Number,
      required: true,
    },
    isPercentage: {
      type: Boolean,
      default: false,
      required: true,
    },
    isFixedAmount: {
      type: Boolean,
      default: false,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    fromDate: {
      type: String,
      required: true,
    },
    toDate: {
      type: String,
      required: true,
    },
    couponStatus: {
      type: String,
      default: 'Valid',
      enum: ['Valid', 'Expired'],
    },

    couponAssginedToUsers: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        maxUsage: {
          type: Number,
          required: true,
        },
        usageCount: {
          type: Number,
          default: 0,
        },
      },
    ],
    couponAssginedToProduct: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  },
)

export const couponModel = model('coupon', couponSchema)
