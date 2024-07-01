import React from 'react'

import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { auth } from '@/auth'
import { onboarding } from './actions'


const page = async () => {
    const session = await auth();

  return (
    <div className='flex items-center justify-center w-full'>
        <div className='flex flex-col gap-12 w-1/4'>
            <h1 className='text-3xl font-semibold'>처음 뵙겠습니다.</h1>
            <form action={onboarding} className='flex flex-col gap-4'>
                <div>
                    <Label>나의 이름은</Label>
                    <Input value={session?.user.name as string} disabled/>
                </div>
                <div>
                    <Label>이메일은</Label>
                    <Input value={session?.user.email as string} disabled/>
                </div>
                <div>
                    <Label>연락처는</Label>
                    <Input type='text'name='phone'/>
                </div>
                <div>
                    <Label>직무는</Label>
                    <Input name='role'/>
                </div>
                <div>
                    <Label>프로필 이미지 (선택)</Label>
                    <Input/>
                </div>
                {/* <Button asChild>
                    <Link href="/onboarding/group">가입 완료</Link>
                </Button> */}
                <Button type='submit'>가입 완료</Button>
            </form>              
        </div>        
    </div>
  )
}

export default page