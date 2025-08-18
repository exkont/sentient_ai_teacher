import type { ReactNode } from 'react'

type CardProps = {
  title?: string
  children: ReactNode
  className?: string
}

const Card = ({ title, children, className }: CardProps) => {
  return (
    <div className={`rounded-2xl border p-4 ${className ?? ''}`}>
      {title && <div className="mb-2 text-sm text-muted-foreground">{title}</div>}
      {children}
    </div>
  )
}

export default Card 