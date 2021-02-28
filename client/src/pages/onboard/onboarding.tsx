import { Result } from 'antd'
import { range } from 'lodash-es'
import React, { useState, useMemo } from 'react'
import { useQuery } from 'react-query'
import Step from './components/step'
import { fetchOnboardingSteps } from './queries'

export default function Onboarding() {
  const [openStep, setOpenStep] = useState<number | undefined>()
  const { data: onboardingSteps, isLoading, error } = useQuery(
    ['onboarding-steps'],
    fetchOnboardingSteps,
  )

  function handleOpenStep(id: number) {
    setOpenStep((prevState) => (prevState !== id ? id : undefined))
  }

  const onboardingContent = useMemo(() => {
    if (isLoading) {
      return (
        <div className="w-full">
          <div className="max-w-4xl pb-8 mx-auto my-8 space-y-4 shadow-lg ">
            <div className="px-8 py-6 border-b-2">
              <div className="w-64 h-8 bg-background-secondary animate-pulse" />
            </div>
            <div className="px-8 space-y-4">
              {range(4).map((val) => (
                <div
                  className="flex items-center px-6 py-4 space-x-4 border rounded-md"
                  key={val}
                >
                  <div className="w-6 h-6 rounded-full bg-background-secondary animate-pulse" />
                  <div className="w-64 h-6 bg-background-secondary animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    if (error) {
      return <Result status="warning" subTitle={(error as any).message} />
    }

    if (onboardingSteps) {
      return (
        <div className="w-full">
          <div className="max-w-4xl pb-8 mx-auto my-8 space-y-4 shadow-lg ">
            <div className="px-8 py-6 text-lg font-semibold border-b-2 text-brand-primary">
              Getting Started
            </div>
            <div className="px-8 space-y-4">
              {onboardingSteps.map((step) => (
                <Step
                  key={step.id}
                  id={step.id}
                  title={step.title}
                  description={step.description}
                  cta={step.cta}
                  redirectRoute={step.redirectRoute}
                  completed={step.completed}
                  isOpen={openStep === step.id}
                  openStep={handleOpenStep}
                />
              ))}
            </div>
          </div>
        </div>
      )
    }
  }, [isLoading, error, onboardingSteps, openStep])

  return <>{onboardingContent}</>
}
