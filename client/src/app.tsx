import React, { Suspense, lazy } from 'react'
import { Navigate, Routes } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from 'react-query'
import { Spin } from 'antd'
import { ReactQueryDevtools } from 'react-query/devtools'
import Route from 'components/route'
import Auth from 'components/auth'
import AppShell from 'components/app-shell'
import Home from 'pages/home'
import Onboarding from 'pages/onboard'
import ResourcesList from 'pages/resources/components/resources-list'
import CreateResource from 'pages/resources/components/create-resource'
import ResourceDetail from 'pages/resources/components/resource-detail'
import Dashboards from 'pages/dashboards'
import Dashboard from 'pages/dashboards/components/dashboard'
import TextEditorSettings from 'pages/settings-panel/components/text-editor-settings'
import Logrocket from 'components/logrocket'
import HealthCheck from 'components/health-check'
import Spinner from 'components/spinner'

const SHOW_DEV_TOOLS = false

const queryClient = new QueryClient()

const Login = lazy(() => import('pages/login'))
const Queries = lazy(() => import('pages/queries'))
const Resources = lazy(() => import('pages/resources'))
const SettingsPanel = lazy(() => import('pages/settings-panel'))

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Auth>
        <>
          <Suspense
            fallback={
              <div className="flex items-center justify-center w-screen h-screen">
                <Spin tip="Loading Page..." indicator={<Spinner />} />
              </div>
            }
          >
            <Routes>
              <Route element={<Login />} path="/login" />
              <Route protectedRoute element={<AppShell />} path="/">
                <Route protectedRoute element={<Home />} path="/" />
                <Route protectedRoute element={<Onboarding />} path="onboard" />
                <Route protectedRoute element={<Resources />} path="resources">
                  <Route protectedRoute path="/" element={<ResourcesList />} />
                  <Route
                    path="new/:resourceType"
                    element={<CreateResource />}
                  />
                  <Route path=":resourceId" element={<ResourceDetail />} />
                </Route>
                <Route path="queries">
                  <Route path="" element={<Queries />} />
                  <Route path=":tabType" element={<Queries />} />
                  <Route path=":tabType/:id" element={<Queries />} />
                </Route>
                <Route
                  protectedRoute
                  element={<Dashboards />}
                  path="dashboards"
                >
                  <Route
                    protectedRoute
                    path=":dashboardId"
                    element={<Dashboard />}
                  />
                </Route>
                <Route
                  protectedRoute
                  element={<SettingsPanel />}
                  path="settings"
                >
                  <Route
                    path="/"
                    element={<Navigate to="text-editor" replace={true} />}
                  />
                  <Route path="text-editor" element={<TextEditorSettings />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/" replace={true} />} />
            </Routes>
          </Suspense>
          {process.env.NODE_ENV === 'production' && <Logrocket />}
          {process.env.NODE_ENV === 'development' && SHOW_DEV_TOOLS ? (
            <>
              <ReactQueryDevtools />
              <HealthCheck />
            </>
          ) : null}
        </>
      </Auth>
    </QueryClientProvider>
  )
}
