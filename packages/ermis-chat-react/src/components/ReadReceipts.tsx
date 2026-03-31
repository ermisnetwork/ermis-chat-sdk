import React from 'react';
import type { ReadReceiptsProps, ReadReceiptsTooltipProps } from '../types';
import { Avatar } from './Avatar';
import { formatReadTimestamp } from '../utils';

export type { ReadReceiptsProps, ReadReceiptsTooltipProps } from '../types';

/* ----------------------------------------------------------
   Default Tooltip — shown on hover
   ---------------------------------------------------------- */
const DefaultReadReceiptsTooltip: React.FC<ReadReceiptsTooltipProps> = React.memo(({
  readers,
  AvatarComponent,
}) => (
  <div className="ermis-read-receipts__tooltip-wrapper">
    <div className="ermis-read-receipts__tooltip">
      {readers.map((reader) => (
        <div key={reader.id} className="ermis-read-receipts__tooltip-item">
          <AvatarComponent
            image={reader.avatar}
            name={reader.name || reader.id}
            size={20}
          />
          <div className="ermis-read-receipts__tooltip-info">
            <span className="ermis-read-receipts__tooltip-name">{reader.name || reader.id}</span>
            <span className="ermis-read-receipts__tooltip-time">{formatReadTimestamp(reader.last_read)}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
));
DefaultReadReceiptsTooltip.displayName = 'DefaultReadReceiptsTooltip';

/* ----------------------------------------------------------
   ReadReceipts — main component
   ---------------------------------------------------------- */
export const ReadReceipts: React.FC<ReadReceiptsProps> = React.memo(({
  readers,
  maxAvatars = 5,
  AvatarComponent = Avatar,
  TooltipComponent = DefaultReadReceiptsTooltip,
  showTooltip = true,
  isOwnMessage = false,
  isLastInGroup = false,
  status,
}) => {
  if (!readers || readers.length === 0) {
    if (isOwnMessage && (isLastInGroup || status === 'error')) {
      if (status === 'error') {
        return (
          <div className="ermis-read-receipts">
            <div className="ermis-read-receipts__sent-status ermis-message-status--failed" title="Failed to send" style={{ color: 'var(--ermis-color-error, #f44336)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
          </div>
        );
      }

      if (status === 'sending') {
        return (
          <div className="ermis-read-receipts">
            <div className="ermis-read-receipts__sent-status ermis-message-status--sending" title="Sending...">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5, marginLeft: 'auto' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
          </div>
        );
      }

      return (
        <div className="ermis-read-receipts">
          <div className="ermis-read-receipts__sent-status ermis-message-status--sent" title="Sent">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5, marginLeft: 'auto' }}>
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>
      );
    }
    return null;
  }

  const visible = readers.slice(0, maxAvatars);
  const overflow = readers.length - maxAvatars;

  return (
    <div className="ermis-read-receipts">
      <div className="ermis-read-receipts__avatars">
        {visible.map((reader) => (
          <AvatarComponent
            key={reader.id}
            image={reader.avatar}
            name={reader.name || reader.id}
            size={16}
            className="ermis-read-receipts__avatar"
          />
        ))}
        {overflow > 0 && (
          <span className="ermis-read-receipts__overflow">+{overflow}</span>
        )}
        {showTooltip && (
          <TooltipComponent
            readers={readers}
            AvatarComponent={AvatarComponent}
          />
        )}
      </div>
    </div>
  );
});

ReadReceipts.displayName = 'ReadReceipts';
