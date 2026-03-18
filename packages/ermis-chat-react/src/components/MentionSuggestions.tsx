import React, { useEffect, useRef } from 'react';
import { Avatar } from './Avatar';
import type { MentionSuggestionsProps } from '../types';

export type { MentionSuggestionsProps } from '../types';

export const MentionSuggestions: React.FC<MentionSuggestionsProps> = React.memo(({
  members,
  highlightIndex,
  onSelect,
}) => {
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll highlighted item into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const item = list.children[highlightIndex] as HTMLElement | undefined;
    if (item) {
      item.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightIndex]);

  if (members.length === 0) return null;

  return (
    <div className="ermis-mention-suggestions" ref={listRef}>
      {members.map((member, index) => (
        <div
          key={member.id}
          className={`ermis-mention-suggestions__item${
            index === highlightIndex ? ' ermis-mention-suggestions__item--highlighted' : ''
          }`}
          onMouseDown={(e) => {
            // Use mousedown (not click) to fire before blur
            e.preventDefault();
            onSelect(member);
          }}
        >
          {member.id === '__all__' ? (
            <div className="ermis-mention-suggestions__all-icon">@</div>
          ) : (
            <Avatar image={member.avatar} name={member.name} size={24} />
          )}
          <span className="ermis-mention-suggestions__name">
            {member.id === '__all__' ? 'all' : member.name}
          </span>
        </div>
      ))}
    </div>
  );
});

MentionSuggestions.displayName = 'MentionSuggestions';
