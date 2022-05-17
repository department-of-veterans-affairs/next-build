import Link from 'next/link'

interface ButtonProps {
  paragraph: object
  field_button_label: string
  field_button_link: {
    uri: string
  }
}

function isRequestValid(paragraph: ButtonProps) {
  return paragraph?.field_button_label && paragraph?.field_button_link?.uri
}

const Button = ({ paragraph }): JSX.Element => {
  if (!paragraph || !isRequestValid(paragraph)) return

  return (
    <div key={paragraph.id}>
      <Link href={paragraph.field_button_link?.uri} passHref>
        <a className="vads-c-action-link--blue">
          {paragraph.field_button_label}
        </a>
      </Link>
    </div>
  )
}

export default Button
