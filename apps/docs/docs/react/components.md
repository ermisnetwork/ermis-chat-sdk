---
sidebar_position: 2
---

# Core Components

Ermis Chat React provides a set of highly customizable Core Components that handle state, UI rendering, and user interactions automatically. These components use React Context at the root level to pass necessary data down the tree.

## `<ChatProvider />`

The top-level provider for the chat application. It manages the global state (such as the client instance, current active channel, and theme) and passes it down to other components.

### Usage

```tsx
import { ChatProvider } from '@ermis-network/ermis-chat-react';

<ChatProvider client={chatClient} initialTheme="light">
  {/* Other UI Components */}
</ChatProvider>;
```

### Key Props

- **`client`** (`ErmisChat`): The initialized SDK client instance (**Required**).
- **`initialTheme`** (`'dark' | 'light'`): Optional initial matching theme (default is `'dark'`).

---

## `<ChannelList />`

Renders a list of available channels for the current user and handles channel switching.

### Props

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `filters` | `ChannelFilters` | Query filters to fetch specific channels. |
| `sort` | `ChannelSort` | Sorting configuration for the channel list. |
| `options` | `ChannelQueryOptions` | Additional query options. |
| `renderChannel` | `(channel: Channel, isActive: boolean) => React.ReactNode` | Custom render function for the channel root element. |
| `onChannelSelect` | `(channel: Channel) => void` | Callback triggered when a channel is clicked. |
| `className` | `string` | Custom CSS class applied to the root container. |
| `LoadingIndicator` | `React.ComponentType` | Custom loading component for initial fetching. |
| `EmptyStateIndicator` | `React.ComponentType` | Custom UI rendered when no channels match the query. |
| `AvatarComponent` | `React.ComponentType<AvatarProps>` | Override the default avatar rendering logic. |
| `ChannelItemComponent` | `React.ComponentType<ChannelItemProps>` | Fully replaces the default row UI for a channel. |

### Example

```tsx
import { ChannelList } from '@ermis-network/ermis-chat-react';

const CustomChannelItem = ({ channel, isActive, onSelect }) => (
  <div 
    onClick={() => onSelect(channel)}
    style={{ background: isActive ? 'blue' : 'white', padding: 8, cursor: 'pointer' }}
  >
    {channel.id}
  </div>
);

export const MyChannelList = () => (
  <ChannelList 
    filters={{ type: 'messaging' }}
    sort={[{ last_message_at: -1 }]}
    onChannelSelect={(channel) => console.log('Selected:', channel.id)}
    ChannelItemComponent={CustomChannelItem}
  />
);
```

---

## `<Channel />`

Establishes the active channel context. Any components inside `<Channel>` will read data and interact with that specific channel.

### Props

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `children` | `React.ReactNode` | The components that rely on the channel context (e.g., `VirtualMessageList`). |
| `className` | `string` | Custom CSS class for the container. |
| `EmptyStateIndicator` | `React.ComponentType` | Custom UI shown when `activeChannel` inside `ChatContext` is null. |
| `HeaderComponent` | `React.ComponentType<ChannelHeaderData>` | Overrides the default `ChannelHeader` completely. |
| `ForwardMessageModalComponent` | `React.ComponentType<ForwardMessageModalProps>` | Used to replace the default message forwarding modal. |

### Example

```tsx
import { Channel } from '@ermis-network/ermis-chat-react';

const CustomEmptyState = () => <div>Please select a channel to start chatting.</div>;

export const ChatArea = () => (
  <Channel 
    className="my-channel-container"
    EmptyStateIndicator={CustomEmptyState}
  >
    <div className="chat-layout">
      {/* Insert VirtualMessageList and MessageInput here */}
    </div>
  </Channel>
);
```

---

## `<VirtualMessageList />`

Displays the messages for the currently active channel. It dynamically handles attachments, read receipts, reactions, and infinite scrolling efficiently via a virtualized list wrapper.

### Props

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `renderMessage` | `Function` | Fully custom render function for each message row. |
| `className` | `string` | Custom CSS class for the list container. |
| `EmptyStateIndicator` | `React.ComponentType` | Custom UI shown when the channel has no messages. |
| `AvatarComponent` | `React.ComponentType<AvatarProps>` | Override avatar component across messages. |
| `MessageBubble` | `React.ComponentType<MessageBubbleProps>` | Custom wrapper component for the message chat bubble. |
| `messageRenderers` | `Record<MessageLabel, React.ComponentType>` | Override specific renderers based on the message type (e.g. `system`, `regular`). |
| `loadMoreLimit` | `number` | Number of messages to fetch per pagination event (default: 25). |
| `DateSeparatorComponent` | `React.ComponentType<DateSeparatorProps>` | Custom date divider component. |
| `MessageItemComponent` | `React.ComponentType<MessageItemProps>` | Fully replaces the default message item row. |
| `SystemMessageItemComponent` | `React.ComponentType<SystemMessageItemProps>` | Component for rendering system-level messages. |
| `JumpToLatestButton` | `React.ComponentType<JumpToLatestProps>` | Custom button shown to scroll down to the bottom. |
| `QuotedMessagePreviewComponent` | `React.ComponentType<QuotedMessagePreviewProps>` | Visual representation of the replied message block inside the timeline. |
| `MessageActionsBoxComponent` | `React.ComponentType<MessageActionsBoxProps>` | Renders the hover action menu (edit, delete, reply, etc.). |
| `showPinnedMessages` | `boolean` | Toggles the pinned messages banner. |
| `PinnedMessagesComponent` | `React.ComponentType<any>` | Replaces the pinned messages banner element entirely. |
| `ReplyPreviewComponent` | `React.ComponentType<ReplyPreviewProps>` | Preview used inside the message input area when replying. |
| `showReadReceipts` | `boolean` | Toggles rendering read receipts under messages. |
| `ReadReceiptsComponent` | `React.ComponentType<ReadReceiptsProps>` | Complete override for the read receipt UI below messages. |
| `ReadReceiptsTooltipComponent` | `React.ComponentType<ReadReceiptsTooltipProps>` | Override the read receipts tooltip logic on hover. |
| `readReceiptsMaxAvatars` | `number` | The maximum number of tiny avatars to show (default: 5). |
| `showTypingIndicator` | `boolean` | Whether to display the typing indicator at the bottom (default: true). |
| `TypingIndicatorComponent` | `React.ComponentType` | Override the UI of the typing indicator component. |
| `MessageReactionsComponent` | `React.ComponentType<MessageReactionsProps>` | Custom component rendered for message reactions logic. |

### Example

```tsx
import { VirtualMessageList } from '@ermis-network/ermis-chat-react';

const CustomMessageBubble = ({ message, isOwnMessage, children }) => (
  <div style={{ padding: 10, background: isOwnMessage ? 'lightblue' : '#f4f4f4', borderRadius: 8 }}>
    {children}
  </div>
);

export const MessagesPane = () => (
  <VirtualMessageList 
    loadMoreLimit={50}
    showReadReceipts={true}
    readReceiptsMaxAvatars={3}
    MessageBubble={CustomMessageBubble}
  />
);
```

---

## `<MessageInput />`

The textbox area for writing new messages. Handles typing events, file uploads, mentions, and formatting automatically.

### Props

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `placeholder` | `string` | The default text input placeholder. |
| `onSend` | `(text: string) => void` | Callback triggered after the message is sent. |
| `className` | `string` | Custom CSS wrapper class. |
| `SendButton` | `React.ComponentType<SendButtonProps>` | Override for the send action button. |
| `AttachButton` | `React.ComponentType<AttachButtonProps>` | Override for the file attachment icon / button. |
| `FilesPreviewComponent` | `React.ComponentType<FilesPreviewProps>` | Overrides the preview UI showcasing files ready to be uploaded. |
| `MentionSuggestionsComponent` | `React.ComponentType<MentionSuggestionsProps>` | Replaces the dropdown triggered by typing `@`. |
| `disableAttachments` | `boolean` | Entirely disables the file attachment capability. |
| `disableMentions` | `boolean` | Disables the rich `@user` mention functionality mapping. |
| `renderAbove` | `() => React.ReactNode` | Render custom UI elements above the default textarea row. |
| `onBeforeSend` | `Function` | Interceptor hook triggered right before sending; returning `false` will cancel the send. |
| `EmojiPickerComponent` | `React.ComponentType<EmojiPickerProps>` | Plug in an external Emoji picker vendor here (like `emoji-mart`). |
| `EmojiButtonComponent` | `React.ComponentType<EmojiButtonProps>` | Toggle button for expanding the emoji picker. |
| `ReplyPreviewComponent` | `React.ComponentType<ReplyPreviewProps>` | Controls the appearance of the message you're quoting pending upload. |
| `EditPreviewComponent` | `React.ComponentType<{ message, onDismiss }>` | Rendered when the user toggles edit mode on their message. |

### Example

```tsx
import { MessageInput } from '@ermis-network/ermis-chat-react';

const CustomSendBtn = ({ disabled, onClick }) => (
  <button onClick={onClick} disabled={disabled} style={{ fontWeight: 'bold' }}>
    Send
  </button>
);

export const Composer = () => (
  <MessageInput 
    placeholder="What's on your mind?..."
    disableAttachments={false}
    SendButton={CustomSendBtn}
    onBeforeSend={async (text) => {
      if (text.includes('badword')) {
        alert("Inappropriate content!");
        return false; // Prevent sending
      }
      return true; // Go ahead
    }}
  />
);
```
