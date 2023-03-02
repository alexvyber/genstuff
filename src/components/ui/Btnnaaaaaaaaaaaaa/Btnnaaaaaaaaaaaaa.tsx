import { forwardRef } from 'react'
      import { cvax, VariantProps } from "cvax"


    
    
    const btnnaaaaaaaaaaaaaConfig = {
      variants: {"intent":{"primary":"","secondary":""},"size":{"small":"","big":""}},
  
      defaultVariants: {}
    } as const
    
    const btnnaaaaaaaaaaaaaVariants = cvax("",btnnaaaaaaaaaaaaaConfig)
    

    
      type Props = VariantProps<typeof btnnaaaaaaaaaaaaaVariants> & {
        laoding?: boolean
some?: string|undefined
        more:unknown
lol:unknown
asdf:unknown
      }
      

    const Btnnaaaaaaaaaaaaa = forwardRef<HTMLDivElement, Props>(
    ({ laoding,some='asdfasdfasdfsadf',,more,lol,asdf,intent,size , ...props }, ref) => {
      return(
        <div
        ref={ref}
        className={btnnaaaaaaaaaaaaaVariants({ intent,size })}
         {...props} />
        )
      })

export { Btnnaaaaaaaaaaaaa, Props as BtnnaaaaaaaaaaaaaProps }