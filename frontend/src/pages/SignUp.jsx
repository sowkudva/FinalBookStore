import { useState } from 'react'
import './SignUp.css'
import { Link, useNavigate } from 'react-router-dom'

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const navigate = useNavigate() // Initialize the navigate function

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(
        'http://localhost:8800/api/v1/auth/sign-up',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      )

      if (response.ok) {
        alert('Sign-up successful!')
        navigate('/login') // Redirect to the home page
      } else {
        const data = await response.json()
        alert(data.message || 'Something went wrong.')
      }
    } catch (error) {
      alert('An error occurred. Please try again later.')
    }
  }

  return (
    <div className='signup-container'>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} className='signup-form'>
        <div className='form-group'>
          <label htmlFor='name'>Name:</label>
          <input
            type='text'
            id='name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='email'>Email:</label>
          <input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            id='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type='submit'>Sign Up</button>
      </form>
      <p>
        Already a member? <Link to={'/login'}>Login</Link>
      </p>
    </div>
  )
}

export default SignUp
