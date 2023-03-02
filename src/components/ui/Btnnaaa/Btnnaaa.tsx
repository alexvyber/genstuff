import { forwardRef } from "react"
import { cvax, VariantProps } from "cvax"

const btnnaaaConfig = {
  variants: { intent: { primary: "", secondary: "" }, size: { small: "", big: "" } },

  defaultVariants: {},
} as const

const btnnaaaVariants = cvax("", btnnaaaConfig)

type BtnnaaaProps = VariantProps<typeof btnnaaaVariants> & {
  laoding?: boolean
  some?: string | undefined
}

const Btnnaaa = forwardRef<HTMLDivElement, BtnnaaaProps>(
  ({ laoding, some = "asdfasdfasdfsadf", intent, size, ...props }, ref) => {
    return <div ref={ref} className={btnnaaaVariants({ intent, size })} {...props} />
  },
)

export { Btnnaaa, Props as BtnnaaaProps }
