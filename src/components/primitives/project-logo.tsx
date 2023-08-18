import React from 'react'

export default function ProjectLogo() {
  return (
    <div className="w-12 h-12 flex-col relative">
      <div className="border absolute inset-0">
        {/* // TODO - should we get the logo from the GH API? */}
        <img src="https://avatars.githubusercontent.com/u/1544687?s=48&v=4" />
      </div>
    </div>
  )
}
