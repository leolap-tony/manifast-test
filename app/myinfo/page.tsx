import React from 'react'

import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@/auth'
import prisma from '@/db'


const page = async () => {
  const session = await auth();
  const user = session && await prisma.user.findUnique({
    where:{
      // id:session.user.sub,
      email:session.user.email as string
    },
    include:{
      group:true
    }
  })
  return (
    <div className='w-full flex flex-col gap-8 p-12'>
        <h1 className='text-4xl font-bold'>내정보</h1>
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="account">내 정보</TabsTrigger>
            <TabsTrigger value="password">내 그룹 정보</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <div className='flex flex-col gap-8 w-full p-4'>
              <div className='flex flex-col gap-6'>
                <h1 className='text-4xl font-bold'>{session?.user.name}</h1>
                <div className='flex gap-4'>
                  <span className='mr-16 font-semibold'>이메일</span>
                  <span>{user?.email}</span>
                </div>
                <div className='flex gap-4'>
                  <span className='mr-16 font-semibold'>연락처</span>
                  <span>{user?.role}</span>
                </div>
                <div className='flex gap-4'>
                  <span className='mr-16 font-semibold'>가입일</span>
                  <span>{JSON.stringify(user?.createdAt)}</span>
                </div>
                <div className='flex gap-4'>
                  <span className='mr-16 font-semibold'>직무</span>
                  <span>{user?.role}</span>
                </div>
                <div className='flex gap-4'>
                  <span className='mr-16 font-semibold'>권한</span>
                  <span>{user?.email}</span>
                </div>
                <div className='flex gap-4'>
                  <span className='mr-16 font-semibold'>역활</span>
                  <span>{user?.email}</span>
                </div>
                <div className='flex gap-4'>
                  <span className='mr-16 font-semibold'>이미지</span>
                  {user?.image && <Image src={user.image} alt="profile" height={32} width={32} className='rounded-full'/>}                  
                </div>
              </div>
            
              <Button variant="outline" asChild className='w-20'>
                <Link  href="/myinfo/update">수정</Link>
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="password">
          <div className='flex flex-col gap-8 w-full p-4'>
              <div className='flex flex-col gap-6'>
                <h1 className='text-4xl font-bold'>{session?.user.name}</h1>
                <div className='flex gap-4'>
                  <span className='mr-16 font-semibold'>이메일</span>
                  <span>{user?.email}</span>
                </div>
                <div className='flex gap-4'>
                  <span className='mr-16 font-semibold'>연락처</span>
                  <span>{user?.role}</span>
                </div>
                <div className='flex gap-4'>
                  <span className='mr-16 font-semibold'>가입일</span>
                  <span>{JSON.stringify(user?.createdAt)}</span>
                </div>
                <div className='flex gap-4'>
                  <span className='mr-16 font-semibold'>직무</span>
                  <span>{user?.role}</span>
                </div>
                <div className='flex gap-4'>
                  <span className='mr-16 font-semibold'>권한</span>
                  <span>{user?.email}</span>
                </div>
                <div className='flex gap-4'>
                  <span className='mr-16 font-semibold'>역활</span>
                  <span>{user?.email}</span>
                </div>
                <div className='flex gap-4'>
                  <span className='mr-16 font-semibold'>이미지</span>
                  {user?.image && <Image src={user.image} alt="profile" height={32} width={32} className='rounded-full'/>}                  
                </div>

              </div>
              <div>
                <h1 className='text-3xl font-bold'>그룹 이름</h1>
              </div>
              <div>
                <h1 className='text-3xl font-bold'>멤버 정보</h1>
              </div>
              <div>
                <h1 className='text-3xl font-bold'>비즈니스 정보</h1>
                <div> {JSON.stringify(user)}</div>
              </div>
              <Button variant="outline" asChild className='w-20'>
                <Link  href="/myinfo/update">수정</Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>

    </div>
  )
}

export default page