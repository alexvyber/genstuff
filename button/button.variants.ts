import {cvax, VariantProps} from 'cvax'

const buttonVariants = cvax({
  base: '',
  variants: {
    size: {big: '', small: ''},
    shape: {solid: '', outline: ''},
  },
})

type ButtonProps = VariantProps<typeof buttonVariants>

export {buttonVariants}
