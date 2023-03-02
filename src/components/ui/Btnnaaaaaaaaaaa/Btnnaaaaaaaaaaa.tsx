import { forwardRef } from 'react'
      import { cvax, VariantProps } from "cvax"


    
    
    const btnnaaaaaaaaaaaConfig = {
      variants: {"intent":{"primary":"","secondary":""},"size":{"small":"","big":""}},
  
      defaultVariants: {}
    } as const
    
    const btnnaaaaaaaaaaaVariants = cvax("",btnnaaaaaaaaaaaConfig)
    

    
      type Props = VariantProps<typeof btnnaaaaaaaaaaaVariants> & {
        laoding?: boolean
some?: string|undefinedmore:unknown
lol:unknown
asdf:unknown
      }
      

    const Btnnaaaaaaaaaaa = forwardRef<HTMLDivElement, Props>(
    ({ laoding,some='asdfasdfasdfsadf',intent,size , ...props }, ref) => {
      return(
        <div
        ref={ref}
        className={btnnaaaaaaaaaaaVariants({ intent,size })}
         {...props} />
        )
      })

export { Btnnaaaaaaaaaaa, Props as BtnnaaaaaaaaaaaProps }