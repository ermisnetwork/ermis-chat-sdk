import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { useChatClient } from '../hooks/useChatClient';
import { useMentions } from '../hooks/useMentions';
import type { MentionMember } from '../hooks/useMentions';
import { MentionSuggestions } from './MentionSuggestions';

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
  const { client, activeChannel } = useChatClient();
  const editableRef = useRef<HTMLDivElement>(null);
  const [sending, setSending] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  const isTeamChannel = activeChannel?.type === 'team';

  // Auto-focus when channel changes
  useEffect(() => {
    if (activeChannel && editableRef.current) {
      editableRef.current.focus();
    }
  }, [activeChannel]);

  // Build member list from channel state (only used for team channels)
  const members = useMemo<MentionMember[]>(() => {
    if (!isTeamChannel) return [];
    const list: MentionMember[] = [];
    const stateMembers = (activeChannel?.state as any)?.members;
    if (stateMembers && typeof stateMembers === 'object') {
      for (const [id, member] of Object.entries<any>(stateMembers)) {
        list.push({
          id,
          name: member?.user?.name || member?.user_id || id,
          avatar: member?.user?.avatar,
        });
      }
    }
    return list;
  }, [activeChannel, isTeamChannel]);

  const {
    showSuggestions,
    filteredMembers,
    highlightIndex,
    handleInput: mentionHandleInput,
    handleKeyDown: mentionHandleKeyDown,
    selectMention,
    buildPayload,
    reset,
  } = useMentions({
    members,
    currentUserId: client.userID,
    editableRef,
  });

  const handleSend = useCallback(async () => {
    if (!activeChannel || !hasContent || sending) return;

    const payload = buildPayload();
    if (!payload.text.trim()) return;

    try {
      setSending(true);

      const message: Record<string, any> = { text: payload.text };
      // Only include mention fields for team channels
      if (isTeamChannel) {
        message.mentioned_all = payload.mentioned_all;
        message.mentioned_users = payload.mentioned_users;
      }

      await activeChannel.sendMessage(message);
      const sentText = payload.text;
      reset();
      setHasContent(false);
      onSend?.(sentText);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  }, [activeChannel, hasContent, sending, buildPayload, reset, onSend, isTeamChannel]);

  const handleInput = useCallback(() => {
    const el = editableRef.current;
    const content = el?.textContent?.trim() ?? '';
    setHasContent(content.length > 0);
    // Only run mention detection for team channels
    if (isTeamChannel) {
      mentionHandleInput();
    }
  }, [isTeamChannel, mentionHandleInput]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Let mention hook handle keyboard first (only for team channels)
      if (isTeamChannel) {
        const consumed = mentionHandleKeyDown(e);
        if (consumed) return;
      }

      // Regular enter → send
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [isTeamChannel, mentionHandleKeyDown, handleSend],
  );

  // Handle paste: only allow plain text (no HTML, no fake mentions)
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const plainText = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, plainText);
  }, []);

  if (!activeChannel) return null;

  return (
    <div className={`ermis-message-input${className ? ` ${className}` : ''}`}>
      <div className="ermis-message-input__editable-wrapper">
        {isTeamChannel && showSuggestions && (
          <MentionSuggestions
            members={filteredMembers}
            highlightIndex={highlightIndex}
            onSelect={selectMention}
          />
        )}
        <div
          ref={editableRef}
          className="ermis-message-input__editable"
          contentEditable={!sending}
          role="textbox"
          aria-placeholder={placeholder}
          data-placeholder={placeholder}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          suppressContentEditableWarning
        />
      </div>
      <SendButton disabled={!hasContent || sending} onClick={handleSend} />
    </div>
  );
});

MessageInput.displayName = 'MessageInput';
