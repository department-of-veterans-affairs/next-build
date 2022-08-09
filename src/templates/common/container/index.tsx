import clsx from 'clsx'

interface ContainerProps {
  className?: string
  children?: React.ReactNode
}

const Container = ({ className, children }: ContainerProps) => {
  return <div className={clsx(className)}>{children}</div>
}

export default Container
