import { UserProfile } from '@clerk/nextjs'
import React from 'react'

function Profile() {
  return (
    <div className='flex items-center justify-center p-5'>
        <UserProfile routing='hash'  />
    </div>
  )
}

export default Profile