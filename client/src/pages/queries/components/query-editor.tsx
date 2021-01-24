import React from 'react'
import { Button, Tabs } from 'antd'
import { CaretRightFilled, CodeOutlined } from '@ant-design/icons'
import { useMutation, useQueryClient } from 'react-query'
import { useParams, useSearchParams } from 'react-router-dom'
import useMeasure from 'react-use-measure'
import clsx from 'clsx'
import { QueryResult } from 'types/query'
import { Cache } from 'utils/cache'
import Editor from 'components/editor'
import usePersistedSetState from 'hooks/use-persisted-state'
import { formatDuration } from 'utils/time'
import sqlFormatter from 'sql-formatter'
import { useTabData } from '../hooks/use-tab-data'
import { runQuery } from '../queries-and-mutations'
import CreateResourceMessage from './create-resource-message'
import QueryEditorSkeleton from './query-editor-skeleton'
import ResourceSelector from './resource-selector'
import HorizontalOrientation from './horizontal-orientation'
import VerticalOrientation from './vertical-orientation'
import ResultsTable from './results-table'

const runResultCache = new Cache()

enum PaneOrientation {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

export default function QueryEditor() {
  const { tabType, id } = useParams()
  const tabRoute = `${tabType}/${id}`

  const {
    isLoadingTabData,
    resourceId,
    updateResourceId,
    query,
    updateQuery,
  } = useTabData(tabRoute)

  const [measureContainer, containerBounds] = useMeasure()
  const [
    paneOrientation,
    setPaneOrientation,
  ] = usePersistedSetState<PaneOrientation>(
    'query-editor-orientation',
    PaneOrientation.VERTICAL,
  )

  const queryClient = useQueryClient()
  const {
    mutate: runQueryMutation,
    isLoading: isRunningQuery,
    error: queryResultError,
  } = useMutation(runQuery, {
    onSuccess: (runQueryResult) => {
      queryClient.refetchQueries(['history'])
      setQueryResult(runQueryResult)
    },
  })
  const [queryResult, setQueryResult] = usePersistedSetState<
    QueryResult | undefined
  >(`${tabRoute}-query-result`, undefined, runResultCache)

  const [searchParams, setSearchParams] = useSearchParams()

  if (isLoadingTabData) {
    return <QueryEditorSkeleton />
  }

  if (!resourceId) {
    return <CreateResourceMessage />
  }

  const PaneOrientationComponent =
    paneOrientation === PaneOrientation.HORIZONTAL
      ? HorizontalOrientation
      : VerticalOrientation

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center px-4 py-3 space-x-3 border-b">
        <ResourceSelector resource={resourceId} onChange={updateResourceId} />
        <div className="flex-1" />
        {queryResult?.timeToRunQuery ? (
          <div className="text-xs text-content-tertiary">
            Took{' '}
            <span className="font-medium text-content-primary">
              {formatDuration(queryResult.timeToRunQuery)}
            </span>{' '}
            to run
          </div>
        ) : null}
        <Button
          type="primary"
          icon={<CaretRightFilled />}
          loading={isRunningQuery}
          disabled={isRunningQuery || !query}
          onClick={() => {
            runQueryMutation({ resource: resourceId, query })
          }}
        >
          Run Query
        </Button>
        <Button
          icon={<CodeOutlined />}
          onClick={() => {
            updateQuery(sqlFormatter.format(query.replace(/\r\n/g, '\n')))
          }}
        >
          Beautify
        </Button>
      </div>
      <div
        className={clsx(
          'flex flex-1',
          paneOrientation === PaneOrientation.HORIZONTAL
            ? 'flex-col'
            : undefined,
        )}
        ref={measureContainer}
      >
        <PaneOrientationComponent
          toggleOrientation={() => {
            setPaneOrientation((prevState) =>
              prevState === PaneOrientation.HORIZONTAL
                ? PaneOrientation.VERTICAL
                : PaneOrientation.HORIZONTAL,
            )
          }}
          containerBounds={containerBounds}
          editor={
            <Editor
              resourceId={resourceId}
              value={query}
              setValue={updateQuery}
            />
          }
          tabContent={(headerIcons) => (
            <Tabs
              activeKey={searchParams.get('tab') ?? 'result'}
              onChange={(tabKey) => {
                setSearchParams({ tab: tabKey })
              }}
              size="small"
              className="w-full h-full px-4 py-1 queries-tab"
              tabBarExtraContent={headerIcons}
            >
              <Tabs.TabPane tab="Table" key="result">
                <div className="w-full h-full">
                  <ResultsTable
                    data={queryResult}
                    isLoading={isRunningQuery}
                    error={queryResultError}
                  />
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Charts" key="chart">
                <div />
              </Tabs.TabPane>
            </Tabs>
          )}
        />
      </div>
    </div>
  )
}
