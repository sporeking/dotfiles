return {
  -- LazyVim's default blink-cmp-copilot source calls the old Copilot
  -- getCompletions API. blink-copilot talks to the Copilot LSP directly using
  -- the newer inline-completion protocol, avoiding streamChoices log spam.
  { "giuxtaposition/blink-cmp-copilot", enabled = false },
  {
    "saghen/blink.cmp",
    optional = true,
    dependencies = {
      {
        "fang2hou/blink-copilot",
        opts = {
          max_completions = 3,
          max_attempts = 4,
        },
      },
    },
    opts = {
      sources = {
        providers = {
          copilot = {
            name = "copilot",
            module = "blink-copilot",
            score_offset = 100,
            async = true,
          },
        },
      },
    },
  },
}
