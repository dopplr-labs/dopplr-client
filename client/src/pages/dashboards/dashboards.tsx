import React from 'react'
import { Button, Menu, Dropdown } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Outlet } from 'react-router-dom'
import PageLayout from 'components/page-layout'
import PageSideBar from 'components/page-side-bar'
import SideBar from './components/side-bar'
import CreateCategory from './components/create-category'
import CreateDashboard from './components/create-dashboard'

export default function Dashboards() {
  return (
    <>
      <PageLayout
        sidebar={
          <PageSideBar
            title="Dashboards"
            description="Create and manage your dashboards"
            primaryAction={
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item>
                      <CreateCategory
                        trigger={
                          <div className="px-4 py-2 -mx-4 -my-2">
                            Create New Category
                          </div>
                        }
                      />
                    </Menu.Item>
                    <Menu.Item>
                      <CreateDashboard
                        trigger={
                          <div className="px-4 py-2 -mx-4 -my-2">
                            Create New Dashboard
                          </div>
                        }
                      />
                    </Menu.Item>
                  </Menu>
                }
              >
                <Button
                  icon={<PlusOutlined />}
                  className="w-full"
                  type="primary"
                >
                  Create New
                </Button>
              </Dropdown>
            }
            items={<SideBar />}
          />
        }
        content={<Outlet />}
      />
    </>
  )
}
