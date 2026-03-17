import React, { useEffect, useState, useCallback, useMemo } from 'react';
import type { Channel, Event } from '@ermis-network/ermis-chat-sdk';
import { useChatClient } from '../hooks/useChatClient';
import { Avatar } from './Avatar';
import type { AvatarProps } from './Avatar';

/* ----------------------------------------------------------
   Memoized channel list item
   ---------------------------------------------------------- */
type ChannelItemProps = {
  channel: Channel;
  isActive: boolean;
  onSelect: (channel: Channel) => void;
  AvatarComponent: React.ComponentType<AvatarProps>;
};

const ChannelItem: React.FC<ChannelItemProps> = React.memo(({
  channel,
  isActive,
  onSelect,
  AvatarComponent,
}) => {
  const name = channel.data?.name || channel.cid;
  const image = channel.data?.image as string | undefined;
  const lastMessage = channel.state?.latestMessages?.slice(-1)[0];
  const lastMessageText = lastMessage?.text;
  const lastMessageUser = lastMessage?.user?.name || lastMessage?.user_id;

  const handleClick = useCallback(() => {
    onSelect(channel);
  }, [channel, onSelect]);

  return (
    <div
      className={`ermis-channel-list__item ${isActive ? 'ermis-channel-list__item--active' : ''}`}
      onClick={handleClick}
    >
      <AvatarComponent image={image} name={name} size={40} />
      <div className="ermis-channel-list__item-content">
        <div className="ermis-channel-list__item-name">{name}</div>
        {lastMessageText && (
          <div className="ermis-channel-list__item-last-message">
            {lastMessageUser && (
              <span className="ermis-channel-list__item-last-message-user">
                {lastMessageUser}:{' '}
              </span>
            )}
            <span>{lastMessageText}</span>
          </div>
        )}
      </div>
    </div>
  );
});
ChannelItem.displayName = 'ChannelItem';

/* ----------------------------------------------------------
   ChannelList
   ---------------------------------------------------------- */
export type ChannelListProps = {
  filters?: any;
  sort?: any[];
  options?: { message_limit?: number };
  renderChannel?: (channel: Channel, isActive: boolean) => React.ReactNode;
  onChannelSelect?: (channel: Channel) => void;
  className?: string;
  LoadingIndicator?: React.ComponentType;
  EmptyStateIndicator?: React.ComponentType;
  AvatarComponent?: React.ComponentType<AvatarProps>;
};

const DefaultLoading = React.memo(() => (
  <div className="ermis-channel-list__loading">Loading channels...</div>
));
DefaultLoading.displayName = 'DefaultLoading';

const DefaultEmpty = React.memo(() => (
  <div className="ermis-channel-list__empty">No channels found</div>
));
DefaultEmpty.displayName = 'DefaultEmpty';

export const ChannelList: React.FC<ChannelListProps> = React.memo(({
  filters = { type: ['messaging', 'team'] },
  sort = [],
  options = { message_limit: 25 },
  renderChannel,
  onChannelSelect,
  className,
  LoadingIndicator = DefaultLoading,
  EmptyStateIndicator = DefaultEmpty,
  AvatarComponent = Avatar,
}) => {
  const { client, activeChannel, setActiveChannel } = useChatClient();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);

  const loadChannels = useCallback(async () => {
    try {
      setLoading(true);
      const result = await client.queryChannels(filters, sort, options);
      setChannels(result);
    } catch (err) {
      console.error('Failed to load channels:', err);
    } finally {
      setLoading(false);
    }
  }, [client, filtersKey]);

  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  useEffect(() => {
    const handleChannelCreated = () => {
      loadChannels();
    };
    const sub = client.on('channel.created', handleChannelCreated);
    return () => sub.unsubscribe();
  }, [client, loadChannels]);

  const handleSelect = useCallback(
    (channel: Channel) => {
      setActiveChannel(channel);
      onChannelSelect?.(channel);
    },
    [setActiveChannel, onChannelSelect],
  );

  if (loading) return <LoadingIndicator />;
  if (channels.length === 0) return <EmptyStateIndicator />;

  return (
    <div className={`ermis-channel-list${className ? ` ${className}` : ''}`}>
      {channels.map((channel) => {
        const isActive = activeChannel?.cid === channel.cid;

        if (renderChannel) {
          return (
            <div key={channel.cid} onClick={() => handleSelect(channel)}>
              {renderChannel(channel, isActive)}
            </div>
          );
        }

        return (
          <ChannelItem
            key={channel.cid}
            channel={channel}
            isActive={isActive}
            onSelect={handleSelect}
            AvatarComponent={AvatarComponent}
          />
        );
      })}
    </div>
  );
});

ChannelList.displayName = 'ChannelList';
