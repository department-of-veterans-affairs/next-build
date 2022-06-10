import { drupalClient } from '@/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import Container from '@/components/container'
import { Paragraph } from '@/components/paragraph'
import { ParagraphEmailContact } from '@/types/paragraph'

interface EmailContactsPageProps {
  emailContacts: ParagraphEmailContact[]
}

const EmailContactsPage = ({ emailContacts }: EmailContactsPageProps) => {
  if (!emailContacts) emailContacts = []

  return (
    <>
      <Container className="container">
        {emailContacts.map((paragraphEmailContact) => (
          <Paragraph
            key={paragraphEmailContact.id}
            paragraph={paragraphEmailContact}
          />
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
    ParagraphEmailContact[]
  >('paragraph--email_contact', context, {
    params: params.getQueryObject(),
  })
  return {
    props: {
      emailContacts,
    },
  }
}
