import React from 'react'
import {buttonVariants} from './button.variants.ts'

type Props = {
  className?: string
  size: 'big' | 'small'
  shape: 'solid' | 'outline'
  children?: React.ReactNode
  some: string
  shit: 'one' | 'three'
}

function Button({className, size, shape, children, some, shit, ...props}: Props) {
  return (
    <div {...props} className={buttonVariants({className, size, shape})}>
      {children}
    </div>
  )
}

export {Button}
export type {Props as ButtonProps}
