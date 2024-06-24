'use client'

import { signOut } from '@/auth'
import React from 'react'

const SignOutButton = () => {
  return (
    <button onClick={async ()=> await signOut()}>SignOut</button>
  )
}

export default SignOutButton