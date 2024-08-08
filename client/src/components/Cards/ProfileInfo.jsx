import React from 'react'
import { getInitials } from '../../utils/helper'

export default function ProfileInfo({ user, onLogout }) {

  // const onLogout = (e) => {
  //   e.preventDefault();
  // }
  
  return (
   <>
    { user
    ?
    (
    <div className='flex items-center gap-3'>
      <div 
        className='w-12 h-12 flex items-center justify-center 
        rounded-full text-slate-950 font-semibold bg-slate-100'
      >
        {getInitials(user?.name)}
      </div>

      <div>
        <p className='text-sm font-semibold'>{user?.name}</p>
        <button className='font-semibold text-sm text-slate-700 underline' onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
    )

    : ""
    
    }
   </>
  )
}
