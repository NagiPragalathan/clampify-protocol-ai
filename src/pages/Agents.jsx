import React from 'react'

const Agents = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/video.mp4"
        autoPlay
        loop
        muted
        playsInline
      ></video>

      {/* Overlay Content */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-black bg-opacity-40 text-white">
        <h1 className="text-5xl font-bold mb-4">Welcome to Our Site</h1>
        <p className="text-xl">Experience the best with us</p>
      </div>
    </div>
  )
}

export default Agents

