import { v4 as uuidv4 } from 'uuid'
import { drupalClient } from '@/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalNode } from 'next-drupal'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import Container from '@/components/container'
import EmailContact from '@/components/paragraph/email_contact'

interface EmailContactsPageProps {
  emailContacts: DrupalNode[]
}

const EmailContactsPage = ({ emailContacts }: EmailContactsPageProps) => {
  if (!emailContacts) emailContacts = []

  return (
    <>
      <Container className="container">
        {emailContacts.map((paragraph) => (
          <EmailContact key={uuidv4()} paragraph={paragraph} />
        ))}
      </Container>
    </>
  )
}

export default EmailContactsPage

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<EmailContactsPageProps>> {
  const params = new DrupalJsonApiParams()
  params.addPageLimit(30)

  const emailContacts = await drupalClient.getResourceCollectionFromContext<
    DrupalNode[]
  >('paragraph--email_contact', context, {
    params: params.getQueryObject(),
  })
  return {
    props: {
      emailContacts: emailContacts || null,
    },
  }
}
