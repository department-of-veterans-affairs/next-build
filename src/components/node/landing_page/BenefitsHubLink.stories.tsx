// Button.stories.ts|tsx
import { BenefitsHubLink } from './index'

const defaultValues = {
  title: 'Benefits Hub Link',
  component: BenefitsHubLink,
}
export default defaultValues

const exampleNode = {
  field_home_page_hub_label: 'Testing',
  field_teaser_text: 'This is some teaser text',
}

export const Primary = () => <BenefitsHubLink node={exampleNode} />
