import React, { cloneElement, useState } from 'react'
import { Form, Input, message, Select } from 'antd'
import { Dashboard } from 'types/dashboard'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Category } from 'types/category'
import Modal from 'antd/lib/modal/Modal'
import { AxiosError } from 'axios'
import { createDashboard, fetchCategories } from '../queries'

type CreateDashboardProps = {
  trigger: React.ReactElement
  initialCategory?: number
  onCreate?: (dashboard: Dashboard) => void
}

export default function CreateDashboard({
  trigger,
  initialCategory,
  onCreate,
}: CreateDashboardProps) {
  const [visible, setVisible] = useState(false)

  function handleCancel() {
    setVisible(false)
  }

  function handleTriggerClick() {
    setVisible(true)
  }

  const { data: categories } = useQuery(['categories'], fetchCategories)

  const queryClient = useQueryClient()
  const { mutate: addDashboard, isLoading: isCreatingDashboard } = useMutation<
    Dashboard,
    AxiosError,
    { name: string; description?: string; category: number }
  >(createDashboard, {
    onSuccess: (createdDashboard) => {
      queryClient.setQueryData<Category[]>(['categories'], (prevCategories) =>
        prevCategories
          ? prevCategories.map((category) =>
              category.id === createdDashboard.category.id
                ? {
                    ...category,
                    dashboards: category.dashboards
                      ? [...category.dashboards, createdDashboard]
                      : [createdDashboard],
                  }
                : category,
            )
          : [],
      )
      message.success('Dashboard created successfully')
      onCreate?.(createdDashboard)
      handleCancel()
    },
    onError: (error) => {
      message.error(
        error.response?.data?.message ??
          'Something went wrong. Please try again',
      )
    },
  })

  const [form] = Form.useForm()

  function handleOk() {
    form.submit()
  }

  function handleCreateDashboard({
    name,
    description,
    category,
  }: {
    name: string
    description?: string
    category: number
  }) {
    addDashboard({ name, description, category })
  }

  return (
    <>
      <Modal
        destroyOnClose
        visible={visible}
        onCancel={handleCancel}
        onOk={handleOk}
        okButtonProps={{ loading: isCreatingDashboard }}
      >
        <Form
          layout="vertical"
          onFinish={handleCreateDashboard}
          initialValues={{ category: initialCategory }}
          form={form}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Dashboard name is required' }]}
          >
            <Input placeholder="Give your dashboard a name" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea
              placeholder="Add a brief description to let other users know what story this dashboard is going to tell"
              rows={4}
            />
          </Form.Item>
          <Form.Item
            label="Category"
            name="category"
            rules={[
              {
                required: true,
                message: 'Dashboard category name is required',
              },
            ]}
          >
            <Select placeholder="Select a category to add dashboard">
              {categories?.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      {cloneElement(trigger, { onClick: handleTriggerClick })}
    </>
  )
}
