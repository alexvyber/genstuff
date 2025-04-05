import { buildCofing, GenstuffConfig } from "./types"

const config = buildCofing({
  generators: [
    {
      name: "component",
      description: "this is a test",
      prompts: {
        prompts: [
          {
            type: "input",
            name: "name",
            message: "What is your name?",
            parse: (value) => ({ some: "asd" }),
          },

          {
            name: "asdfasdf",
            type: "asdfasdf",
            message: "asdfasdfasdf",
          },
        ],

        validation: (answers) => ({ some: "adsfadsf" }),
      },

      actions: ({ answers }) => [
        `this is a comment`,
        "this is another comment",

        {
          type: "add",
          path: "folder/{{dashCase name}}.txt",
          templateFile: "templates/temp.txt",
          abortOnFail: true,
        },

        function customAction({ context, genstuff }) {},
      ],
    },
  ],
})

export default config
