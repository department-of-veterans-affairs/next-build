import Link from 'next/link'
import validator from 'validator'
import { isEmpty, isNull } from 'lodash'

export type ButtonProps = {
  id: string
  label: string
  url: string
}

function isRequestInvalid(button) {
  return (
    isEmpty(button.label) ||
    (isEmpty(button.url) &&
      (!isNull(button.url) ?? validator.isURL(button.url)))
  )
}

export function Button(button: ButtonProps) {
  if (isRequestInvalid(button)) return

  return (
    <div key={button.id}>
      <Link href={button.url} passHref>
        <a className="vads-c-action-link--blue">{button.label}</a>
      </Link>
    </div>
  )
}
