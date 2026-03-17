import React from 'react';
import { useChatClient } from '../hooks/useChatClient';

export type ChannelProps = {
  children: React.ReactNode;
  /** Additional CSS class name */
  className?: string;
  /** Custom component shown when no channel is selected */
  EmptyStateIndicator?: React.ComponentType;
};

const DefaultEmpty = React.memo(() => (
  <div className="ermis-channel__empty">Select a channel to start chatting</div>
));
DefaultEmpty.displayName = 'DefaultEmpty';

/**
 * Channel wrapper component.
 */
export const Channel: React.FC<ChannelProps> = React.memo(({
  children,
  className,
  EmptyStateIndicator = DefaultEmpty,
}) => {
  const { activeChannel } = useChatClient();

  if (!activeChannel) {
    return <EmptyStateIndicator />;
  }

  return (
    <div className={`ermis-channel${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
});

Channel.displayName = 'Channel';
