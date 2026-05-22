import React from 'react'
import Sidebar from './Component/Sidebar'

const page = () => {
  return (
    <div>
      <div className='flex flex-row h-screen'>
        {/* left side sidebar */}
        <div className='w-[%]'>
          <Sidebar />
        </div>
        {/* main content */}
        <div className='w-[80%]'></div>
      </div>
    </div>
  );
}

export default page