import { Step } from 'types/onboarding'
import client from 'utils/client'

export async function fetchOnboardingSteps(): Promise<Step[]> {
  const { data } = await client.get('/onboard')
  return data
}
