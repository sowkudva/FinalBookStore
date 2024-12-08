import { Link, useNavigate } from 'react-router-dom'
import './NavBar.css'
import React, { useState } from 'react'

const Navbar = () => {
  const isLoggedIn = !!localStorage.getItem('token')

  const isadmin =
    !!localStorage.getItem('username') &&
    localStorage.getItem('username') === 'admin'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const navigate = useNavigate()

  // Retrieve user name from localStorage (or state management if available)
  const userName = localStorage.getItem('username') || 'User'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    toggleDropdown()
    navigate('/login')
  }

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState)
  }

  return (
    <div className='nav-container'>
      <div className='nav-logo'>
        <img
          className='nav-icon'
          alt='icon'
          src='https://cdn-icons-png.flaticon.com/128/10433/10433049.png'
        />
        <h1 className='nav-title'>BooksHeaven</h1>
      </div>
      <div className='nav-links'>
        <Link to='/'>Home</Link>
        <Link to='/all-books'>All Books</Link>
        {isLoggedIn ? (
          <>
            <Link to='/cart'>Cart</Link>
            <Link to='/orders'>Order History</Link>
            {isadmin ? <Link to='/orders/admin'>Order Management</Link> : <></>}
            <div className='user-menu-container'>
              <button className='nav-button' onClick={toggleDropdown}>
                {userName} ▼
              </button>
              {isDropdownOpen && (
                <div className='dropdown-menu'>
                  <button className='dropdown-item' onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className='auth-links'>
            <Link to='/login' className='nav-button'>
              SignIn
            </Link>
            <Link to='/sign-up' className='nav-button'>
              SignUp
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
