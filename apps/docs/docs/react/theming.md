---
sidebar_position: 4
---

# Theming & Customization

Providing a bespoke aesthetic is incredibly straightforward with the React UI Kit. It is built natively with CSS variables (CSS Custom Properties) tracking a BEM-inspired methodology.

## Toggling Light/Dark Theme

The topmost component `<ChatProvider />` manages the active theme mode state. By default, it uses the `dark` theme but you can initialize it with the light mode or intercept updates.

```tsx
import { ChatProvider } from '@ermis-network/ermis-chat-react';

<ChatProvider client={chatClient} initialTheme="light">
   <div className="layout">
       {/* Other React UI Components */}
   </div>
</ChatProvider>
```

When you toggle the theme, the provider automatically injects the corresponding CSS modifier classes (`.ermis-chat--light` or `.ermis-chat--dark`) onto the outer provider wrapper logic so that child components inherit proper contrast.

## Customizing CSS Variables

The entire aesthetic (colors, typography, spacing, radii) relies on a structured dictionary of CSS variables available right out of the box. 
To customize the visual style completely, simply overwrite the exposed CSS variables in your own global CSS files.

Here is an example demonstrating customizing primary brand accent colors, window backgrounds, message bubbles, spacing radii, and typography metrics for your instance.

```css
/* Override global UI styles across everywhere in the Chat */
:root {
  /* Override the main primary interface background */
  --ermis-bg-primary: #ffffff;
  
  /* Primary brand interactive color */
  --ermis-accent: #ff4500;
  --ermis-accent-hover: #e03e00;

  /* Typography metrics */
  --ermis-font-family: 'Helvetica Neue', sans-serif;
  --ermis-font-size-base: 18px;

  /* Border radius global spacing */
  --ermis-radius-sm: 8px;
  --ermis-radius-lg: 16px;
}

/* Enforce styling conditionally just for Dark Mode context */
.ermis-chat--dark {
  --ermis-bg-primary: #121212;
  
  /* Customize the currently logged in user's sent Message Bubble */
  --ermis-bubble-own-bg: var(--ermis-accent);
  --ermis-bubble-own-text: #ffffff;
}

/* Target and manually augment BEM element classes if completely necessary */
.ermis-chat__message-bubble {
   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### Essential Design Tokens Map

These are the primary global CSS tracking tokens utilized across the majority of core components:

| Category | Available Custom CSS Variables |
| -------- | ------------------------------ |
| **Backgrounds** | `--ermis-bg-primary`, `--ermis-bg-secondary`, `--ermis-bg-hover`, `--ermis-bg-active` |
| **Brand Colors**| `--ermis-accent`, `--ermis-accent-hover`, `--ermis-border` |
| **Typography**  | `--ermis-text-primary`, `--ermis-text-secondary`, `--ermis-text-muted`, `--ermis-font-family` |
| **Chat Bubbles**| `--ermis-bubble-own-bg`, `--ermis-bubble-own-text`, `--ermis-bubble-other-bg`, `--ermis-bubble-other-text` |
| **Geometries**  | `--ermis-spacing-sm`, `--ermis-radius-md`, `--ermis-radius-full` |
| **Quoted Msg**  | `--ermis-quote-own-bg`, `--ermis-quote-other-bg`, `--ermis-quote-own-text` |

> **Pro Tip:** Avoid using `!important` inside your tailored classes unless you find severe specificity conflicts. Rely on standard cascade prioritization. All built-in styles map variables gracefully.
