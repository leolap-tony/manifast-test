import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '@/public/Logo.svg'

const Sidenav = () => {
  return (
    <aside className="flex flex-col gap-6 w-64 min-h-screen p-5 border-r">
      <Image src={Logo} alt="Logo" height={48}/>
      <nav className="flex-1">
        <ul className="flex flex-col gap-4 text-xl">
          <li className="py-2 px-4">
            <Link href="/">홈</Link>
          </li>
          <li className="py-2 px-4">
            <Link href="/customer">고객</Link>
          </li>
          <li className="py-2 px-4">
            <Link href="/project">프로젝트</Link>
          </li>
          <li className="py-2 px-4">
            <Link href="/member">멤버</Link>
          </li>
          <li className="py-2 px-4">
            <Link href="/myinfo">내정보</Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidenav