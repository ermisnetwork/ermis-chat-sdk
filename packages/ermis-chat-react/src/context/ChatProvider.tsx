import React, { createContext, useState } from 'react';
import { ErmisChat } from '@ermis-network/ermis-chat-sdk';
import type { Channel } from '@ermis-network/ermis-chat-sdk';

export type Theme = 'dark' | 'light';

export type ChatContextValue = {
  client: ErmisChat;
  activeChannel: Channel | null;
  setActiveChannel: (channel: Channel | null) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const ChatContext = createContext<ChatContextValue | null>(null);

export type ChatProviderProps = {
  client: ErmisChat;
  children: React.ReactNode;
  /** Initial theme, defaults to 'dark' */
  initialTheme?: Theme;
};

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
