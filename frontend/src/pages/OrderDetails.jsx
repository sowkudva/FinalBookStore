import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './OrderDetails.css'

const OrderDetails = () => {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(
          `http://localhost:8800/api/v1/orders/${orderId}`,
          {
            headers: { auth: `Bearer ${token}` },
          }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch order details')
        }

        const data = await response.json()

        setOrder(data)
      } catch (error) {
        console.error(error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId])

  if (loading) return <div>Loading order details...</div>
  if (error) return <div>{error}</div>

  if (!order) return <div>No order details available.</div>

  return (
    <div className='order-details-container'>
      <h1>Order #{order.order.id}</h1>
      <p>Order Date: {new Date(order.order.created_at).toLocaleDateString()}</p>
      <p>
        Total Price: $
        {order.order.total_price ? order.order.total_price.toFixed(2) : '0.00'}
      </p>
      <p>Status: {order.order.status}</p>

      <h2>Items</h2>
      {order.items.length === 0 ? (
        <p>No items found for this order.</p>
      ) : (
        <div className='order-items'>
          {order.items.map((item) => (
            <div className='order-item' key={item.book_id}>
              <h3>{item.title}</h3>
              <p>Price: ${item.price}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Total: ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => navigate('/orders')}
        className='back-to-orders-btn'
      >
        Back to Orders
      </button>
    </div>
  )
}

export default OrderDetails
