import React from 'react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const page = () => {
  return (
    <div className='flex flex-col gap-12 w-full p-8'>
      <h1 className='text-3xl font-bold'>프로젝트 요청</h1>
      <Separator/>
      <div className='flex'>
        <h2 className='text-2xl font-semibold'>기본 정보</h2>
      </div>
      <div className='flex'>
        <h2 className='text-2xl font-semibold'>예상 작업 리스트</h2>
      </div>
      <div className='flex'>
        <h2 className='text-2xl font-semibold'>요청 사항</h2>
      </div>
      <Button asChild className='w-fit'>
        <Link href="/project/test">프로젝트 요청</Link>
      </Button>
    </div>
  )
}

export default page