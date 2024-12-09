import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Cart.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faTrashCan } from '@fortawesome/free-solid-svg-icons'

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Fetch cart items on component mount
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:8800/api/v1/cart', {
          headers: { auth: `Bearer ${token}` },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch cart items')
        }

        const data = await response.json()
        setCartItems(data)
      } catch (error) {
        console.error(error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCartItems()
  }, [])

  // Calculate total price
  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
  }

  const handleRemoveItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `http://localhost:8800/api/v1/cart/${itemId}`,
        {
          method: 'DELETE',
          headers: { auth: `Bearer ${token}` },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to remove item from cart')
      }

      // Update the cart items in the UI
      setCartItems(cartItems.filter((item) => item.book_id !== itemId))
    } catch (error) {
      console.error(error)
      alert('Failed to remove item. Please try again.')
    }
  }

  // Place order handler
  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8800/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          auth: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: cartItems }),
      })

      if (!response.ok) {
        throw new Error('Failed to place order')
      }

      alert('Order placed successfully!')
      navigate('/orders') // Redirect to orders page after placing order
    } catch (error) {
      console.error(error)
      alert('Failed to place order. Please try again.')
    }
  }

  if (loading) return <div>Loading cart...</div>
  if (error) return <div>{error}</div>

  return (
    <div className='cart-container'>
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className='cart-items'>
            {cartItems.map((item) => (
              <div className='cart-item' key={item.id}>
                <div className='item-details'>
                  <h2>{item.title}</h2>
                  <p>Price: ${item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Total: ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.book_id)}
                  className='remove-item-btn'
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </div>
            ))}
          </div>
          <div className='cart-summary'>
            <h2>Total Price: ${calculateTotalPrice().toFixed(2)}</h2>
            <button onClick={handlePlaceOrder} className='place-order-btn'>
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart
