import { forwardRef } from "react"
import { cvax, VariantProps } from "cvax"

const btnnaaConfig = {
  variants: { intent: { primary: "", secondary: "" }, size: { small: "", big: "" } },

  defaultVariants: {},
} as const

const btnnaaVariants = cvax("", btnnaaConfig)

type BtnnaaProps = VariantProps<typeof btnnaaVariants> & {
  laoding?: boolean
  some?: string | undefined
}

const Btnnaa = forwardRef<HTMLDivElement, BtnnaaProps>(
  ({ laoding, some = "asdfasdfasdfsadf", intent, size }, ref) => {
    return <div ref={ref} className={btnnaaVariants({ intent, size })} {...props} />
  },
)

export { Btnnaa, Props as BtnnaaProps }
