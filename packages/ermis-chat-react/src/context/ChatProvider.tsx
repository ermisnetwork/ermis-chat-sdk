import React, { createContext, useState } from 'react';
import { ErmisChat } from '@ermis-network/ermis-chat-sdk';
import type { Channel } from '@ermis-network/ermis-chat-sdk';
import type { Theme, ChatContextValue, ChatProviderProps } from '../types';

export type { Theme, ChatContextValue, ChatProviderProps } from '../types';

export const ChatContext = createContext<ChatContextValue | null>(null);

export const ChatProvider: React.FC<ChatProviderProps> = ({
  client,
  children,
  initialTheme = 'light',
}) => {
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [theme, setTheme] = useState<Theme>(initialTheme);

  const value: ChatContextValue = {
    client,
    activeChannel,
    setActiveChannel,
    theme,
    setTheme,
  };

  return (
    <ChatContext.Provider value={value}>
      <div className={`ermis-chat ermis-chat--${theme}`}>
        {children}
      </div>
    </ChatContext.Provider>
  );
};
