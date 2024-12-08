import React, { useEffect, useState } from 'react'
import './OrderManagement.css'

const OrderManagement = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(
          'http://localhost:8800/api/v1/orders/admin',
          {
            headers: { auth: `Bearer ${token}` },
          }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch orders')
        }

        const data = await response.json()
        setOrders(data.orders)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `http://localhost:8800/api/v1/orders/status`,
        {
          method: 'PUT',
          headers: {
            auth: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId: orderId, status: newStatus }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update order status')
      }

      const updatedOrder = await response.json()

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId
            ? { ...order, status: updatedOrder.order.status }
            : order
        )
      )
      alert('Order status updated succesfully')
    } catch (err) {
      alert('Failed to update order status')
    }
  }

  if (loading) return <div>Loading orders...</div>
  if (error) return <div>{error}</div>

  return (
    <div className='admin-orders-container'>
      <h1>All Orders</h1>
      {orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        <table className='orders-table'>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Date</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.user_name}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>${order.total_price.toFixed(2)}</td>
                <td>{order.status}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.order_id, e.target.value)
                    }
                    className='status-select'
                  >
                    <option value='pending'>Pending</option>
                    <option value='processing'>Processing</option>
                    <option value='shipped'>Shipped</option>
                    <option value='completed'>Completed</option>
                    <option value='cancelled'>Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default OrderManagement
