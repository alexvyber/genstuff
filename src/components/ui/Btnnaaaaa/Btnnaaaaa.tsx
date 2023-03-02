import { forwardRef } from "react"
import { cvax, VariantProps } from "cvax"

const btnnaaaaaConfig = {
  variants: { intent: { primary: "", secondary: "" }, size: { small: "", big: "" } },

  defaultVariants: {},
} as const

const btnnaaaaaVariants = cvax("", btnnaaaaaConfig)

type Props = VariantProps<typeof btnnaaaaaVariants> & {
  laoding?: boolean
  some?: string | undefined
}

const Btnnaaaaa = forwardRef<HTMLDivElement, Props>(
  ({ laoding, some = "asdfasdfasdfsadf", intent, size, ...props }, ref) => {
    return <div ref={ref} className={btnnaaaaaVariants({ intent, size })} {...props} />
  },
)

export { Btnnaaaaa, Props as BtnnaaaaaProps }
