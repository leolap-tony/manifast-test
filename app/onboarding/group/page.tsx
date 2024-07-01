import { auth } from '@/auth'
import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { joinGroup } from '../actions'

const page = async () => {
    const session = await auth()
    return (
    <div className='flex items-center justify-center w-full'>
        <div className='flex flex-col gap-16 w-auto'>
            <h1 className='text-3xl font-semibold'>{session?.user.name}님, 반갑습니다.</h1>
            <form action={joinGroup} className='flex flex-col gap-4'>
                <p>속한 그룹의 계정이 있다면 그룹 ID를 입력해 주세요.</p>
                <Input name='groupId'/>
                <Button variant='outline' className='w-1/4 ml-auto'>참여</Button>                
            </form>
            <div className='flex justify-between p-6 bg-slate-100 rounded-lg'>
                <p>그룹의 계정이 없나요?</p>
                <Button asChild>
                    <Link href="/onboarding/groupinfo">
                        그룹 새로 생성
                    </Link>
                    
                </Button>
            </div>
        </div>        
    </div>
  )
}

export default page