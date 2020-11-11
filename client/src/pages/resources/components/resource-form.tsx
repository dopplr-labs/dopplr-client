import React, { useCallback, useMemo, useState } from 'react'
import { range } from 'lodash-es'
import { Form, Input, InputNumber, Button, Result } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Link, useParams } from 'react-router-dom'
import { useQuery, useMutation, queryCache } from 'react-query'
import { fetchResource, fetchResources, updateResource } from '../queries'

export default function ResourceForm() {
  const { resourceId } = useParams() as { resourceId: string }
  const { isLoading, data: resource, error } = useQuery(
    ['resources', resourceId],
    () => fetchResource(resourceId),
  )
  const { data: resources } = useQuery(['resources'], fetchResources)
  const [disabled, setDisabled] = useState(true)

  const [editResource] = useMutation(updateResource, {
    onMutate: (updatedResource) => {
      queryCache.setQueryData(
        ['resources'],
        resources?.map((resource) =>
          resource.id === updatedResource.id
            ? { ...resource, ...updatedResource }
            : resource,
        ),
      )
    },
  })

  const onFinish = useCallback(
    (values: any) => {
      const { name, host, port, database, username, password } = values
      const id = parseInt(resourceId)
      editResource({
        id,
        name,
        host,
        port,
        database,
        username,
        password,
      })
    },
    [editResource, resourceId],
  )

  const renderForm = useMemo(() => {
    if (isLoading) {
      return (
        <div>
          <img
            src={require('images/resources/postgres-logo.png')}
            className="w-5 h-5 mb-4"
          />
          <div className="font-medium text-gray-800">Connect to Postgres</div>
          <div className="mb-6 text-xs">
            Connect your Postgres database to run queries and create dashboard
          </div>
          <div className="flex mb-6 space-x-32">
            <div className="w-24 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="flex-1 h-8 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="mb-6 border-b" />
          <div>
            <div className="font-medium text-gray-800">
              Database Configuration
            </div>
            <div className="mb-6 text-xs">
              This configuration would be used to connect with your Postgres
              database
            </div>
          </div>
          {range(5).map((val) => (
            <div key={val} className="flex mb-6 space-x-32">
              <div
                className="w-24 h-8 bg-gray-200 rounded animate-pulse"
                style={{ opacity: 1 - val / 5 }}
              />
              <div
                className="flex-1 h-8 bg-gray-200 rounded animate-pulse"
                style={{ opacity: 1 - val / 5 }}
              />
            </div>
          ))}
          <div className="flex p-4 -mx-4 -mb-4 space-x-4 bg-gray-50">
            <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="flex-1" />
            <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      )
    }

    if (error) {
      return <Result status="warning" subTitle={(error as any).message} />
    }

    if (resource) {
      const { name, host, port, database, username, password } = resource
      return (
        <Form
          layout="horizontal"
          key={resourceId}
          initialValues={{ name, host, port, database, username, password }}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          labelAlign="left"
          onValuesChange={() => {
            setDisabled(false)
          }}
          onFinish={onFinish}
        >
          <img
            src={require('images/resources/postgres-logo.png')}
            className="w-5 h-5 mb-4"
          />
          <div className="font-medium text-gray-800">Connect to Postgres</div>
          <div className="mb-6 text-xs">
            Connect your Postgres database to run queries and create dashboard
          </div>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: 'Please enter the resource name' },
            ]}
          >
            <Input placeholder='i.e. "Production DB (readonly)"' />
          </Form.Item>

          <div className="mb-6 border-b" />

          <div>
            <div className="font-medium text-gray-800">
              Database Configuration
            </div>
            <div className="mb-6 text-xs">
              This configuration would be used to connect with your Postgres
              database
            </div>
          </div>
          <Form.Item
            name="host"
            label="Host"
            rules={[
              {
                required: true,
                message: 'Please enter the database host url',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="port"
            label="Port"
            rules={[
              { required: true, message: 'Please enter the database port' },
            ]}
          >
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item
            name="database"
            label="Database"
            rules={[
              { required: true, message: 'Please enter the database name' },
            ]}
          >
            <Input placeholder="hn_api_production" />
          </Form.Item>
          <Form.Item
            name="username"
            label="Database Username"
            rules={[
              {
                required: true,
                message: 'Please enter the database user name',
              },
            ]}
          >
            <Input placeholder="postgres" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Database Password"
            rules={[
              {
                required: true,
                message: 'Please enter the database password',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <div className="flex p-4 -mx-4 -mb-4 space-x-4 bg-gray-50">
            <Link to="/resources">
              <Button
                htmlType="button"
                className="mr-2"
                icon={<ArrowLeftOutlined />}
              >
                Back
              </Button>
            </Link>
            <div className="flex-1" />
            <Button htmlType="button" className="mr-2">
              Test Connection
            </Button>
            <Button type="primary" htmlType="submit" disabled={disabled}>
              Save
            </Button>
          </div>
        </Form>
      )
    }

    return null
  }, [isLoading, resource, error, disabled, resourceId, onFinish])

  return (
    <div className="flex-1 px-12 py-8 space-x-6 bg-gray-50">
      <div className="flex items-start w-full max-w-screen-md mx-auto space-x-8">
        <div className="flex-1 p-4 overflow-hidden bg-white rounded-md shadow">
          {renderForm}
        </div>
      </div>
    </div>
  )
}
