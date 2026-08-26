import { formatCurrency } from '../utils/formatCurrency.js'

function Price({ value, className = '' }) {
  return (
    <span className={`price component-enter component-enter--price ${className}`.trim()}>
      {formatCurrency(value)}
    </span>
  )
}

export default Price
