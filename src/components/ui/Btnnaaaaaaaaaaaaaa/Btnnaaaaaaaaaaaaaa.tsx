import { forwardRef } from 'react'
      import { cvax, VariantProps } from "cvax"


    
    
    const btnnaaaaaaaaaaaaaaConfig = {
      variants: {"intent":{"primary":"","secondary":""},"size":{"small":"","big":""}},
  
      defaultVariants: {}
    } as const
    
    const btnnaaaaaaaaaaaaaaVariants = cvax("",btnnaaaaaaaaaaaaaaConfig)
    

    
      type Props = VariantProps<typeof btnnaaaaaaaaaaaaaaVariants> & {
        laoding?: boolean
some?: string|undefined
        more:unknown
lol:unknown
asdf:unknown
      }
      

    const Btnnaaaaaaaaaaaaaa = forwardRef<HTMLDivElement, Props>(
    ({ laoding,some='asdfasdfasdfsadf',,more,lol,asdf,intent,size , ...props }, ref) => {
      return(
        <div
        ref={ref}
        className={btnnaaaaaaaaaaaaaaVariants({ intent,size })}
         {...props} />
        )
      })

export { Btnnaaaaaaaaaaaaaa, Props as BtnnaaaaaaaaaaaaaaProps }