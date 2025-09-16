// import type { Ora } from "ora"
// import type {
//   GenstuffActionHooks,
//   GenstuffActionHooksChanges,
//   GenstuffActionHooksFailures,
// } from "../types/hooks.types.ts"
// import { typeMap } from "./utils.ts"

// class Hooks implements GenstuffActionHooks {
//   constructor(private spinner?: Ora) {}

//   onComment(msg: string) {
//     this.spinner?.info(msg)
//     this.spinner?.start()
//   }

//   onSuccess(change: GenstuffActionHooksChanges) {
//     let line = ""

//     if (change.type) {
//       line += ` ${typeMap(change.type)}`
//     }

//     if (change.path) {
//       line += ` ${change.path}`
//     }

//     this.spinner?.succeed(line)
//     this.spinner?.start()
//   }

//   onFailure(failure: GenstuffActionHooksFailures) {
//     let line = ""

//     if (failure.type) {
//       line += ` ${typeMap(failure.type)}`
//     }

//     if (failure.path) {
//       line += ` ${failure.path}`
//     }

//     const errorMessage = failure.error || failure.message

//     if (errorMessage) {
//       line += ` ${errorMessage}`
//     }

//     this.spinner?.fail(line)
//     this.spinner?.start()
//   }
// }

// export { Hooks }
