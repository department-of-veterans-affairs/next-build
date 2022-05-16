import Link from 'next/link'

function isRequestValid(paragraph: any) {
  return (
    paragraph.field_button_label !== null &&
    paragraph.field_button_link !== null &&
    paragraph.field_button_link?.uri !== null
  )
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
