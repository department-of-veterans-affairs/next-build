type ChecklistProps = {
  title: string
}

export function Checklist({ title }: ChecklistProps) {
  return (
    <div>
      <p>{title}</p>
    </div>
  )
}
