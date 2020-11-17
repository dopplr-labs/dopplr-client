import Axios from 'axios'
import { QueryResult } from 'types/query'
import { SchemaResult } from 'types/schema'

const client = Axios.create({ baseURL: process.env.REACT_APP_API_BASE_URL })

export async function runQuery({
  resource,
  query,
}: {
  resource: number
  query: string
}) {
  const { data } = await client.post<{ success: boolean; data: QueryResult }>(
    '/queries/run',
    {
      resource,
      query,
    },
  )
  return data.data
}

export async function fetchSchema(id: number) {
  const { data } = await client.post<{
    success: boolean
    data: SchemaResult[]
  }>(`/resources/schema/${id}`)
  return data.data
}