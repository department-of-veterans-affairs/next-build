import { render } from '@testing-library/react'
import PersonProfileTeaser from '.'

describe('PersonProfileTeaser with valid data', () => {
  test('correctly renders the component for someone with a profile page', () => {
    const validData = {
      completeBiographyCreate: true,
      description: 'Chief Experience Officer',
      emailAddress: 'brent-kratky@sample.com',
      entityPath: '/houston-health-care/staff-profiles/brent-kratky',
      firstName: 'Brent',
      lastName: 'Kratky',
      media: {
        id: 'c9711539-f785-4b8a-b897-f1537c92dad2',
        type: 'media--image',
        links: {
          '2_3_medium_thumbnail': {
            href: 'https://dsva-vagov-staging-cms-files.s3.us-gov-west-1.amazonaws.com/styles/2_3_medium_thumbnail/public/2022-04/Brent%20Kratky%20VA%20Headshot%20Jan%202021.jpg',
          },
        },
        alt: 'Brent Kratky',
        width: 1048,
        height: 1584,
        title: ''
      },
      office: 'VA Houston health care',
      phoneNumber: {
        id: '1234',
        type: 'paragraph--phone_number',
        label: 'Phone',
        extension: '12345',
        number: '000-859-5743',
        phoneType: 'tel',
      }
    }

    const screen = render(<PersonProfileTeaser {...validData} />)
    // console.log('container: ', container.innerHTML)

    expect(screen.container.innerHTML).toContain('contact=\"0008595743\" extension=\"12345\"')
    expect(screen.container.innerHTML).toContain('https%3A%2F%2Fdsva-vagov-staging-cms-files.s3.us-gov-west-1.amazonaws.com%2Fstyles%2F2_3_medium_thumbnail%2Fpublic%2F2022-04%2FBrent%2520Kratky%2520VA%2520Headshot%2520Jan%25202021.jpg')
    expect(screen.container.innerHTML).toContain('text=\"Brent Kratky\"')
    expect(screen.getByTestId('pp-teaser-desc')).toHaveTextContent('Chief Experience Officer')
    expect(screen.getByTestId('pp-teaser-office')).toHaveTextContent('VA Houston health care')
    expect(screen.getByTestId('pp-teaser-email')).toHaveTextContent('Email:')
    expect(screen.container.innerHTML).toContain('text=\"brent-kratky@sample.com\"')
  })

  test('correctly renders the component for someone without a profile page', () => {
    const validData = {
      completeBiographyCreate: false,
      description: 'Executive Director',
      emailAddress: 'julianne-flynn@sample.com',
      entityPath: '/south-texas-health-care/staff-profiles/julianne-flynn',
      firstName: 'Julianne',
      lastName: 'Flynn',
      media: {
        id: 'c9711539-f785-4b8a-b897-f1537c92dad2',
        type: 'media--image',
        links: {
          '2_3_medium_thumbnail': {
            href: 'https://dsva-vagov-staging-cms-files.s3.us-gov-west-1.amazonaws.com/styles/2_3_medium_thumbnail/public/2022-04/Julianne%20Flynn%20VA%20Headshot%20Jan%202021.jpg',
          },
        },
        alt: 'Julianne Flynn',
        width: 1048,
        height: 1584,
        title: ''
      },
      office: 'VA South Texas health care',
      phoneNumber: {
        label: 'Phone',
        extension: '12345',
        number: '000-859-5743',
        phoneType: 'tel',
        id: '1234',
        type: 'paragraph--phone_number',
      }
    }

    const screen = render(<PersonProfileTeaser {...validData} />)

    expect(screen.container.innerHTML).toContain('https%3A%2F%2Fdsva-vagov-staging-cms-files.s3.us-gov-west-1.amazonaws.com%2Fstyles%2F2_3_medium_thumbnail%2Fpublic%2F2022-04%2FJulianne%2520Flynn%2520VA%2520Headshot%2520Jan%25202021.jpg')
    expect(screen.getByTestId('pp-teaser-name')).toHaveTextContent('Julianne Flynn')
    expect(screen.getByTestId('pp-teaser-desc')).toHaveTextContent('Executive Director')
    expect(screen.getByTestId('pp-teaser-office')).toHaveTextContent('VA South Texas health care')
    expect(screen.getByTestId('pp-teaser-email')).toHaveTextContent('Email:')
    expect(screen.container.innerHTML).toContain('text=\"julianne-flynn@sample.com\"')
  })
})
