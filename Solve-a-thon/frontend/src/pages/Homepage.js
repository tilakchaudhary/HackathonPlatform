import React from 'react'
import bgImage from '../Images/bg.jpeg'
import { Link } from 'react-router-dom'
const Homepage = () => {
  return (
    <div className="h-screen gap-5 text-white bg-cover bg-no-repeat bg-center flex flex-col items-center justify-center"
    style={{ backgroundImage: `url(${bgImage})` }}>
      <h1 className='text-7xl font-semibold'>
        Welcome to hacklify
      </h1>
      <h1 className='text-3xl font-semibold'>
        Hackathons you shouldn't miss
      </h1>
      <Link to="/register" className="">
        <button className="text-xl border hover:border-collapse  hover:bg-blue-700 bg-transparent px-3 py-2 rounded-2xl">Register Now</button>
      </Link>
    </div>
  )
}

export default Homepage