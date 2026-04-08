---
name: "Ermis Chat React UI Development Standards"
description: "Guidelines for developing UI components inside chat-demo and packages/ermis-chat-react."
---

# Ermis Chat React UI Development Standards

When modifying or adding components to the frontend (`examples/chat-demo` or `packages/ermis-chat-react`), adhere to these standards:

## Tech Stack & Architecture
- **React Hooks:** Prefer modern functional components using `useState`, `useEffect`, `useCallback`, and `useRef`. 
- **Context API:** Chat state is distributed via `<ChatProvider>`. Components inside the Chat hierarchy should leverage this provider rather than prop drilling.
- **Virtualization:** For long lists (like messages or channels), use virtualization (e.g. `VirtualMessageList`). **Performance is paramount.** Avoid lag by strictly memoizing expensive operations (`useMemo`, `React.memo`).

## Styling
- **Tailwind CSS:** The modern UI is built using Tailwind CSS. 
- **Aesthetics (CRITICAL):** High aesthetic quality is expected.
  - Utilize gradients, glassmorphism (`backdrop-blur`), and carefully curated palettes.
  - Implement smooth transitions and micro-animations for interactions.
  - Never use plain colors if a gradient or subtle border fits the premium vibe.
