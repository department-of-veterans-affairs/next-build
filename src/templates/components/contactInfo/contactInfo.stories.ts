import { Meta, StoryObj } from '@storybook/react'

import { ContactInfo } from './index'

const meta: Meta<typeof ContactInfo> = {
  title: 'Components/ContactInfo',
  component: ContactInfo,
}
export default meta

type Story = StoryObj<typeof ContactInfo>

export const Default: Story = {
  args: {
    contactType: 'DC',
    defaultContact: {
      label: 'MyVA411 main information line',
      number: '800-698-2411',
      href: 'tel:8006982411',
    },
  },
}

export const AdditionalContactPhone: Story = {
  args: {
    contactType: 'DC',
    defaultContact: {
      label: 'MyVA411 main information line',
      number: '800-698-2411',
      href: 'tel:8006982411',
    },
    additionalContact: {
      type: 'paragraph--phone_number',
      id: '1',
      label: 'GI Bill Hotline',
      number: '(281) 330-8004',
      extension: '444',
    },
  },
}

export const AdditionalContactEmail: Story = {
  args: {
    contactType: 'DC',
    defaultContact: {
      label: 'MyVA411 main information line',
      number: '800-698-2411',
      href: 'tel:8006982411',
    },
    additionalContact: {
      type: 'paragraph--email_contact',
      id: '2',
      label: 'John Smith, Department Chair',
      address: 'johnsmith@va.gov',
    },
  },
}

export const BenefitsHubContact: Story = {
  args: {
    contactType: 'BHC',
    benefitHubContacts: [
      {
        label: 'Health benefits hotline',
        number: '877-222-VETS (8387)',
        href: 'tel:8772228387',
      },
      {
        label: 'My HealtheVet help desk',
        number: '877-327-0022',
        href: 'tel:8773270022',
      },
      {
        label: 'eBenefits technical support',
        number: '800-983-0937',
        href: 'tel:8009830937',
      },
      {
        label: 'MyVA411 main information line',
        number: '800-698-2411',
        href: 'tel:8006982411',
      },
      {
        label: 'Telecommunications Relay Services (using TTY)',
        number: 'TTY: 711',
        href: 'tel:1+711',
      },
    ],
  },
}
