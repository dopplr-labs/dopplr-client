import {
  DownOutlined,
  EllipsisOutlined,
  PlusOutlined,
  RightOutlined,
} from '@ant-design/icons'
import { Dropdown, Menu } from 'antd'
import clsx from 'clsx'
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Category } from 'types/category'
import CreateDashboard from './create-dashboard'

type CategoryMenuItemProps = {
  category: Category
  className?: string
  style?: React.CSSProperties
}

export default function CategoryMenuItem({
  category,
  className,
  style,
}: CategoryMenuItemProps) {
  const hasDashboards = !!category.dashboards?.length
  const [childrenVisible, setChildrenVisible] = useState(true)

  const navigate = useNavigate()

  return (
    <div
      key={category.id}
      className={clsx('space-y-2', className)}
      style={style}
    >
      <div className="flex items-center space-x-2 group">
        <button
          className={clsx(
            'flex flex-1 items-center rounded-sm focus:outline-none space-x-2 text-brand-primary',
            !hasDashboards ? 'opacity-25' : undefined,
          )}
          disabled={!hasDashboards}
          onClick={() => {
            setChildrenVisible((prevState) => !prevState)
          }}
        >
          {childrenVisible ? (
            <DownOutlined className="text-xxs" />
          ) : (
            <RightOutlined className="text-xxs" />
          )}
          <div className="flex-1 text-left truncate">{category.name}</div>
        </button>
        <CreateDashboard
          trigger={
            <button
              className="flex items-center justify-center w-4 h-4 transition-opacity duration-75 rounded-sm opacity-25 focus:outline-none focus:ring-2 focus:ring-offset-brand-primary group-hover:opacity-100"
              title={`Add dashboard to ${category.name}`}
            >
              <PlusOutlined />
            </button>
          }
          initialCategory={category.id}
          onCreate={(dashboardCreated) => {
            setChildrenVisible(true)
            navigate(`/dashboards/${dashboardCreated.id}`)
          }}
        />
        <Dropdown
          trigger={['click']}
          overlay={
            <Menu>
              <Menu.Item>Edit Category</Menu.Item>
              <Menu.Item>Delete Category</Menu.Item>
            </Menu>
          }
        >
          <button className="flex items-center justify-center w-4 h-4 transition-opacity duration-75 rounded-sm opacity-25 focus:outline-none focus:ring-2 focus:ring-offset-brand-primary group-hover:opacity-100">
            <EllipsisOutlined />
          </button>
        </Dropdown>
      </div>

      {childrenVisible ? (
        <div className="pl-5 space-y-2">
          {category.dashboards?.map((dashboard) => (
            <div
              key={dashboard.id}
              className="flex items-center space-x-2 group text-content-secondary"
            >
              <NavLink
                to={`/dashboards/${dashboard.id}`}
                className="flex-1 truncate"
                activeClassName="text-brand-primary hover:text-brand-primary"
              >
                {dashboard.name}
              </NavLink>
              <Dropdown
                trigger={['click']}
                overlay={
                  <Menu>
                    <Menu.Item>Rename Dashboard</Menu.Item>
                    <Menu.Item>Delete Dashboard</Menu.Item>
                  </Menu>
                }
              >
                <button className="flex items-center justify-center w-4 h-4 transition-opacity duration-75 rounded-sm opacity-25 focus:outline-none focus:ring-2 focus:ring-offset-brand-primary group-hover:opacity-100">
                  <EllipsisOutlined />
                </button>
              </Dropdown>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
