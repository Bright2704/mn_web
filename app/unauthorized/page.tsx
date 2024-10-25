
import React from 'react'
import NavBar from '@/components/header'
import Footer from '@/components/Footer'

function UnauthPage() {
  return (
    <>
      <NavBar/>
        <div className="flex flex-grow">
          <div className='container mx-auto flex justify-center self-center'>       
            <p>You don&apos;t have a permission to access this page.</p>
          </div>
        </div>
      <Footer/>
    </>
  )
}

export default UnauthPage