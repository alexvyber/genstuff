import React from "react"
import { Btnna } from "./Btnna"

import type { Story } from "@ladle/react"
import type { BtnnaProps as Props } from "./Btnna"

export default {
  title: "Btnna/Default",
}

export const Default: Story<Props> = args => <Btnna {...args} />
Default.args = { laoding: 73, some: 72, more: "unknown", lol: "unknown" } satisfies Props

Default.argTypes = {}
