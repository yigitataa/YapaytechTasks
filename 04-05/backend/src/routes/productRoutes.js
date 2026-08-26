import { Router } from 'express'
import {
  listProducts,
  showProduct,
} from '../controllers/productController.js'

const productRouter = Router()

productRouter.get('/', listProducts)
productRouter.get('/:id', showProduct)

export default productRouter

