import { useNavigate } from 'react-router-dom'
import './Hero.css'

const Hero = () => {
  const navigate = useNavigate()
  return (
    <div className='hero-container'>
      <div className='hero-content'>
        <h1 className='hero-title'>Discover your Next great read</h1>
        <p className='hero-description'>
          Uncover captivating stories, enriching knowledge and endless
          inspiration in our collection
        </p>
        <div className='hero-button-container'>
          <button
            onClick={() => navigate('/all-books')}
            className='hero-button'
          >
            Discover books
          </button>
        </div>
      </div>
    </div>
  )
}

export default Hero
