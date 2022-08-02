import Wysiwyg from '@/components/wysiwyg'
import { ParagraphRichTextCharLimit1000 } from '@/types/paragraph'

interface WysiwygProps {
  field_wysiwyg: ParagraphRichTextCharLimit1000
  id: number
  className?: string
}

function RichTextCharLimit1000(
  wysiwygDataService: WysiwygProps,
  className: string
): JSX.Element {
  return (
    <Wysiwyg
      id={wysiwygDataService.id}
      html={wysiwygDataService.field_wysiwyg.processed}
      className={className}
    />
  )
}

export default RichTextCharLimit1000
