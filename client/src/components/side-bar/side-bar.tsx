import React, { cloneElement } from 'react'
import {
  BarChartOutlined,
  CodeOutlined,
  DatabaseOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { NavLink } from 'react-router-dom'

const pages = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: <BarChartOutlined />,
    defaultRoute: '/dashboards',
    routes: ['/dashboards', '/dashboards/:dashboardId?'],
  },
  {
    id: 'queries',
    title: 'Queries',
    icon: <CodeOutlined />,
    defaultRoute: '/queries',
    routes: ['/queries'],
  },
  {
    id: 'resources',
    title: 'Resources',
    icon: <DatabaseOutlined />,
    defaultRoute: '/resources',
    routes: [
      '/resources',
      '/resources/:resourceId',
      '/resources/new/:resourceType',
    ],
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: <SettingOutlined className="text-xl" />,
    defaultRoute: '/settings',
    routes: ['/settings'],
  },
]

export default function SideBar() {
  return (
    <div className="flex flex-col items-center justify-start w-24 h-full space-y-2 bg-white border-r text-content-secondary">
      {pages.map((page) => {
        return (
          <NavLink
            to={page.defaultRoute}
            key={page.id}
            className="flex flex-col items-center justify-center w-full py-3"
            activeClassName="bg-background-secondary side-bar-link-selected"
          >
            {cloneElement(page.icon, { className: 'text-lg' })}
            <div className="text-xs">{page.title}</div>
          </NavLink>
        )
      })}
    </div>
  )
}
