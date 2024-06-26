import React from 'react'

const page = ({ params }: { params: { pid: string}}) => {
  
  return (
    <div className='flex justify-center items-center w-full'>
      <h1 className="text-xl">Page for Project id : {params.pid}</h1>
    </div>
  )
}

export default page