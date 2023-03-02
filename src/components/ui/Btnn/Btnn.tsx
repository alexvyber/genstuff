import { forwardRef } from 'react'
      import { cvax, VariantProps } from "cvax"

laoding?: boolean,some?: string|undefined


    
    
    const btnnConfig = {
      variants: {"intent":{"primary":"","secondary":""},"size":{"small":"","big":""}},
  
      defaultVariants: {}
    } as const
    
    const btnnVariants = cvax("",btnnConfig)
    

    
      type Props = BtnnProps<typeof btnnVariants> & {
        laoding?: boolean
some?: string|undefined
      }
      

    const Btnn = forwardRef<HTMLDivElement, BtnnProps>(
    ({ laoding,some='asdfasdfasdfsadf',intent,size }, ref) => {
      return(
        <div
        ref={ref}
        className={btnnVariants({ intent,size })}
         {...props} />
        )
      })

export { Btnn, Props as BtnnProps }