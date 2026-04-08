---
description: "How to setup, run, and test the Ermis chat demo application locally."
---

# Workflow: Setup and Run Demo

This is a mono-repository environment utilizing Yarn workspaces. Follow these steps.
// turbo-all

1. Ensure you are at the monorepo root.
```bash
cd /Users/nguyentuan/Documents/ermis/ermis-chat-monorepo
```

2. Install dependencies for all workspaces.
```bash
yarn install
```

3. Start the Demo App.
```bash
yarn workspace chat-demo dev
```
*(Alternatively, use `yarn dev` if a script is mapped at the root package.json)*
