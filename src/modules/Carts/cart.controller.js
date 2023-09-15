import { cartModel } from '../../../DB/Models/cart.model.js'
import { productModel } from '../../../DB/Models/product.model.js'

export const addToCart = async (req, res, next) => {
  const userId = req.authUser._id
  const { productId, quantity } = req.body
  const productExists = await productModel.findById(productId)
  if (!productExists || productExists.stock < quantity) {
    return next(new Error('invalid process'))
  }
  const userCart = await cartModel.findOne({ userId }). 
  if (userCart) {
    let subTotal = 0
    let update = false
    for (const product of userCart.products) {
      if (product.productId == productId) {
        update = true
        product.quantity = quantity
      }
    }
    if (!update) {
      userCart.products.push({ productId, quantity })
    }
    for (const product of userCart.products) {
      const productcheck = await productModel.findById(product.productId)
      subTotal += product.quantity * productcheck?.priceAfterDiscount || 0
    }
    const cart = await cartModel.findOneAndUpdate(
      { userId },
      {
        subTotal,
        products: userCart.products,
      },
      {
        new: true,
      },
    )
    return res.status(200).json({ message: 'ProductAddedDone', cart })
  }

  const cartObject = {
    userId,
    products: [{ productId, quantity }],
    subTotal: productExists.price * quantity,
  }
  const cartdb = await cartModel.create(cartObject)
  res.status(201).json({ message: 'Done', cartdb })
}

// export const deleteFromCart = async (req, res, next) => {
//   const userId = req.authUser._id
//   const { productId } = req.body
//   const productExists = await productModel.findById(productId)
//   if (!productExists) {
//     return next(new Error('invalid productt id'))
//   }
//   const userCart = await cartModel.findOne({
//     userId,
//     'products.productId': productId,
//   })
//   userCart.products.forEach((ele) => {
//     if (ele.productId == productId) {
//       userCart.products.splice(userCart.products.indexOf(ele), 1)
//     }
//   })
//   await userCart.save()

//   res.status(200).json({ message: 'Done', userCart })
// }

export const deleteFromCart = async (req, res, next) => {
  const userId = req.authUser._id
  const { productId } = req.body
  const productExists = await productModel.findById(productId)
  if (!productExists) {
    return next(new Error('invalid productt id'))
  } 
  // ======================= can be replaced with cartId check =====================
  const userCart = await cartModel.findOneAndUpdate({
    userId,
    'products.productId': productId,
  })
  userCart.products.forEach((ele) => {
    if (ele.productId === productId) {
      userCart.products.splice(userCart.products.indexOf(ele),1)
    }
  })
  await userCart.save()

  res.status(200).json({ message: 'Done', userCart })
}
