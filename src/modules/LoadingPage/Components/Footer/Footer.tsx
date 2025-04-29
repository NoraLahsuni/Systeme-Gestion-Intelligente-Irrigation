import React from 'react'


const Footer = () => {
  return (
   <>
        <div className='bg-blue-500 p-2 mt-3' style={{background: 'linear-gradient(90deg, #007bff, #28a745)'}}>
            <p className='text-center text-white'>
                &copy; {new Date().getFullYear()} - Tous droits réservés
            </p>
        </div>
   </>
  )
}

export default Footer