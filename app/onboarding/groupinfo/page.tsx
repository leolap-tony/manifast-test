import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { createGroup } from '../actions'

const page = () => {
  return (
    <div className='flex items-center justify-center w-full py-4'>
        <form action={createGroup} className='flex flex-col gap-10 w-1/3'>
            <h1 className='text-3xl font-semibold'>그룹(회사)에 대해 알려주세요.</h1>
            <div className='flex flex-col gap-4'>
                <div>
                    <Label>우리 그룹 이름은</Label>
                    <Input name='name'/>
                </div>
                <div>
                    <Label>상호명은 (선택)</Label>
                    <Input/>
                </div>
                <div>
                    <Label>대표자명은</Label>
                    <Input name='ceo'/>
                </div>
                <div>
                    <Label>사업자등록번호는 (선택)</Label>
                    <Input name='businessNumber'/>
                </div>
                <div>
                    <Label>그룹 이메일은</Label>
                    <Input name='email'/>
                </div>
                <div>
                    <Label>그룹 연락처는</Label>
                    <Input name='phone'/>
                </div>
                <div>
                    <Label>주소는 (선택)</Label>
                    <Input name='address'/>
                </div>                
            </div>
            <Button >
                그룹 생성
            </Button>
        </form>        
    </div>
  )
}

export default page