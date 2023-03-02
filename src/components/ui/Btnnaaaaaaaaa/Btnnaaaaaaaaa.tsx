import { forwardRef } from "react"
import { cvax, VariantProps } from "cvax"

const btnnaaaaaaaaaConfig = {
  variants: { intent: { primary: "", secondary: "" }, size: { small: "", big: "" } },

  defaultVariants: {},
} as const

const btnnaaaaaaaaaVariants = cvax("", btnnaaaaaaaaaConfig)

type Props = VariantProps<typeof btnnaaaaaaaaaVariants> & {
  laoding?: boolean
  some?: string | undefined
}

const Btnnaaaaaaaaa = forwardRef<HTMLDivElement, Props>(
  ({ laoding, some = "asdfasdfasdfsadf", intent, size, ...props }, ref) => {
    return <div ref={ref} className={btnnaaaaaaaaaVariants({ intent, size })} {...props} />
  },
)

export { Btnnaaaaaaaaa, Props as BtnnaaaaaaaaaProps }
