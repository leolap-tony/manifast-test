import React from 'react'

import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import Link from 'next/link'


const page = () => {
  return (
    <div className='flex items-center justify-center w-full'>
        <div className='flex flex-col gap-12 w-1/4'>
            <h1 className='text-3xl font-semibold'>처음 뵙겠습니다.</h1>
            <div className='flex flex-col gap-4'>
                <div>
                    <Label>나의 이름은</Label>
                    <Input/>
                </div>
                <div>
                    <Label>이메일은</Label>
                    <Input/>
                </div>
                <div>
                    <Label>연락처는</Label>
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
              
            <Button asChild>
                <Link href="/onboarding/group">가입 완료</Link>
            </Button>
        </div>        
    </div>
  )
}

export default page