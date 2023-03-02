import React from "react"
import { Btn } from "./Btn"

import type { Story } from "@ladle/react"
import type { BtnProps as Props } from "./Btn"

export default {
  title: "Btn/Default",
}

export const Default: Story<Props> = args => <Btn {...args} />
Default.args = { laoding: 6, some: 51, more: "unknown", lol: "unknown" } satisfies Props

Default.argTypes = {}
