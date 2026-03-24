import React from 'react';

/* ----------------------------------------------------------
   Default sub-components for MessageInput
   ---------------------------------------------------------- */

export const DefaultSendButton: React.FC<{ disabled: boolean; onClick: () => void }> = React.memo(({
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

export const DefaultAttachButton: React.FC<{ disabled: boolean; onClick: () => void }> = React.memo(({
  disabled,
  onClick,
}) => (
  <button
    className="ermis-message-input__attach-btn"
    onClick={onClick}
    type="button"
    aria-label="Attach files"
    disabled={disabled}
  >
    📎
  </button>
));
DefaultAttachButton.displayName = 'DefaultAttachButton';

export const DefaultEmojiButton: React.FC<{ active: boolean; onClick: () => void }> = React.memo(({
  active,
  onClick,
}) => (
  <button
    className={`ermis-message-input__emoji-btn${active ? ' ermis-message-input__emoji-btn--active' : ''}`}
    onClick={onClick}
    type="button"
    aria-label="Emoji"
  >
    😀
  </button>
));
DefaultEmojiButton.displayName = 'DefaultEmojiButton';
