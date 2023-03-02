import { forwardRef } from "react"
import { cvax, VariantProps } from "cvax"

const btnnaaaaaaaaaaConfig = {
  variants: { intent: { primary: "", secondary: "" }, size: { small: "", big: "" } },

  defaultVariants: {},
} as const

const btnnaaaaaaaaaaVariants = cvax("", btnnaaaaaaaaaaConfig)

type Props = VariantProps<typeof btnnaaaaaaaaaaVariants> & {
  laoding?: boolean
  some?: string | undefined
}

const Btnnaaaaaaaaaa = forwardRef<HTMLDivElement, Props>(
  ({ laoding, some = "asdfasdfasdfsadf", intent, size, ...props }, ref) => {
    return <div ref={ref} className={btnnaaaaaaaaaaVariants({ intent, size })} {...props} />
  },
)

export { Btnnaaaaaaaaaa, Props as BtnnaaaaaaaaaaProps }
