import React, { useState } from 'react'
import { Button } from 'antd'
import { CheckOutlined, DownOutlined, RightOutlined } from '@ant-design/icons'
import { NavLink } from 'react-router-dom'
import Modal from 'antd/lib/modal/Modal'

type StepProps = {
  id: number
  title: string
  description: string | React.ReactNode
  cta: string
  redirectRoute: string
  completed: boolean
  isOpen: boolean
  openStep: (id: number) => void
}
export default function Step({
  id,
  title,
  description,
  cta,
  redirectRoute,
  completed,
  isOpen,
  openStep,
}: StepProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  function handleOpenVideoModal() {
    setIsVideoOpen(true)
  }
  function handleCloseVideoModal() {
    setIsVideoOpen(false)
  }

  return (
    <>
      <div className="space-y-4 border rounded-md">
        <div
          className="flex items-center w-full px-6 py-4 space-x-4 cursor-pointer"
          onClick={() => {
            openStep(id)
          }}
        >
          {completed ? (
            <span className="flex items-center justify-center w-6 h-6 text-white bg-green-600 rounded-full">
              <CheckOutlined />
            </span>
          ) : (
            <span className="flex items-center justify-center w-6 h-6 p-1 text-gray-700 border border-gray-700 rounded-full">
              {id}
            </span>
          )}
          <p className="font-semibold">{title}</p>
          <div className="flex-1" />
          {isOpen ? <DownOutlined /> : <RightOutlined />}
        </div>
        {isOpen ? (
          <div className="flex items-start justify-center w-full px-8 pb-6">
            <div className="w-1/2 px-2">
              <p className="pr-4 mb-4">{description}</p>
              <NavLink to={redirectRoute}>
                <Button type="primary">{cta}</Button>
              </NavLink>
            </div>
            <div className="w-1/2">
              <img
                src={require('images/thumbnails/john-wick.png').default}
                className="cursor-pointer"
                onClick={handleOpenVideoModal}
              />
            </div>
          </div>
        ) : null}
      </div>
      <Modal
        title={title}
        visible={isVideoOpen}
        onCancel={handleCloseVideoModal}
        width={840}
        footer={false}
        destroyOnClose
      >
        <iframe
          className="w-full"
          height="520"
          src="https://www.youtube.com/embed/jLFrrwZs8gc?autoplay=1&&rel=0"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </Modal>
    </>
  )
}
