import { useState, useCallback, useRef, useDeferredValue, useMemo } from 'react';

/** Represents a member that can be mentioned */
export type MentionMember = {
  id: string;
  name: string;
  avatar?: string;
};

/** The data extracted from contentEditable on submit */
export type MentionPayload = {
  text: string;
  mentioned_all: boolean;
  mentioned_users: string[];
};

const MENTION_SPAN_CLASS = 'ermis-message-input__mention-span';

/**
 * Insert an atomic mention <span> at the current cursor position inside a
 * contenteditable element, followed by a trailing space.
 */
function insertMentionAtCursor(
  editableEl: HTMLElement,
  userId: string,
  displayName: string,
) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;

  const range = sel.getRangeAt(0);

  // Delete the @query text that triggered the suggestion
  // Walk backwards from cursor to find the '@' trigger
  const { startContainer, startOffset } = range;
  if (startContainer.nodeType === Node.TEXT_NODE) {
    const textBefore = startContainer.textContent?.slice(0, startOffset) ?? '';
    const atIndex = textBefore.lastIndexOf('@');
    if (atIndex !== -1) {
      // Delete from @ to cursor
      range.setStart(startContainer, atIndex);
      range.deleteContents();
    }
  }

  // Create the atomic mention span
  const span = document.createElement('span');
  span.className = MENTION_SPAN_CLASS;
  span.setAttribute('data-mention-id', userId);
  span.contentEditable = 'false';
  span.textContent = `@${displayName}`;

  // Insert span + trailing space
  range.insertNode(span);

  // Add a trailing space after the span
  const space = document.createTextNode('\u00A0');
  span.after(space);

  // Move cursor after the space
  const newRange = document.createRange();
  newRange.setStartAfter(space);
  newRange.collapse(true);
  sel.removeAllRanges();
  sel.addRange(newRange);

  // Trigger an input event so React picks up the change
  editableEl.dispatchEvent(new Event('input', { bubbles: true }));
}

/**
 * Parse the DOM of a contenteditable div to produce a mention payload.
 * Text nodes → plain text, mention spans → @userId.
 */
function buildPayloadFromDOM(editableEl: HTMLElement): MentionPayload {
  let text = '';
  let mentionedAll = false;
  const mentionedUsers: string[] = [];

  function walk(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent ?? '';
      return;
    }

    if (node instanceof HTMLElement) {
      // Is it a mention span?
      const mentionId = node.getAttribute('data-mention-id');
      if (mentionId && node.classList.contains(MENTION_SPAN_CLASS)) {
        if (mentionId === '__all__') {
          mentionedAll = true;
          text += '@all';
        } else {
          if (!mentionedUsers.includes(mentionId)) {
            mentionedUsers.push(mentionId);
          }
          text += `@${mentionId}`;
        }
        return; // Don't walk children of atomic span
      }

      // Check for <br> tags in contenteditable
      if (node.tagName === 'BR') {
        text += '\n';
        return;
      }

      // Walk child nodes for divs/other elements
      if (node.tagName === 'DIV' && text.length > 0 && !text.endsWith('\n')) {
        text += '\n';
      }
    }

    node.childNodes.forEach(walk);
  }

  walk(editableEl);

  // Clean up: replace non-breaking spaces with regular spaces
  text = text.replace(/\u00A0/g, ' ').trim();

  return { text, mentioned_all: mentionedAll, mentioned_users: mentionedUsers };
}

/**
 * Scan the DOM for currently present mention spans and return their IDs.
 */
function getActiveMentionIds(editableEl: HTMLElement): Set<string> {
  const ids = new Set<string>();
  const spans = editableEl.querySelectorAll(`.${MENTION_SPAN_CLASS}`);
  spans.forEach((span) => {
    const id = span.getAttribute('data-mention-id');
    if (id) ids.add(id);
  });
  return ids;
}

export type UseMentionsOptions = {
  members: MentionMember[];
  currentUserId?: string;
  editableRef: React.RefObject<HTMLDivElement | null>;
};

export type UseMentionsReturn = {
  showSuggestions: boolean;
  filteredMembers: MentionMember[];
  highlightIndex: number;
  /** Call on each input event of the contenteditable */
  handleInput: () => void;
  /** Call on keydown. Returns true if the event was consumed (e.g. Enter for selection). */
  handleKeyDown: (e: React.KeyboardEvent) => boolean;
  /** Select a member from the suggestion list */
  selectMention: (member: MentionMember) => void;
  /** Build the payload from the contenteditable DOM */
  buildPayload: () => MentionPayload;
  /** Reset mention state (call after send) */
  reset: () => void;
};

export function useMentions({
  members,
  currentUserId,
  editableRef,
}: UseMentionsOptions): UseMentionsReturn {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [activeMentionIds, setActiveMentionIds] = useState<Set<string>>(new Set());

  const deferredQuery = useDeferredValue(query);

  // All item: special entry
  const allItem: MentionMember = useMemo(
    () => ({ id: '__all__', name: 'all' }),
    [],
  );

  // Filter members based on deferred query, exclude self and already-mentioned
  const filteredMembers = useMemo(() => {
    const q = deferredQuery.toLowerCase();

    // Start with @all if not already selected
    const result: MentionMember[] = [];
    if (!activeMentionIds.has('__all__')) {
      if (!q || 'all'.includes(q)) {
        result.push(allItem);
      }
    }

    for (const m of members) {
      if (m.id === currentUserId) continue; // skip self
      if (activeMentionIds.has(m.id)) continue; // skip already mentioned
      if (q && !m.name.toLowerCase().includes(q)) continue; // filter by query
      result.push(m);
    }

    return result;
  }, [members, deferredQuery, activeMentionIds, currentUserId, allItem]);

  // Detect @ trigger from cursor position
  const detectTrigger = useCallback((): { triggered: boolean; query: string } => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !sel.isCollapsed) {
      return { triggered: false, query: '' };
    }

    const { anchorNode, anchorOffset } = sel;
    if (!anchorNode || anchorNode.nodeType !== Node.TEXT_NODE) {
      return { triggered: false, query: '' };
    }

    const textBefore = anchorNode.textContent?.slice(0, anchorOffset) ?? '';

    // Find the last @ that is preceded by a space or is at the start
    const match = textBefore.match(/(^|[\s\u00A0])@(\S*)$/);
    if (!match) {
      return { triggered: false, query: '' };
    }

    return { triggered: true, query: match[2] };
  }, []);

  const handleInput = useCallback(() => {
    const el = editableRef.current;
    if (!el) return;

    // Update active mention IDs by scanning DOM
    setActiveMentionIds(getActiveMentionIds(el));

    // Detect @ trigger
    const result = detectTrigger();
    if (result.triggered) {
      setShowSuggestions(true);
      setQuery(result.query);
      setHighlightIndex(0);
    } else {
      setShowSuggestions(false);
      setQuery('');
    }
  }, [editableRef, detectTrigger]);

  const selectMention = useCallback(
    (member: MentionMember) => {
      const el = editableRef.current;
      if (!el) return;

      insertMentionAtCursor(el, member.id, member.name);

      // Update tracking
      setActiveMentionIds((prev) => new Set(prev).add(member.id));
      setShowSuggestions(false);
      setQuery('');

      // Re-focus the editable
      el.focus();
    },
    [editableRef],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent): boolean => {
      if (!showSuggestions || filteredMembers.length === 0) return false;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightIndex((prev) =>
            prev < filteredMembers.length - 1 ? prev + 1 : 0,
          );
          return true;

        case 'ArrowUp':
          e.preventDefault();
          setHighlightIndex((prev) =>
            prev > 0 ? prev - 1 : filteredMembers.length - 1,
          );
          return true;

        case 'Enter':
          e.preventDefault();
          if (filteredMembers[highlightIndex]) {
            selectMention(filteredMembers[highlightIndex]);
          }
          return true;

        case 'Escape':
          e.preventDefault();
          setShowSuggestions(false);
          return true;

        default:
          return false;
      }
    },
    [showSuggestions, filteredMembers, highlightIndex, selectMention],
  );

  const buildPayload = useCallback((): MentionPayload => {
    const el = editableRef.current;
    if (!el) return { text: '', mentioned_all: false, mentioned_users: [] };
    return buildPayloadFromDOM(el);
  }, [editableRef]);

  const reset = useCallback(() => {
    setShowSuggestions(false);
    setQuery('');
    setHighlightIndex(0);
    setActiveMentionIds(new Set());
    const el = editableRef.current;
    if (el) {
      el.innerHTML = '';
    }
  }, [editableRef]);

  return {
    showSuggestions,
    filteredMembers,
    highlightIndex,
    handleInput,
    handleKeyDown,
    selectMention,
    buildPayload,
    reset,
  };
}
