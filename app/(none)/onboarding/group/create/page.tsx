'use client'

import React, { useState, useEffect } from 'react'
import { GroupWithBusinessInfo } from '@/types/queryInterface'
import GroupInfo from './GroupInfo'
import BusinessInfo from './BusinessInfo'

function page() {
  const [ info, setInfo ] = useState<GroupWithBusinessInfo>()
  const [ step, setStep ] = useState(0)

  return (
    <>
      { step === 0 && <GroupInfo step={step} setStep={setStep} /> }
     { step === 1 && <BusinessInfo step={step} setStep={setStep} /> }
    </>
  )
}

export default page