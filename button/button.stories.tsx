import React from 'react'
import type {StoryDefault, Story} from '@ladle/react'
import {Button, ButtonProps} from './button.tsx'

export default {
  title: 'Button',
  meta: {
    key: 'value',
  },
} satisfies StoryDefault

export const ButtonSize: Story<ButtonProps> = (props) => {
  return (
    <>
      <Button {...props} size={'big'} />
      <Button {...props} size={'small'} />
    </>
  )
}
ButtonSize.args = {
  className: 'string',
  size: undefined,
  shape: undefined,
  children: 'ButtonSize',
  some: 'string',
  shit: undefined,
}

export const ButtonShape: Story<ButtonProps> = (props) => {
  return (
    <>
      <Button {...props} shape={'solid'} />
      <Button {...props} shape={'outline'} />
    </>
  )
}
ButtonShape.args = {
  className: 'string',
  size: undefined,
  shape: undefined,
  children: 'ButtonShape',
  some: 'string',
  shit: undefined,
}
