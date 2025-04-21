import { Meta, StoryObj } from '@storybook/react'

import { Event } from './template'

const meta: Meta<typeof Event> = {
  title: 'Layouts/Event',
  component: Event,
}
export default meta

type Story = StoryObj<typeof Event>

export const Default: Story = {
  args: {
    title: 'Event title',
    image: null,
    description:
      'Get important VA updates and hear from VAPHS leadership and representatives from VBA’s Pittsburgh Regional Office and the National Cemetery of the Alleghenies.',
    datetimeRange: [
      {
        value: '2028-12-11T15:30:00+00:00',
        end_value: '2028-12-11T16:30:00+00:00',
        duration: 60,
        rrule: null,
        rrule_index: null,
        timezone: 'America/New_York',
      },
    ],
    locationHumanReadable: 'Building 71, Learning Exchange',
    facilityLocation: null,
    locationType: 'facility',
    urlOfOnlineEvent: null,
    address: {
      langcode: 'en',
      country_code: 'US',
      administrative_area: 'PA',
      locality: 'Pittsburgh',
      address_line1: '1010 Delafield Road',
      address_line2: '',
    },
    cost: 'Free',
    socialLinks: {
      path: '/pittsburgh-health-care/events/63132',
      title: 'Veterans Town Hall',
    },
    link: null,
    additionalInfo: null,
    eventCTA: null,
    body: {
      value:
        '<p>Get important VA updates and hear from VAPHS leadership and representatives from VBA’s Pittsburgh Regional Office and the National Cemetery of the Alleghenies. Our town hall is part of our ongoing effort to hear from you and use your feedback to improve VA care.</p>\r\n\r\n<p>Attend in person, via WebEx or by phone.</p>\r\n\r\n<p>1. Join in person in the Learning Exchange on our H.J. Heinz III campus, 1010 Delafield Road, Pittsburgh, PA 15215, building 71, Learning Exchange.</p>\r\n\r\n<p>2. Join via Webex:</p>\r\n\r\n<ul><li>Go to: <a href="/admin/content/linky/16960">https://veteransaffairs.webex.com/veteransaffairs/j.php?MTID=mf85a5856faead97291fe0ce7cfacfb00</a></li>\r\n\t<li>If prompted, use webinar/event number 2763 626 2859 and password 3TKkzQqm@23</li>\r\n</ul><p>3. Join via phone:</p>\r\n\r\n<ul><li>Call 1-404-397-1596 and enter access code 276 029 65213</li>\r\n\t<li>Phone participants must press *3 to raise their hand to ask a question.</li>\r\n</ul>',
      format: 'rich_text',
      processed:
        '<p>Get important VA updates and hear from VAPHS leadership and representatives from VBA’s Pittsburgh Regional Office and the National Cemetery of the Alleghenies. Our town hall is part of our ongoing effort to hear from you and use your feedback to improve VA care.</p>\n\n<p>Attend in person, via WebEx or by phone.</p>\n\n<p>1. Join in person in the Learning Exchange on our H.J. Heinz III campus, 1010 Delafield Road, Pittsburgh, PA 15215, building 71, Learning Exchange.</p>\n\n<p>2. Join via Webex:</p>\n\n<ul><li>Go to: <a href="https://veteransaffairs.webex.com/wbxmjs/joinservice/sites/veteransaffairs/meeting/download/0602006047574141a9f001afcc3a873c?siteurl=veteransaffairs&amp;MTID=mf85a5856faead97291fe0ce7cfacfb00">https://veteransaffairs.webex.com/veteransaffairs/j.php?MTID=mf85a5856faead97291fe0ce7cfacfb00</a></li>\n\t<li>If prompted, use webinar/event number 2763 626 2859 and password 3TKkzQqm@23</li>\n</ul><p>3. Join via phone:</p>\n\n<ul><li>Call 1-404-397-1596 and enter access code 276 029 65213</li>\n\t<li>Phone participants must press *3 to raise their hand to ask a question.</li>\n</ul>',
    },
    listing: '/pittsburgh-health-care/events ',
    listingOffice: 'Pittsburgh VA Medical Center',
  },
}
