import { Router } from 'express'
const router = Router()
import * as cartCon from './cart.controller.js'
import { asyncHandler } from '../../utils/errorhandling.js'
import { isAuth } from '../../middlewares/auth.js'
import { systemRoles } from '../../utils/systemRoles.js'

router.post('/', isAuth([systemRoles.USER, systemRoles.ADMIN]), asyncHandler(cartCon.addToCart))
router.delete(
  '/',
  isAuth([systemRoles.USER, systemRoles.ADMIN]),
  asyncHandler(cartCon.deleteFromCart),
)

export default router
