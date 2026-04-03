---
sidebar_position: 3
---

# Hooks

Instead of using the default UI components exclusively, you can utilize our built-in React Hooks to retrieve context data or build a fully bespoke, headless UI. 

## Context Hooks

These hooks are designed to extract data passed down by `ChatProvider` or `Channel` components.

### `useChatClient()`
Retrieves the initialized `ErmisChat` client instance and global application state (like `theme`, active channel management functions, read state mappings).

```tsx
import { useChatClient } from '@ermis-network/ermis-chat-react';

const { client, activeChannel, theme, setActiveChannel } = useChatClient();
```

### `useChannel()`
Retrieves the currently connected/active channel context injected by `<Channel />` and its hydration status (`loading`, `error`).

```tsx
import { useChannel } from '@ermis-network/ermis-chat-react';

const { channel, loading, error } = useChannel();
```

---

## Utility & Feature Hooks

These hooks encapsulate complex real-time behavior (like typing indicators, mentions, infinite scrolling) so you don't have to implement them from scratch.

### `useChannelListUpdates(channels, setChannels)`
Automatically subscribes to real-time events (`message.new`, `message.read`) to keep your custom channel list reordered and unread-badged in real-time.

```tsx
import { useChannelListUpdates } from '@ermis-network/ermis-chat-react';

const [channels, setChannels] = useState([]);
// Keeps `channels` sorted with latest messages arriving.
useChannelListUpdates(channels, setChannels);
```

### `useChannelMessages(options)`
Handles fetching and subscribing to the realtime message array inside a specific channel, ensuring proper deduplication and reaction state updates.

```tsx
import { useChannelMessages } from '@ermis-network/ermis-chat-react';

const messages = useChannelMessages({ channel });
```

### `useTypingIndicator(channelId)`
Listens for `typing.start` and `typing.stop` socket events. Returns an array of users who are currently typing in the specified channel.

```tsx
import { useTypingIndicator } from '@ermis-network/ermis-chat-react';

const typingUsers = useTypingIndicator(channel.id);
if (typingUsers.length > 0) {
    console.log(`${typingUsers[0].name} is typing...`);
}
```

### `useLoadMessages(options)`
Manages infinite scroll pagination routines (loading more historical older messages when a user scrolls up).

```tsx
import { useLoadMessages } from '@ermis-network/ermis-chat-react';

const { loadMore, hasMore, loadingMore } = useLoadMessages({ 
  channel, 
  messages, 
  limit: 25 
});
```

### `useMentions(options)`
Generates suggestions for `@mentioning` users tracking DOM coordinates and cursor placement indices accurately.

```tsx
import { useMentions } from '@ermis-network/ermis-chat-react';

const { showSuggestions, filteredMembers, selectMention, handleInput } = useMentions({
  members: channelMembers,
  editableRef: contentEditableRef
});
```

### `useScrollToMessage(options)`
A scroll logic hook that navigates a virtualized or scrolling list interface exactly to the coordinates of a designated message ID wrapper (vital for quoting/reply jumping features).

### `useMessageActions(message, isOwnMessage)`
Yields an array of applicable action button definitions (like "Delete", "Copy", "Pin", "Reply") according to the internal active user roles, permissions, and message ownership.
