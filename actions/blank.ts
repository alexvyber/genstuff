import type { Action } from "../types.ts"

export const blank1: Action = () => {
  console.log( "blank1:", "1" )

  return function execute( _params ) {
    console.log( "blank1:", "2" )

    return function action() {
      console.log( "blank1:", "3" )
    }
  }
}

export const blank2: Action = () => {
  console.log( "blank2:", 1 )

  return function execute( _params ) {
    console.log( "blank2:", 2 )

    return [
      function action() {
        console.log( "blank2:", 3 )
      },

      function action() {
        console.log( "blank2:", 4 )
        return [
          () => console.log( "blank2:", 4, 1 ),
          () => console.log( "blank2:", 4, 2 ),
          () => console.log( "blank2:", 4, 3 ),
        ]
      },
    ]
  }
}

export const blank3: Action = () => {
  console.log( "blank3:", 1 )

  return function execute( _params ) {
    console.log( "blank3:", 2 )
  }
}

export function blankRecursive( depth = 10 ): Action {
  return () =>
    Math.random() > 0.5 ? recursive( depth ) : [
      recursive( depth ),
    ]
}

function recursive( depth: number ): Action {
  if ( depth > 0 ) {
    return () => {
      console.log( depth )
      return [ blank1, blank2, blank3, recursive( depth - 1 ) ]
    }
  }

  return () => console.log( 0 )
}
