import { forwardRef } from "react"
import { cvax, VariantProps } from "cvax"

const btnnaaaaConfig = {
  variants: { intent: { primary: "", secondary: "" }, size: { small: "", big: "" } },

  defaultVariants: {},
} as const

const btnnaaaaVariants = cvax("", btnnaaaaConfig)

type Props = VariantProps<typeof btnnaaaaVariants> & {
  laoding?: boolean
  some?: string | undefined
}

const Btnnaaaa = forwardRef<HTMLDivElement, Props>(
  ({ laoding, some = "asdfasdfasdfsadf", intent, size, ...props }, ref) => {
    return <div ref={ref} className={btnnaaaaVariants({ intent, size })} {...props} />
  },
)

export { Btnnaaaa, Props as BtnnaaaaProps }
