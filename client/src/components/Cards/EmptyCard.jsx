import React from 'react'
import { MdOutlineNoteAdd } from 'react-icons/md'

export default function EmptyCard({ message }) {
  return (
    <div className='flex flex-col items-center justify-center mt-20'>
      <MdOutlineNoteAdd className='w-60 h-60 text-gray-500' />
      <p className='w-1/2 text-sm font-medium text-slate-700 text-center mt-5 leading-7'>
        {message}
      </p>
    </div>
  )
}
