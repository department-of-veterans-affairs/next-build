import { ReactNode } from 'react'

export type HeadingElement = {
  headingLevel: HeadingLevel
  slot?: string
  children: ReactNode
}

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
