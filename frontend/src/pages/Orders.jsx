import React, { useEffect, useState } from 'react'
import './Orders.css'
import { useNavigate } from 'react-router-dom'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:8800/api/v1/orders', {
          headers: { auth: `Bearer ${token}` },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch orders')
        }

        const data = await response.json()
        setOrders(data)
      } catch (error) {
        console.error(error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) return <div>Loading orders...</div>
  if (error) return <div>{error}</div>

  return (
    <div className='orders-container'>
      <h1>Your Orders</h1>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className='orders-list'>
          {orders.map((order) => (
            <div className='order-item' key={order.id}>
              <h2>Order #{order.id}</h2>
              <p>
                Order Date: {new Date(order.created_at).toLocaleDateString()}
              </p>
              <p>Total Price: ${order.total_price.toFixed(2)}</p>
              <p>Status: {order.status}</p>
              <button
                onClick={() => navigate(`/order-details/${order.id}`)}
                className='view-details-btn'
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
