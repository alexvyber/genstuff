import { forwardRef } from 'react'
      import { cvax, VariantProps } from "cvax"

laoding?: boolean,some?: string|undefined


    
    
    const btnConfig = {
      variants: {"intent":{"primary":"","secondary":""},"size":{"small":"","big":""}},
  
      defaultVariants: {}
    } as const
    
    const btnVariants = cvax("",btnConfig)
    

    const Btn = forwardRef<HTMLDivElement, BtnProps>(
    ({ laoding,some='asdfasdfasdfsadf',intent,size }, ref) => {
      return(
        <div
        ref={ref}
        className={btnVariants({ intent,size })}
         {...props} />
        )
      })

export { Btn, Props as BtnProps }