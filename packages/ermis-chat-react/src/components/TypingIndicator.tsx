import React from 'react';
import { useTypingIndicator, type TypingUser } from '../hooks/useTypingIndicator';

export type TypingIndicatorProps = {
  /** Custom render function for the typing text */
  renderText?: (users: TypingUser[]) => React.ReactNode;
};

/**
 * Displays a "X is typing..." indicator below the message list.
 * Automatically subscribes to typing events via the useTypingIndicator hook.
 */
export const TypingIndicator: React.FC<TypingIndicatorProps> = React.memo(({ renderText }) => {
  const { typingUsers } = useTypingIndicator();

  if (typingUsers.length === 0) return null;

  const text = renderText
    ? renderText(typingUsers)
    : formatTypingText(typingUsers);

  return (
    <div className="ermis-typing-indicator">
      <div className="ermis-typing-indicator__dots">
        <span className="ermis-typing-indicator__dot" />
        <span className="ermis-typing-indicator__dot" />
        <span className="ermis-typing-indicator__dot" />
      </div>
      <span className="ermis-typing-indicator__text">{text}</span>
    </div>
  );
});

TypingIndicator.displayName = 'TypingIndicator';

/**
 * Format typing text based on number of users:
 * - 1 user: "Alice is typing..."
 * - 2 users: "Alice and Bob are typing..."
 * - 3+ users: "Alice, Bob and 2 others are typing..."
 */
function formatTypingText(users: TypingUser[]): string {
  const names = users.map((u) => u.name || u.id);

  if (names.length === 1) {
    return `${names[0]} is typing...`;
  }
  if (names.length === 2) {
    return `${names[0]} and ${names[1]} are typing...`;
  }
  const remaining = names.length - 2;
  return `${names[0]}, ${names[1]} and ${remaining} other${remaining > 1 ? 's' : ''} are typing...`;
}
