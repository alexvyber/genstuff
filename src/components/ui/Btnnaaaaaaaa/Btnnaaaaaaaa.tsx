import { forwardRef } from "react"
import { cvax, VariantProps } from "cvax"

const btnnaaaaaaaaConfig = {
  variants: { intent: { primary: "", secondary: "" }, size: { small: "", big: "" } },

  defaultVariants: {},
} as const

const btnnaaaaaaaaVariants = cvax("", btnnaaaaaaaaConfig)

type Props = VariantProps<typeof btnnaaaaaaaaVariants> & {
  laoding?: boolean
  some?: string | undefined
}

const Btnnaaaaaaaa = forwardRef<HTMLDivElement, Props>(
  ({ laoding, some = "asdfasdfasdfsadf", intent, size, ...props }, ref) => {
    return <div ref={ref} className={btnnaaaaaaaaVariants({ intent, size })} {...props} />
  },
)

export { Btnnaaaaaaaa, Props as BtnnaaaaaaaaProps }
