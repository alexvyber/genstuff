import React from "react"
import { Asdfaa } from "."

import type { Story } from "@ladle/react"
import type { AsdfaaProps as Props } from "./Asdfaa"

export default {
  title: "Asdfaa/Default",
}

export const Default: Story<Props> = args => <Asdfaa {...args} />
Default.args = { laoding: 34, some: 63 } satisfies Props

Default.argTypes = {}
