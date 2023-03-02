import { forwardRef } from "react"
import { cvax, VariantProps } from "cvax"

const btnnaaaaaaaaaaaaaaaaConfig = {
  variants: { intent: { primary: "", secondary: "" }, size: { small: "", big: "" } },

  defaultVariants: {},
} as const

const btnnaaaaaaaaaaaaaaaaVariants = cvax("", btnnaaaaaaaaaaaaaaaaConfig)

type Props = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof btnnaaaaaaaaaaaaaaaaVariants> & {
    laoding?: boolean
    some?: string | undefined
    more: unknown
    lol: unknown
    asdf: unknown
  }

const Btnnaaaaaaaaaaaaaaaa = forwardRef<HTMLDivElement, Props>(
  ({ laoding, some = "asdfasdfasdfsadf", more, lol, asdf, intent, size, ...props }, ref) => {
    return <div ref={ref} className={btnnaaaaaaaaaaaaaaaaVariants({ intent, size })} {...props} />
  },
)

export { Btnnaaaaaaaaaaaaaaaa, Props as BtnnaaaaaaaaaaaaaaaaProps }
