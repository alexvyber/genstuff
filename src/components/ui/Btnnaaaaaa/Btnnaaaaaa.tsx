import { forwardRef } from "react"
import { cvax, VariantProps } from "cvax"

const btnnaaaaaaConfig = {
  variants: { intent: { primary: "", secondary: "" }, size: { small: "", big: "" } },

  defaultVariants: {},
} as const

const btnnaaaaaaVariants = cvax("", btnnaaaaaaConfig)

type Props = VariantProps<typeof btnnaaaaaaVariants> & {
  laoding?: boolean
  some?: string | undefined
}

const Btnnaaaaaa = forwardRef<HTMLDivElement, Props>(
  ({ laoding, some = "asdfasdfasdfsadf", intent, size, ...props }, ref) => {
    return <div ref={ref} className={btnnaaaaaaVariants({ intent, size })} {...props} />
  },
)

export { Btnnaaaaaa, Props as BtnnaaaaaaProps }
