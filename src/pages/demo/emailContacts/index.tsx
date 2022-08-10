import { drupalClient } from '@/lib/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import Container from '@/templates/common/container'
import { ParagraphEmailContact, ParagraphResourceType } from '@/types/data-types/drupal/paragraph'
import { generalEntityDataService } from '@/data/delegators/generalEntityDataService'
import { EmailContact } from '@/templates/components/email_contact'

interface EmailContactsPageProps {
  emailContactsProps: any
}

const EmailContactsPage = ({ emailContactsProps }: EmailContactsPageProps) => {
  if (!emailContactsProps) emailContactsProps = []

  return (
    <>
      <Container className="container">
        {emailContactsProps.map((emailContact) => (
          <EmailContact key={emailContact.id} {...emailContact} />
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

  const emailContactsCollection =
    await drupalClient.getResourceCollectionFromContext<
      ParagraphEmailContact[]
    >(ParagraphResourceType.EmailContact, context, {
      params: params.getQueryObject(),
    })

  const emailContactsProps = generalEntityDataService(emailContactsCollection)

  return {
    props: {
      emailContactsProps,
    },
  }
}
