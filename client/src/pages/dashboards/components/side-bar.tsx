import React from 'react'
import { AxiosError } from 'axios'
import { range } from 'lodash-es'
import { useQuery } from 'react-query'
import { Result } from 'antd'
import { Category } from 'types/category'
import { fetchCategories } from '../queries'
import CategoryMenuItem from './category-menu-item'

export default function SideBar() {
  const { data: categories, isLoading, error } = useQuery<
    Category[],
    AxiosError
  >(['categories'], fetchCategories)

  if (isLoading) {
    return (
      <div className="space-y-4">
        {range(3).map((val) => (
          <div key={val} className="px-3 space-y-4">
            <div className="w-full h-4 bg-background-secondary animate-pulse" />
            <div className="pr-6 space-y-4">
              <div className="w-full h-4 bg-background-secondary animate-pulse" />
              <div className="w-full h-4 bg-background-secondary animate-pulse" />
              <div className="w-full h-4 bg-background-secondary animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Result
        status="warning"
        subTitle={
          error?.response?.data?.message ??
          'Something went wrong. Please try again'
        }
      />
    )
  }

  if (categories) {
    return (
      <div className="px-4 space-y-4">
        {categories.map((category) => (
          <CategoryMenuItem category={category} key={category.id} />
        ))}
      </div>
    )
  }

  return null
}
