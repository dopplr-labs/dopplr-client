import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useMutation, queryCache, useQuery } from 'react-query'
import { Button, Empty, Result, Select, Tooltip } from 'antd'
import {
  CaretRightFilled,
  SaveOutlined,
  CodeOutlined,
  PlusOutlined,
  UpOutlined,
  DownOutlined,
  BorderVerticleOutlined,
  BorderHorizontalOutlined,
  RightOutlined,
  LeftOutlined,
} from '@ant-design/icons'
import clsx from 'clsx'
import Editor from 'components/editor'
import useMeasure from 'react-use-measure'
import sqlFormatter from 'sql-formatter'
import VerticalPane from 'components/vertical-pane'
import { QueryResult, SavedQuery } from 'types/query'
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchResources } from 'pages/resources/queries'
import usePersistedSetState from 'hooks/use-persisted-state'
import { createPortal } from 'react-dom'
import HorizontalPane from 'components/horizontal-pane'
import { runQuery } from '../queries-and-mutations'
import ResultsTable from './results-table'
import SaveQueryModal from './save-query-modal'
import { TabsContext } from '../contexts/tabs-context'
import SchemaTab from './schema-tab'

enum SplitOrientation {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

function useUpdateTabOnQueryChange({
  tabRoute,
  query,
}: {
  tabRoute: string
  query: string
}) {
  const { updateTab } = useContext(TabsContext)

  useEffect(
    function updateTabOnQueryChange() {
      const tabName = query.length > 15 ? `${query.slice(0, 12)}...` : query
      const unsavedState = !!query
      updateTab({ tabRoute, name: tabName, unsavedState })
    },
    [query, tabRoute, updateTab],
  )
}

function Tab() {
  const { pathname: tabRoute } = useLocation()

  const [splitOrientation, setSplitOrientation] = usePersistedSetState<string>(
    'split-orientation',
    SplitOrientation.HORIZONTAL,
  )

  const [query, setQuery] = usePersistedSetState(`${tabRoute}-query`, '')
  useUpdateTabOnQueryChange({ tabRoute, query })

  const [selectedResourceId, setSelectedResourceId] = usePersistedSetState<
    number | null
  >(`${tabRoute}-resource`, null)
  const {
    isLoading: isLoadingResource,
    data: resources,
    error: resourcesError,
  } = useQuery(['resources'], fetchResources)
  useEffect(
    function selectFirstResourceOnResourceFetch() {
      if (resources?.length && selectedResourceId === null) {
        setSelectedResourceId(resources[0].id)
      }
    },
    [resources, selectedResourceId, setSelectedResourceId],
  )

  const [
    queryResult,
    setQueryResult,
  ] = usePersistedSetState<QueryResult | null>(`${tabRoute}-query-result`, null)
  const [
    runQueryMutation,
    { isLoading: isRunningQuery, error: queryResultError },
  ] = useMutation(runQuery, {
    onSuccess: (runQueryResult) => {
      queryCache.refetchQueries(['history'])
      setQueryResult(runQueryResult)
    },
  })

  const [saveModalVisible, setSaveModalVisible] = useState(false)
  const navigate = useNavigate()
  const { updateTab } = useContext(TabsContext)
  function handleQuerySaveComplete(savedQuery: SavedQuery) {
    navigate(`/queries/saved/${savedQuery.id}?replace=true`, { replace: true })
    updateTab({
      tabRoute,
      name: savedQuery.name,
      unsavedState: false,
      newRoute: `/queries/saved/${savedQuery.id}`,
    })
  }

  const [measureContainer, containerBounds] = useMeasure()

  if (isLoadingResource) {
    return (
      <div className="flex h-full px-4 space-x-4">
        <div className="flex-1 py-4 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-48 h-10 bg-background-secondary animate-pulse" />
            <div className="flex-1" />
            <div className="w-24 h-10 bg-background-secondary animate-pulse" />
            <div className="w-24 h-10 bg-background-secondary animate-pulse" />
            <div className="w-24 h-10 bg-background-secondary animate-pulse" />
          </div>
          <div className="w-full bg-background-secondary h-80 animate-pulse" />
          <div className="w-full h-40 bg-background-secondary animate-pulse" />
        </div>
      </div>
    )
  }

  if (resourcesError) {
    return (
      <Result status="warning" subTitle={(resourcesError as any).message} />
    )
  }

  if (!selectedResourceId) {
    return (
      <>
        <div className="flex items-center justify-center w-full h-full">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-xs">
                No resources have been created. Create a resource to run query
              </span>
            }
          >
            <Button type="primary" icon={<PlusOutlined />}>
              Create Resource
            </Button>
          </Empty>
        </div>
        {createPortal(
          <Empty
            className="flex flex-col items-center justify-center h-full my-0"
            description={
              <span className="text-xs">
                Create a resource to view its schema
              </span>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />,
          document.getElementById('schema-container') as HTMLDivElement,
        )}
      </>
    )
  }

  return (
    <>
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex items-center px-4 py-3 space-x-3 border-b">
          <Select
            placeholder="Select a resource"
            className="w-48"
            value={selectedResourceId}
            onChange={setSelectedResourceId}
          >
            {resources?.map((resource) => (
              <Select.Option key={resource.id} value={resource.id}>
                {resource.name}
              </Select.Option>
            ))}
          </Select>
          <div className="flex-1" />
          <div className="flex-1" />
          <Button
            icon={<CodeOutlined />}
            onClick={() => {
              setQuery(sqlFormatter.format(query.replace(/\r\n/g, '\n')))
            }}
          >
            Beautify
          </Button>
          <Button
            icon={<SaveOutlined />}
            onClick={() => {
              setSaveModalVisible(true)
            }}
          >
            Save
          </Button>
          <Button
            type="primary"
            icon={<CaretRightFilled />}
            loading={isRunningQuery}
            disabled={isRunningQuery}
            onClick={() => {
              if (selectedResourceId) {
                runQueryMutation({ resource: selectedResourceId, query })
              }
            }}
          >
            Run Query
          </Button>
        </div>
        <div
          className={clsx(
            'flex flex-1',
            splitOrientation === SplitOrientation.HORIZONTAL
              ? 'flex-col'
              : undefined,
          )}
          ref={measureContainer}
        >
          {splitOrientation === SplitOrientation.VERTICAL ? (
            <HorizontalPane
              paneName="editor-horizontal-pane"
              initialWidth={640}
              maxConstraint={800}
              minConstraint={320}
              buffer={160}
              render={({
                paneWidth,
                isPaneClose,
                dragHandle,
                toggleFullScreen,
              }) => (
                <>
                  <div
                    className="relative z-10 flex flex-col h-full border-r"
                    style={{ width: paneWidth }}
                  >
                    <Editor
                      resourceId={selectedResourceId}
                      value={query}
                      setValue={setQuery}
                    />
                    {dragHandle}
                  </div>
                  <div
                    className="h-full"
                    style={{ width: containerBounds.width - paneWidth }}
                  >
                    <div className="flex justify-end px-4 py-2 space-x-4">
                      <Tooltip
                        title="Split Horizontally"
                        placement="left"
                        mouseEnterDelay={1}
                      >
                        <button
                          className="focus:outline-none"
                          onClick={() => {
                            setSplitOrientation(SplitOrientation.HORIZONTAL)
                          }}
                        >
                          <BorderHorizontalOutlined />
                        </button>
                      </Tooltip>
                      <Tooltip
                        title="Fullscreen"
                        placement="left"
                        mouseEnterDelay={1}
                      >
                        <button
                          className="focus:outline-none"
                          onClick={toggleFullScreen}
                        >
                          {isPaneClose ? <RightOutlined /> : <LeftOutlined />}
                        </button>
                      </Tooltip>
                    </div>
                    <div className="h-full px-4">
                      <ResultsTable
                        data={queryResult}
                        isLoading={isRunningQuery}
                        error={queryResultError}
                      />
                    </div>
                  </div>
                </>
              )}
            />
          ) : (
            <VerticalPane
              paneName="editor-vertical-pane"
              initialHeight={480}
              maxHeight={containerBounds.height}
              maxConstraint={containerBounds.height - 160}
              buffer={80}
              render={({
                paneHeight,
                isFullScreen,
                dragHandle,
                toggleFullScreen,
              }) => (
                <>
                  {!isFullScreen ? (
                    <div
                      className="w-full"
                      style={{ height: containerBounds.height - paneHeight }}
                    >
                      <Editor
                        resourceId={selectedResourceId}
                        value={query}
                        setValue={setQuery}
                      />
                    </div>
                  ) : null}
                  <div
                    className="relative border-t"
                    style={{ height: paneHeight }}
                  >
                    {dragHandle}
                    <div className="flex justify-end px-4 py-2 space-x-4">
                      <Tooltip
                        placement="left"
                        title="Split Vertically"
                        mouseEnterDelay={1}
                      >
                        <button
                          className="focus:outline-none"
                          onClick={() => {
                            setSplitOrientation(SplitOrientation.VERTICAL)
                          }}
                        >
                          <BorderVerticleOutlined />
                        </button>
                      </Tooltip>
                      <Tooltip
                        placement="left"
                        title="Fullscreen"
                        mouseEnterDelay={1}
                      >
                        <button
                          className="focus:outline-none"
                          onClick={toggleFullScreen}
                        >
                          {isFullScreen ? <DownOutlined /> : <UpOutlined />}
                        </button>
                      </Tooltip>
                    </div>
                    <div className="h-full px-4">
                      <ResultsTable
                        data={queryResult}
                        isLoading={isRunningQuery}
                        error={queryResultError}
                      />
                    </div>
                  </div>
                </>
              )}
            />
          )}
        </div>
      </div>
      <SaveQueryModal
        visible={saveModalVisible}
        onRequestClose={() => {
          setSaveModalVisible(false)
        }}
        query={query}
        resourceId={selectedResourceId}
        onSave={handleQuerySaveComplete}
      />
      {createPortal(
        <SchemaTab resourceId={selectedResourceId} />,
        document.getElementById('schema-container') as HTMLDivElement,
      )}
    </>
  )
}

export default function UnsavedQueryEditorTab() {
  const { pathname: tabRoute } = useLocation()

  return useMemo(() => <Tab key={tabRoute} />, [tabRoute])
}
