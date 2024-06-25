import React from 'react'

import { Input } from "@/components/ui/input"


const page = () => {
  return (
    <div className='flex items-center justify-center mx-auto'>
        <div className='flex flex-col gap-3 max-w-xl'>
            <h1 className='text-3xl font-semibold w-full'>처음 뵙겠습니다</h1>
            <p>나의 이름은</p>
            <Input className='w-96'/>
            <p>성별은 (선택)</p>
            <Input className='w-96'/>
            <p>대표자명은</p>
            <Input className='w-96'/>
            <p>사업자등록번호는 (선택)</p>
            <Input className='w-96'/>
            <p>그룹 연락처는</p>
            <Input className='w-96'/>
            <p>주소는 (선택)</p>
            <Input className='w-96'/>

        </div>
    </div>
  )
}

export default page