import { ProcessList as FormattedProcessList } from '@/components/processList/formatted-type'

export function ProcessList({ steps, entityId }: FormattedProcessList) {
  if (!steps) return
  return (
    <div
      data-template="paragraphs/process"
      data-entity-id={entityId}
      className="process schemaform-process"
    >
      <va-process-list>
        {steps.map((step, index) => (
          <va-process-list-item
            key={index}
            dangerouslySetInnerHTML={{ __html: step.html }}
          ></va-process-list-item>
        ))}
      </va-process-list>
    </div>
  )
}
