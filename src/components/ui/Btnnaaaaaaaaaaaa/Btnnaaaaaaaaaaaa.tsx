import { forwardRef } from "react"
import { cvax, VariantProps } from "cvax"

const btnnaaaaaaaaaaaaConfig = {
  variants: { intent: { primary: "", secondary: "" }, size: { small: "", big: "" } },

  defaultVariants: {},
} as const

const btnnaaaaaaaaaaaaVariants = cvax("", btnnaaaaaaaaaaaaConfig)

type Props = VariantProps<typeof btnnaaaaaaaaaaaaVariants> & {
  laoding?: boolean
  some?: string | undefined
  more: unknown
  lol: unknown
  asdf: unknown
}

const Btnnaaaaaaaaaaaa = forwardRef<HTMLDivElement, Props>(
  ({ laoding, some = "asdfasdfasdfsadf", intent, size, ...props }, ref) => {
    return <div ref={ref} className={btnnaaaaaaaaaaaaVariants({ intent, size })} {...props} />
  },
)

export { Btnnaaaaaaaaaaaa, Props as BtnnaaaaaaaaaaaaProps }
