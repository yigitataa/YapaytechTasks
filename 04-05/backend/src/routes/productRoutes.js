import { Router } from 'express'
import {
  createProduct,
  deleteProduct,
  listProducts,
  showProduct,
  updateProduct,
} from '../controllers/productController.js'

const productRouter = Router()

productRouter.get('/', listProducts)
productRouter.post('/', createProduct)
productRouter.get('/:id', showProduct)
productRouter.patch('/:id', updateProduct)
productRouter.delete('/:id', deleteProduct)

export default productRouter
