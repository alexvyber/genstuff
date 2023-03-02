import React from "react"
import { Btnnaaaaaa } from "./Btnnaaaaaa"

import type { Story } from "@ladle/react"
import type { BtnnaaaaaaProps as Props } from "./Btnnaaaaaa"

export default {
  title: "Btnnaaaaaa/Default",
}

export const Default: Story<Props> = args => <Btnnaaaaaa {...args} />
Default.args = { laoding: 32, some: 3, more: "unknown", lol: "unknown" } satisfies Props

Default.argTypes = {}
