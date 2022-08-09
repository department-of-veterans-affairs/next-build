import { Wysiwyg } from 'templates/components/wysiwyg'

export interface RichTextCharLimit1000Props {
  id: string
  html: any
  className?: string
}

export const RichTextCharLimit1000 = ({
  id,
  html,
  className,
}: RichTextCharLimit1000Props): JSX.Element => {
  return <Wysiwyg id={id} html={html} className={className} />
}
