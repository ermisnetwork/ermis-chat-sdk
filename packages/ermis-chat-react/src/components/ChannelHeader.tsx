import React, { useMemo } from 'react';
import { useChatClient } from '../hooks/useChatClient';
import { Avatar } from './Avatar';
import type { ChannelHeaderProps } from '../types';

export type { ChannelHeaderProps } from '../types';

/**
 * ChannelHeader displays the active channel's avatar and name.
 */
export const ChannelHeader: React.FC<ChannelHeaderProps> = React.memo(({
  className,
  AvatarComponent = Avatar,
}) => {
  const { activeChannel } = useChatClient();

  const { name, image } = useMemo(() => ({
    name: activeChannel?.data?.name || activeChannel?.cid || '',
    image: activeChannel?.data?.image as string | undefined,
  }), [activeChannel?.data?.name, activeChannel?.data?.image, activeChannel?.cid]);

  if (!activeChannel) return null;

  return (
    <div className={`ermis-channel-header${className ? ` ${className}` : ''}`}>
      <AvatarComponent image={image} name={name} size={32} />
      <div className="ermis-channel-header__info">
        <div className="ermis-channel-header__name">{name}</div>
      </div>
    </div>
  );
});

ChannelHeader.displayName = 'ChannelHeader';
