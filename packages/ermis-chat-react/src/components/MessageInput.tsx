import React, { useState, useCallback } from 'react';
import { useChatClient } from '../hooks/useChatClient';

export type MessageInputProps = {
  placeholder?: string;
  onSend?: (text: string) => void;
  className?: string;
  SendButton?: React.ComponentType<{ disabled: boolean; onClick: () => void }>;
};

const DefaultSendButton: React.FC<{ disabled: boolean; onClick: () => void }> = React.memo(({
  disabled,
  onClick,
}) => (
  <button
    className="ermis-message-input__send-btn"
    onClick={onClick}
    disabled={disabled}
  >
    Send
  </button>
));
DefaultSendButton.displayName = 'DefaultSendButton';

export const MessageInput: React.FC<MessageInputProps> = React.memo(({
  placeholder = 'Type a message...',
  onSend,
  className,
  SendButton = DefaultSendButton,
}) => {
  const { activeChannel } = useChatClient();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = useCallback(async () => {
    if (!activeChannel || !text.trim() || sending) return;

    try {
      setSending(true);
      await activeChannel.sendMessage({ text: text.trim() });
      const sentText = text.trim();
      setText('');
      onSend?.(sentText);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  }, [activeChannel, text, sending, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
    },
    [],
  );

  if (!activeChannel) return null;

  return (
    <div className={`ermis-message-input${className ? ` ${className}` : ''}`}>
      <textarea
        className="ermis-message-input__textarea"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={sending}
        rows={1}
      />
      <SendButton
        disabled={!text.trim() || sending}
        onClick={handleSend}
      />
    </div>
  );
});

MessageInput.displayName = 'MessageInput';
