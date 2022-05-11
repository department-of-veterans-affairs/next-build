import { v4 as uuidv4 } from 'uuid'
import Link from 'next/link'

const Button = ({ paragraph }): JSX.Element => {
  if (!paragraph) return

  const {
    field_button_label: fieldButtonLabel,
    field_button_link: fieldButtonLink,
  } = paragraph

  return (
    <div key={uuidv4()}>
      <Link href={fieldButtonLink ? fieldButtonLink.uri : ''} passHref>
        <a className="vads-c-action-link--blue">
          {fieldButtonLabel ? fieldButtonLabel : ''}
        </a>
      </Link>
    </div>
  )
}

export default Button
