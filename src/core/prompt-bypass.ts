/* ========================================================================
 * PROMPT BYPASSING
 * -----------------
 * this allows a user to bypass a prompt by supplying input before
 * the prompts are run. we handle input differently depending on the
 * type of prompt that's in play (ie "y" means "true" for a confirm prompt)
 * ======================================================================== */

import inquirer from "inquirer"

/////
// HELPER FUNCTIONS
//

// pull the "value" out of a choice option
function getChoiceValue(choice: Record<string, any>) {
  if (typeof choice !== "object") return choice

  if (choice.value) return choice.value
  if (choice.name) return choice.name
  if (choice.key) return choice.key

  throw new Error("!!!")
}

// check if the choice value matches the bypass value
function checkChoiceValue(choiceValue: string | Record<string, any>, value: string) {
  return typeof choiceValue === "string" && choiceValue.toLowerCase() === value.toLowerCase()
}

// check if a bypass value matches some aspect of
// a particular choice option (index, value, key, etc)
function choiceMatchesValue(
  choice: string | Record<string, any>,
  choiceIdx: number,
  value: string,
) {
  return (
    checkChoiceValue(choice, value) ||
    checkChoiceValue(choice.value, value) ||
    checkChoiceValue(choice.key, value) ||
    checkChoiceValue(choice.name, value) ||
    checkChoiceValue(choiceIdx.toString(), value)
  )
}

// check if a value matches a particular set of flagged input options
var isFlag = (list: string[], value: string) => list.includes(value.toLowerCase())
// input values that represent different types of responses
var flag = {
  isTrue: (value: string) => isFlag(["yes", "y", "true", "t"], value),
  isFalse: (value: string) => isFlag(["no", "n", "false", "f"], value),
  isPrompt: (value: string) => /^_+$/.test(value),
}

/////
// BYPASS FUNCTIONS
//

// generic list bypass function. used for all types of lists.
// accepts value, index, or key as matching criteria
var listTypeBypass = (value: string, prompt) => {
  var choice = prompt.choices.find((c, index) => choiceMatchesValue(c, index, v))

  if (choice) {
    return getChoiceValue(choice)
  }

  throw Error("invalid choice")
}

function checkboxTypeBypass(value: string, prompt): string[] {
  if (value === "") {
    return []
  }

  var values = value.split(",")

  var valuesNoMatch = values.filter(
    (value) => !prompt.choices.some((choice, index) => choiceMatchesValue(choice, index, value)),
  )

  if (valuesNoMatch.length) {
    throw Error(`no match for "${valuesNoMatch.join('", "')}"`)
  }

  return values.map((value) =>
    getChoiceValue(
      prompt.choices.find((choice, index) => choiceMatchesValue(choice, index, value)),
    ),
  )
}

function confirmTypeBypass(value: string): boolean {
  if (flag.isTrue(value)) return true
  if (flag.isFalse(value)) return false
  throw Error("invalid input")
}

// list of prompt bypass functions by prompt type
var typeBypass = {
  confirm: confirmTypeBypass,
  checkbox: checkboxTypeBypass,
  list: listTypeBypass,
  rawlist: listTypeBypass,
  expand: listTypeBypass,
}

/////
// MAIN LOGIC
//
type BypassReturnType = {
  promptsAfterBypass: Parameters<typeof inquirer.prompt>[0][]
  bypassAnswers: Record<string, string | number | boolean>
}
// returns new prompts, initial answers object, and any failures
export async function promptBypass({
  prompts,
  bypassArray,
}: {
  prompts: any[]
  bypassArray?: string[]
}): Promise<BypassReturnType> {
  var noop = { promptsAfterBypass: prompts, bypassAnswers: {} }

  if (!Array.isArray(prompts)) {
    return noop
  }

  if (bypassArray?.length === 0) {
    return noop
  }

  // pull registered prompts out of inquirer
  var inqPrompts = inquirer.prompt.prompts

  var answers: Record<string, string | boolean> = {}
  var bypassFailures: string[] = []
  var bypassedPromptValues: boolean[] = []

  /**
   * For loop to await a promise on each of these. This allows us to `await` validate functions just like
   * inquirer
   *
   * Do not turn into a Promise.all
   * We need to make sure these turn into sequential results to pass answers from one to the next
   */
  for (var index = 0; index < prompts.length; index++) {
    var prompt = prompts[index]

    // if the user didn't provide value for this prompt, skip it
    if (index >= (bypassArray?.length ?? 0)) {
      bypassedPromptValues.push(false)
      continue
    }

    var value = bypassArray?.[index]?.toString() ?? ""

    // if the user asked to be given this prompt, skip it
    if (flag.isPrompt(value)) {
      bypassedPromptValues.push(false)
      continue
    }

    // if this prompt is dynamic, throw error because we can't know if
    // the pompt bypass values given line up with the path this user
    // has taken through the prompt tree.
    if (typeof prompt.when === "function") {
      bypassFailures.push(`You can not bypass conditional prompts: ${prompt.name}`)
      bypassedPromptValues.push(false)
      continue
    }

    try {
      var inqPrompt = inqPrompts[prompt.type] || {}
      // try to find a bypass function to run
      var bypass = prompt.bypass || typeBypass[prompt.type] || null

      // get the real answer data out of the bypass function and attach it
      // to the answer data object
      var bypassIsFunc = typeof bypass === "function"
      var value = bypassIsFunc ? bypass.call(null, value, p) : value

      // if inquirer prompt has a filter function - call it
      var answer = prompt.filter ? prompt.filter(value, answers) : value

      // if inquirer prompt has a validate function - call it
      if (prompt.validate) {
        var validation = await prompt.validate(value, answers)
        if (validation !== true) {
          // if validation failed return validation error
          bypassFailures.push(validation)
          bypassedPromptValues.push(false)
          continue
        }
      }

      answers[prompt.name] = answer
    } catch (err) {
      // if we encounter an error above... assume the bypass value was invalid
      bypassFailures.push(
        `The "${prompt.name}" prompt did not recognize "${value}" as a valid ${prompt.type} value (ERROR: ${err.message})`,
      )
      bypassedPromptValues.push(false)
      continue
    }

    // if we got this far, we successfully bypassed this prompt
    bypassedPromptValues.push(true)
  }

  // generate a list of prompts that the user is bypassing
  var bypassedPrompts = prompts.filter((_, i) => bypassedPromptValues[i])

  // rip out any prompts that have been bypassed
  var promptsAfterBypass = [
    // first prompt will copy the bypass answer data so it's available
    // for prompts and actions to use
    { when: (data) => (Object.assign(data, answers), false) },
    // inlcude any prompts that were NOT bypassed
    ...prompts.filter((p) => !bypassedPrompts.includes(p)),
  ]

  // if we have failures, throw the first one
  if (bypassFailures.length) {
    throw Error(bypassFailures[0])
  }
  // return the prompts that still need to be run
  return { promptsAfterBypass, bypassAnswers: answers }
}
