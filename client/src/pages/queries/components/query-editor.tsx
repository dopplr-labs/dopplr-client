import React, { useRef, useState } from 'react'
import Axios from 'axios'
import { useMutation } from 'react-query'
import { Input, Button, Table } from 'antd'
import {
  SearchOutlined,
  DownloadOutlined,
  CaretRightFilled,
  SaveOutlined,
  CodeOutlined,
} from '@ant-design/icons'
import MonacoEditor from 'react-monaco-editor'
import Editor from 'components/editor'

export default function QueryEditor({ resourceId }: { resourceId: number }) {
  const [query, setQuery] = useState('')
  const editor = useRef<MonacoEditor | null>(null)

  async function fetchTable({
    resource,
    query,
  }: {
    resource: number
    query: string
  }) {
    const { data } = await Axios.post('http://localhost:3001/queries/run', {
      resource,
      query,
    })
    return data.data
  }

  const [runQuery, { isLoading, data }] = useMutation(fetchTable)

  function handleQuery() {
    runQuery({ resource: resourceId, query })
  }

  return (
    <>
      <div className="flex items-center justify-between h-16 px-6 border-b">
        <span className="text-sm">Untitled query</span>
        <div className="flex items-center space-x-4">
          <Button
            icon={<CodeOutlined />}
            onClick={() => {
              editor.current?.editor
                ?.getAction('editor.action.formatDocument')
                .run()
            }}
          >
            Beautify
          </Button>
          <Button icon={<SaveOutlined />}>Save</Button>
          <Button
            type="primary"
            icon={<CaretRightFilled />}
            loading={isLoading}
            disabled={isLoading}
            onClick={handleQuery}
          >
            Run Query
          </Button>
        </div>
      </div>
      <div className="border-b">
        <Editor
          resourceId={resourceId}
          value={query}
          setValue={setQuery}
          ref={(monacoEditor) => {
            editor.current = monacoEditor
          }}
        />
      </div>
      <div className="flex-1 px-6 py-4">
        <div className="flex items-center justify-end mb-4 gap-x-4">
          <Input
            placeholder="Search Table"
            className="w-64"
            prefix={<SearchOutlined />}
          />
          <Button icon={<DownloadOutlined />}>Download</Button>
        </div>
        <Table
          columns={data?.fields.map((field: any) => ({
            key: field.name,
            title: field.name,
            dataIndex: field.name,
          }))}
          dataSource={data?.rows.map((row: any, index: number) => ({
            key: (index + 1).toString(),
            ...row,
          }))}
          size="small"
          loading={isLoading}
          pagination={false}
          scroll={{ y: 300 }}
        />
      </div>
    </>
  )
}
