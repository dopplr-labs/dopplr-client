import client from 'utils/client'
import { Dashboard } from 'types/dashboard'
import { Category } from 'types/category'
import { DashboardChart } from 'types/dashboard-chart'

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await client.get<{ success: boolean; data: Category[] }>(
    '/dashboards/categories',
  )
  return data.data
}

export async function fetchDashboards(): Promise<Dashboard[]> {
  const { data } = await client.get<{ success: boolean; data: Dashboard[] }>(
    '/dashboards',
  )
  return data.data
}

export async function fetchDashboard(id: number): Promise<Dashboard> {
  const { data } = await client.get<{ success: boolean; data: Dashboard }>(
    `/dashboards/${id}`,
  )
  return data.data
}

export async function fetchDashboardChart(id: number): Promise<DashboardChart> {
  const { data } = await client.get<{ success: boolean; data: DashboardChart }>(
    `/dashboard-charts/${id}`,
  )
  return data.data
}

export async function createCategory({
  name,
}: {
  name: string
}): Promise<Category> {
  const { data } = await client.post<{ success: true; data: Category }>(
    '/dashboards/categories',
    { name },
  )
  return data.data
}

export async function createDashboard({
  name,
  description,
  category,
}: {
  name: string
  description?: string
  category: number
}): Promise<Dashboard> {
  const { data } = await client.post<{ success: boolean; data: Dashboard }>(
    '/dashboards',
    { name, description, category },
  )
  return data.data
}

export async function createDashboardChart({
  chart,
  dashboard,
}: {
  chart: number
  dashboard: number
}): Promise<DashboardChart> {
  const { data } = await client.post<{ success: true; data: DashboardChart }>(
    '/dashboard-charts',
    { chart, dashboard },
  )
  return data.data
}

export async function updateDashboard({
  id,
  layout,
}: Partial<Dashboard>): Promise<Dashboard> {
  const { data } = await client.patch<{ success: boolean; data: Dashboard }>(
    `/dashboards/${id}`,
    { layout },
  )
  return data.data
}

export async function deleteDashboard(id: number): Promise<Dashboard> {
  const { data } = await client.delete<{ success: boolean; data: Dashboard }>(
    `/dashboards/${id}`,
  )
  return data.data
}

export async function deleteDashboardChart(
  id: number,
): Promise<DashboardChart> {
  const { data } = await client.delete<{
    success: boolean
    data: DashboardChart
  }>(`/dashboard-charts/${id}`)
  return data.data
}
