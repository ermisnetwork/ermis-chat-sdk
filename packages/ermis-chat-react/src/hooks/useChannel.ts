import { useState, useEffect, useCallback } from 'react';
import type { Channel, Event } from '@ermis-network/ermis-chat-sdk';
import { useChatClient } from './useChatClient';
import type { UseChannelReturn } from '../types';

export type { UseChannelReturn } from '../types';

export const useChannel = (): UseChannelReturn => {
  const { activeChannel } = useChatClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  return {
    channel: activeChannel,
    loading,
    error,
  };
};
