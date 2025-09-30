import { NodeVamcSystemPoliciesPage } from '@/types/drupal/node'
import mockData from './mock.json'

// @ts-expect-error field_office isn't hydrated in the mock data. We only use it
// for fetching the menu, but we're mocking that call in the test.
export default mockData as NodeVamcSystemPoliciesPage
