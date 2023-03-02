import { forwardRef } from "react"
import { cvax, VariantProps } from "cvax"

const btnnaConfig = {
  variants: { intent: { primary: "", secondary: "" }, size: { small: "", big: "" } },

  defaultVariants: {},
} as const

const btnnaVariants = cvax("", btnnaConfig)

type Props = BtnnaProps<typeof btnnaVariants> & {
  laoding?: boolean
  some?: string | undefined
}

const Btnna = forwardRef<HTMLDivElement, BtnnaProps>(
  ({ laoding, some = "asdfasdfasdfsadf", intent, size }, ref) => {
    return <div ref={ref} className={btnnaVariants({ intent, size })} {...props} />
  },
)

export { Btnna, Props as BtnnaProps }
