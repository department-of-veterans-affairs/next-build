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
      title: 'Phone Number',
      value: '(855) 867-5309',
      href: 'tel:8558675309',
    },
  },
}

export const AdditionalContactPhone: Story = {
  args: {
    contactType: 'DC',
    defaultContact: {
      title: 'Phone Number',
      value: '(855) 867-5309',
      href: 'tel:8558675309',
    },
    additionalContact: {
      type: 'paragraph--phone_number',
      id: '1',
      label: 'Phone Number',
      number: '(281) 330-8004',
      extension: '444',
    },
  },
}

export const AdditionalContactEmail: Story = {
  args: {
    contactType: 'DC',
    defaultContact: {
      title: 'Phone Number',
      value: '(855) 867-5309',
      href: 'tel:8558675309',
    },
    additionalContact: {
      type: 'paragraph--email_contact',
      id: '2',
      label: 'Email Address',
      address: 'johnsmith@va.gov',
    },
  },
}

export const BenefitsHubContact: Story = {
  args: {
    contactType: 'BHC',
    benefitHubContacts: [
      {
        title: 'Health benefits hotline: ',
        value: '877-222-VETS (8387)',
        href: 'tel:8772228387',
      },
      {
        title: 'My HealtheVet help desk: ',
        value: '877-327-0022',
        href: 'tel:8773270022',
      },
      {
        title: 'eBenefits technical support:',
        value: '800-983-0937',
        href: 'tel:8009830937',
      },
      {
        title: 'MyVA411 main information line:',
        value: '800-698-2411',
        href: 'tel:8006982411',
      },
      {
        title: 'Telecommunications Relay Services (using TTY)',
        value: 'TTY: 711',
        href: 'tel:1+711',
      },
    ],
  },
}
