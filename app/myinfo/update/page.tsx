import React from 'react'
import Link from 'next/link'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const page = () => {
  return (
    <div className='flex items-center justify-center w-full'>
        <div className='flex flex-col gap-12 w-1/4'>
            <h1 className='text-3xl font-semibold'>내 정보 수정</h1>
            <div className='flex flex-col gap-4'>
                <div>
                    <Label>나의 이름은</Label>
                    <Input/>
                </div>
                <div>
                    <Label>전화번호는</Label>
                    <Input/>
                </div>
                <div>
                    <Label>직무는</Label>
                    <Input/>
                </div>
                <div>
                    <Label>프로필 이미지 (선택)</Label>
                    <Input/>
                </div>
            </div>
            <div className='flex justify-center gap-6'>
              <Button asChild variant='outline'>
                  <Link href="/myinfo">이전</Link>
              </Button>
              <Button asChild>
                  <Link href="/myinfo">수정 완료</Link>
              </Button>
            </div>  
        </div>        
    </div>
  )
}

export default page