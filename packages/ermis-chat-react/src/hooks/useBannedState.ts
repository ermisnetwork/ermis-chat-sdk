import { useState, useEffect } from 'react';
import type { Channel } from '@ermis-network/ermis-chat-sdk';

/**
 * Hook that tracks whether the current user is banned in the given channel.
 *
 * Reads the initial value from `channel.state.membership.banned` and subscribes
 * to `member.banned` / `member.unbanned` WebSocket events for real-time updates.
 *
 * Only triggers a re-render when the *current user* is the target of the event.
 */
export function useBannedState(channel: Channel | null | undefined, currentUserId?: string) {
  const [isBanned, setIsBanned] = useState<boolean>(() => {
    return Boolean(channel?.state?.membership?.banned);
  });

  useEffect(() => {
    if (!channel) {
      setIsBanned(false);
      return;
    }

    // Sync initial state when channel changes
    setIsBanned(Boolean(channel.state?.membership?.banned));

    const handleBanned = (event: any) => {
      if (event.member?.user_id === currentUserId) {
        setIsBanned(true);
      }
    };

    const handleUnbanned = (event: any) => {
      if (event.member?.user_id === currentUserId) {
        setIsBanned(false);
      }
    };

    const sub1 = channel.on('member.banned', handleBanned);
    const sub2 = channel.on('member.unbanned', handleUnbanned);

    return () => {
      sub1.unsubscribe();
      sub2.unsubscribe();
    };
  }, [channel, currentUserId]);

  return { isBanned };
}
