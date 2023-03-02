import { forwardRef } from "react"
import { cvax, VariantProps } from "cvax"

const btnnaaaaaaaaaaaaaaaConfig = {
  variants: { intent: { primary: "", secondary: "" }, size: { small: "", big: "" } },

  defaultVariants: {},
} as const

const btnnaaaaaaaaaaaaaaaVariants = cvax("", btnnaaaaaaaaaaaaaaaConfig)

type Props = VariantProps<typeof btnnaaaaaaaaaaaaaaaVariants> & {
  laoding?: boolean
  some?: string | undefined
  more: unknown
  lol: unknown
  asdf: unknown
}

const Btnnaaaaaaaaaaaaaaa = forwardRef<HTMLDivElement, Props>(
  ({ laoding, some = "asdfasdfasdfsadf", more, lol, asdf, intent, size, ...props }, ref) => {
    return <div ref={ref} className={btnnaaaaaaaaaaaaaaaVariants({ intent, size })} {...props} />
  },
)

export { Btnnaaaaaaaaaaaaaaa, Props as BtnnaaaaaaaaaaaaaaaProps }
