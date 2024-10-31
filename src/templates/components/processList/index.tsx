import { ProcessList as FormattedProcessList } from '@/types/formatted/processList'
import { numToWord } from '@/lib/utils/helpers'
export function ProcessList({ steps, entityId }: FormattedProcessList) {
  if (!steps) return
  return (
    <div data-entity-id={entityId} className="process schemaform-process">
      <ol>
        {steps &&
          steps.map((step, index) => (
            <li
              key={index}
              className={`process-step list-${numToWord(index + 1)}`}
              dangerouslySetInnerHTML={{ __html: step.html }}
            ></li>
          ))}
      </ol>
    </div>
  )
}
