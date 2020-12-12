import React, { useEffect } from 'react'
import { Form, Input, message, Modal } from 'antd'
import { queryCache, useMutation } from 'react-query'
import { SavedQuery, SavedQueryPage } from 'types/query'
import { updateQuery } from '../queries-and-mutations'

type RenameQueryModalProps = {
  visible: boolean
  onRequestClose: () => void
  queryId: number
  queryName: string
}

export default function RenameQueryModal({
  visible,
  onRequestClose,
  queryId,
  queryName,
}: RenameQueryModalProps) {
  const [form] = Form.useForm()

  useEffect(
    function setQueryName() {
      form.setFieldsValue({ queryName })
    },
    [form, queryName],
  )

  const savedQueries: SavedQueryPage[] | undefined = queryCache.getQueryData([
    'saved-queries',
  ])

  const savedQuery: SavedQuery | undefined = queryCache.getQueryData([
    'saved-query',
    queryId,
  ])

  const [updateQueryMutation] = useMutation(updateQuery, {
    onMutate: (updatedQuery) => {
      onRequestClose()
      queryCache.setQueryData(
        ['saved-queries'],
        savedQueries?.map((page) => ({
          ...page,
          items: page.items.map((item) =>
            item.id === updatedQuery.queryId
              ? { ...item, name: updatedQuery.name }
              : item,
          ),
        })),
      )
      queryCache.setQueryData(['saved-query', queryId], {
        ...savedQuery,
        name: updatedQuery.name,
      })
    },
    onSuccess: () => {
      message.success('Query updated successfully')
    },
  })

  function handleFinish() {
    const { queryName } = form.getFieldsValue()
    updateQueryMutation({
      queryId,
      name: queryName,
    })
  }

  function handleOk() {
    form.submit()
  }

  function handleCancel() {
    onRequestClose()
  }

  return (
    <Modal
      visible={visible}
      title="Rename query"
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose
    >
      <Form
        layout="vertical"
        form={form}
        requiredMark={false}
        onFinish={handleFinish}
      >
        <Form.Item
          label="Query Name"
          name="queryName"
          rules={[
            { required: true, message: 'Please enter name for your query' },
          ]}
        >
          <Input
            autoFocus
            onFocus={(event) => {
              event.target.select()
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}