import { forwardRef } from "react"
import { cvax, VariantProps } from "cvax"

const btnnaaaaaaaConfig = {
  variants: { intent: { primary: "", secondary: "" }, size: { small: "", big: "" } },

  defaultVariants: {},
} as const

const btnnaaaaaaaVariants = cvax("", btnnaaaaaaaConfig)

type Props = VariantProps<typeof btnnaaaaaaaVariants> & {
  laoding?: boolean
  some?: string | undefined
}

const Btnnaaaaaaa = forwardRef<HTMLDivElement, Props>(
  ({ laoding, some = "asdfasdfasdfsadf", intent, size, ...props }, ref) => {
    return <div ref={ref} className={btnnaaaaaaaVariants({ intent, size })} {...props} />
  },
)

export { Btnnaaaaaaa, Props as BtnnaaaaaaaProps }
