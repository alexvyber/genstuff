import type { Action } from "../types.ts"
import * as v from "valibot"

const primitiveSchema = v.union( [ v.pipe( v.string(), v.minLength( 1 ) ), v.boolean(), v.number() ] )

const defaultSchema = v.record(
  v.string(),
  v.union( [ primitiveSchema, v.array( primitiveSchema ) ] ),
)

export function validateAnswers<Schema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(
  schema?: Schema,
): Action {
  return function execute( params ) {
    v.assert( schema ?? defaultSchema, params.context.answers )
  }
}
