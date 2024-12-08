import './Login.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
  })
  const [message, setMessage] = useState('')
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
    setMessage('')

    try {
      const response = await fetch(
        'http://localhost:8800/api/v1/auth/sign-in',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      )

      if (response.ok) {
        const data = await response.json()
        alert('Login successful')

        // Access and store the token
        localStorage.setItem('token', data.token)
        localStorage.setItem('username', data.name)
        navigate('/') // Redirect to the home page
      } else {
        const data = await response.json()
        setMessage(data.message || 'Something went wrong.')
      }
    } catch (error) {
      alert('An error occurred. Please try again later.')
    }
  }
  return (
    <div className='login-container'>
      <h1>Login</h1>
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
        <button type='submit'>Login</button>
        {message && <p className='message'>{message}</p>}
      </form>
    </div>
  )
}

export default Login
