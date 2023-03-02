import React from "react"
import { Btnnaaa } from "./Btnnaaa"

import type { Story } from "@ladle/react"
import type { BtnnaaaProps as Props } from "./Btnnaaa"

export default {
  title: "Btnnaaa/Default",
}

export const Default: Story<Props> = args => <Btnnaaa {...args} />
Default.args = { laoding: 87, some: 85, more: "unknown", lol: "unknown" } satisfies Props

Default.argTypes = {}
