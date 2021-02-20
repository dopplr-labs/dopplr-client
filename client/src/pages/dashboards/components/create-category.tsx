import React, { cloneElement, useState } from 'react'
import { Input, Form, message, Modal } from 'antd'
import { useMutation, useQueryClient } from 'react-query'
import { Category } from 'types/category'
import { AxiosError } from 'axios'
import { createCategory } from '../queries'

type CreateCategoryProps = {
  trigger: React.ReactElement
  onCreate?: (category: Category) => void
}

export default function CreateCategory({
  trigger,
  onCreate,
}: CreateCategoryProps) {
  const [visible, setVisible] = useState(false)

  function handleCancel() {
    setVisible(false)
  }

  function handleTriggerClick() {
    setVisible(true)
  }

  const queryClient = useQueryClient()

  const { mutate: addCategory, isLoading: isCreatingCategory } = useMutation<
    Category,
    AxiosError,
    { name: string }
  >(createCategory, {
    onSuccess: (createdCategory) => {
      queryClient.setQueryData<Category[]>(['categories'], (prevCategories) =>
        prevCategories
          ? [...prevCategories, createdCategory]
          : [createdCategory],
      )
      message.success('Category created successfully')
      handleCancel()
      onCreate?.(createdCategory)
    },
    onError: (error) => {
      message.error(
        error.response?.data?.message ??
          'Something went wrong. Please try again',
      )
    },
  })

  const [form] = Form.useForm()

  function handleCreateCategory({ name }: { name: string }) {
    addCategory({ name })
  }

  function handleOk() {
    form.submit()
  }

  return (
    <>
      <Modal
        destroyOnClose
        visible={visible}
        onCancel={handleCancel}
        onOk={handleOk}
        okButtonProps={{ loading: isCreatingCategory }}
      >
        <Form layout="vertical" onFinish={handleCreateCategory} form={form}>
          <Form.Item
            label="Name"
            name="categoryName"
            rules={[{ required: true, message: 'Category name is required' }]}
          >
            <Input placeholder="Enter the name for category" />
          </Form.Item>
        </Form>
      </Modal>
      {cloneElement(trigger, { onClick: handleTriggerClick })}
    </>
  )
}
