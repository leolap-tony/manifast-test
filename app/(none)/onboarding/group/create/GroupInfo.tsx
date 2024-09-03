import { Button } from '@/components/elements/Button'
import { Input } from '@/components/elements/Input'
import KeyValueLabel from '@/components/elements/KeyValueLabel'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/elements/Select'
import Link from 'next/link'
import React from 'react'
import { useForm } from 'react-hook-form'

type props = {
  step:number
  setStep: React.Dispatch<React.SetStateAction<number>>
}
function GroupInfo({step, setStep}:props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } =useForm()
  const onSubmit = () => setStep(1)
  return (
    <section className="page-section">
      <div className="w-full h-full flex justify-center items-center">
        <form className="flex flex-col gap-8 w-[400px]" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="w-full text-left text-title-lg">그룹(회사)에 대해 알려주세요</h1>
          <KeyValueLabel
            direction="col"
            label={
              <span>
                이름<span className="text-primary align-top"> *</span>
              </span>
            }
            hint="매니패스트에서 쓰일 이름"
          >
            <Input
              
              required
              onChange={(e)=>console.log(e.target.value)}
              placeholder="입력해주세요"
              {...register('name')}
            />
          </KeyValueLabel>
          <KeyValueLabel
            direction="col"
            label={
              <span>
                이메일<span className="text-primary align-top"> *</span>
              </span>
            }
          >
            <Input
              name="email"
              type="email"
              placeholder="입력해주세요"
              readOnly
              defaultValue=''
            />
          </KeyValueLabel>
          <KeyValueLabel
            direction="col"
            label={
              <span>
                연락처<span className="text-primary align-top"> *</span>
              </span>
            }
          >
            <Input
              name="phone"
              type="tel"
              required
              placeholder="ex)010-1234-5678"
            />
          </KeyValueLabel>
          <KeyValueLabel direction="col" label={<span>직무</span>}>
            <Select name="job">
              <SelectTrigger>
                <SelectValue placeholder="선택해주세요"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="기획자">기획자</SelectItem>
                <SelectItem value="개발자">개발자</SelectItem>
                <SelectItem value="디자이너">디자이너</SelectItem>
                <SelectItem value="마케터">마케터</SelectItem>
                <SelectItem value="영업직">영업직</SelectItem>
                <SelectItem value="기타">기타</SelectItem>
              </SelectContent>
            </Select>
          </KeyValueLabel>
          <div className='flex justify-between gap-5'>
            <Button className='w-full' variant='outline' size="lg" type='button'><Link href='/onboarding/group'>이전</Link></Button>
            <Button className='w-full' size="lg" type='submit' >다음</Button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default GroupInfo