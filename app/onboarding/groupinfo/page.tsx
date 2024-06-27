import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const page = () => {
  return (
    <div className='flex items-center justify-center w-full py-4'>
        <div className='flex flex-col gap-10 w-1/3'>
            <h1 className='text-3xl font-semibold'>그룹(회사)에 대해 알려주세요.</h1>
            <div className='flex flex-col gap-4'>
                <div>
                    <Label>우리 그룹 이름은</Label>
                    <Input/>
                </div>
                <div>
                    <Label>상호명은 (선택)</Label>
                    <Input/>
                </div>
                <div>
                    <Label>대표자명은</Label>
                    <Input/>
                </div>
                <div>
                    <Label>사업자등록번호는 (선택)</Label>
                    <Input/>
                </div>
                <div>
                    <Label>그룹 이메일은</Label>
                    <Input/>
                </div>
                <div>
                    <Label>그룹 연락처는</Label>
                    <Input/>
                </div>
                <div>
                    <Label>주소는 (선택)</Label>
                    <Input/>
                </div>                
            </div>
            <Button asChild>
                <Link href="/">그룹 생성</Link>
            </Button>
        </div>        
    </div>
  )
}

export default page