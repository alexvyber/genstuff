import React from "react"
import { Btnnaaaa } from "./Btnnaaaa"

import type { Story } from "@ladle/react"
import type { BtnnaaaaProps as Props } from "./Btnnaaaa"

export default {
  title: "Btnnaaaa/Default",
}

export const Default: Story<Props> = args => <Btnnaaaa {...args} />
Default.args = { laoding: 34, some: 14, more: "unknown", lol: "unknown" } satisfies Props

Default.argTypes = {}
