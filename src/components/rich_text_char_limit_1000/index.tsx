import Wysiwyg from '@/components/wysiwyg'

export interface WysiwygProps {
  html: any
  id: number
  className?: string
}

export const RichTextCharLimit1000 = ({
  id,
  html,
  className,
}: WysiwygProps): JSX.Element => {
  return <Wysiwyg id={id} html={html} className={className} />
}
