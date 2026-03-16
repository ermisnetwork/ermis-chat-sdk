import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { StableWSConnection } from './connection';
import { EVENT_MAP } from './events';

export type Role = 'admin' | 'user' | 'guest' | 'anonymous' | 'channel_member' | 'channel_moderator' | string;

/**
 * Utility Types
 */

export type ArrayOneOrMore<T> = {
  0: T;
} & Array<T>;

export type ArrayTwoOrMore<T> = {
  0: T;
  1: T;
} & Array<T>;

export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

/* Unknown Record */
export type UR = Record<string, unknown>;
export type DefaultGenerics = {
  attachmentType: UR;
  channelType: UR;
  commandType: LiteralStringForUnion;
  eventType: UR;
  messageType: UR;
  pollOptionType: UR;
  pollType: UR;
  reactionType: UR;
  userType: UR;
};

export type ExtendableGenerics = {
  attachmentType: UR;
  channelType: UR;
  commandType: string;
  eventType: UR;
  messageType: UR;
  pollOptionType: UR;
  pollType: UR;
  reactionType: UR;
  userType: UR;
};

/**
 * Response Types
 */

export type APIResponse = {
  duration?: string;
};

export type ModerationResult = {
  action: string;
  created_at: string;
  message_id: string;
  updated_at: string;
  user_bad_karma: boolean;
  user_karma: number;
  blocked_word?: string;
  blocklist_name?: string;
  moderated_by?: string;
};

export type AutomodDetails = {
  action?: string;
  image_labels?: Array<string>;
  original_message_type?: string;
  result?: ModerationResult;
};

export type FlagDetails = {
  automod?: AutomodDetails;
};

export type Flag<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = {
  created_at: string;
  created_by_automod: boolean;
  updated_at: string;
  details?: FlagDetails;
  target_message?: MessageResponse<ErmisChatGenerics>;
  target_user?: UserResponse<ErmisChatGenerics>;
  user?: UserResponse<ErmisChatGenerics>;
};

export type FlagsResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = APIResponse & {
  flags?: Array<Flag<ErmisChatGenerics>>;
};

export type FlagReport<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = {
  flags_count: number;
  id: string;
  message: MessageResponse<ErmisChatGenerics>;
  user: UserResponse<ErmisChatGenerics>;
  created_at?: string;
  details?: FlagDetails;
  first_reporter?: UserResponse<ErmisChatGenerics>;
  review_result?: string;
  reviewed_at?: string;
  reviewed_by?: UserResponse<ErmisChatGenerics>;
  updated_at?: string;
};

export type ChannelResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> =
  ErmisChatGenerics['channelType'] & {
    cid: string;
    disabled: boolean;
    frozen: boolean;
    id: string;
    type: string;
    auto_translation_enabled?: boolean;
    auto_translation_language?: TranslationLanguages | '';
    config?: ChannelConfigWithInfo<ErmisChatGenerics>;
    cooldown?: number;
    created_at?: string;
    created_by?: UserResponse<ErmisChatGenerics> | null;
    created_by_id?: string;
    deleted_at?: string;
    hidden?: boolean;
    invites?: string[];
    joined?: boolean;
    last_message_at?: string;
    member_count?: number;
    members: ChannelMemberResponse<ErmisChatGenerics>[];
    muted?: boolean;
    name?: string;
    own_capabilities?: string[];
    team?: string;
    truncated_at?: string;
    truncated_by?: UserResponse<ErmisChatGenerics>;
    truncated_by_id?: string;
    updated_at?: string;
    image?: string;
    description?: string;
    member_message_cooldown?: number;
    member_capabilities?: string[];
    is_pinned?: boolean;
    topics_enabled?: boolean;
    is_closed_topic?: boolean;
  };

export type QueryChannelsAPIResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = APIResponse & {
  channels: Omit<ChannelAPIResponse<ErmisChatGenerics>, keyof APIResponse>[];
};

export type QueryChannelAPIResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = APIResponse &
  ChannelAPIResponse<ErmisChatGenerics>;

export type ChannelAPIResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = {
  channel: ChannelResponse<ErmisChatGenerics>;
  members: ChannelMemberResponse<ErmisChatGenerics>[];
  messages: MessageResponse<ErmisChatGenerics>[];
  pinned_messages: MessageResponse<ErmisChatGenerics>[];
  hidden?: boolean;
  membership?: ChannelMembership<ErmisChatGenerics> | null;
  pending_messages?: PendingMessageResponse<ErmisChatGenerics>[];
  read?: ReadResponse<ErmisChatGenerics>[];
  threads?: ThreadResponse[];
  topics?: QueryChannelAPIResponse<ErmisChatGenerics>[];
  watcher_count?: number;
  watchers?: UserResponse<ErmisChatGenerics>[];
  is_pinned?: boolean;
};

export type ChannelUpdateOptions = {
  hide_history?: boolean;
  skip_push?: boolean;
};

export type ChannelMemberAPIResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = APIResponse & {
  members: ChannelMemberResponse<ErmisChatGenerics>[];
};

export type ChannelMemberResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = {
  banned?: boolean;
  channel_role?: Role;
  created_at?: string;
  invite_accepted_at?: string;
  invite_rejected_at?: string;
  invited?: boolean;
  is_moderator?: boolean;
  notifications_muted?: boolean;
  role?: string;
  shadow_banned?: boolean;
  status?: string;
  updated_at?: string;
  user?: UserResponse<ErmisChatGenerics>;
  user_id?: string;
};

export type CommandResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> =
  Partial<CreatedAtUpdatedAt> & {
    args?: string;
    description?: string;
    name?: CommandVariants<ErmisChatGenerics>;
    set?: CommandVariants<ErmisChatGenerics>;
  };

export type ConnectAPIResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> =
  Promise<void | ConnectionOpen<ErmisChatGenerics>>;

export type DeleteChannelAPIResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = APIResponse & {
  channel: ChannelResponse<ErmisChatGenerics>;
};

export type EventAPIResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = APIResponse & {
  event: Event<ErmisChatGenerics>;
};

export type FormatMessageResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = Omit<
  MessageResponse<{
    attachmentType: ErmisChatGenerics['attachmentType'];
    channelType: ErmisChatGenerics['channelType'];
    commandType: ErmisChatGenerics['commandType'];
    eventType: ErmisChatGenerics['eventType'];
    messageType: {};
    pollOptionType: ErmisChatGenerics['pollOptionType'];
    pollType: ErmisChatGenerics['pollType'];
    reactionType: ErmisChatGenerics['reactionType'];
    userType: ErmisChatGenerics['userType'];
  }>,
  'created_at' | 'pinned_at' | 'updated_at' | 'status'
> &
  ErmisChatGenerics['messageType'] & {
    created_at: Date;
    pinned_at: Date | null;
    status: string;
    updated_at: Date;
  };

export type ThreadResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = {
  channel: ChannelResponse<ErmisChatGenerics>;
  channel_cid: string;
  created_at: string;
  deleted_at: string;
  latest_replies: MessageResponse<ErmisChatGenerics>[];
  parent_message: MessageResponse<ErmisChatGenerics>;
  parent_message_id: string;
  read: {
    last_read: string;
    last_read_message_id: string;
    unread_messages: number;
    user: UserResponse<ErmisChatGenerics>;
  }[];
  reply_count: number;
  thread_participants: {
    created_at: string;
    user: UserResponse<ErmisChatGenerics>;
  }[];
  title: string;
  updated_at: string;
};

export type GetMultipleMessagesAPIResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> =
  APIResponse & {
    messages: MessageResponse<ErmisChatGenerics>[];
  };

export type GetReactionsAPIResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = APIResponse & {
  reactions: ReactionResponse<ErmisChatGenerics>[];
};

export type GetRepliesAPIResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = APIResponse & {
  messages: MessageResponse<ErmisChatGenerics>[];
};

export type GetUnreadCountAPIResponse = APIResponse & {
  channel_type: {
    channel_count: number;
    channel_type: string;
    unread_count: number;
  }[];
  channels: {
    channel_id: string;
    last_read: string;
    unread_count: number;
  }[];
  threads: {
    last_read: string;
    last_read_message_id: string;
    parent_message_id: string;
    unread_count: number;
  }[];
  total_unread_count: number;
  total_unread_threads_count: number;
};

export type ListChannelResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = APIResponse & {
  channel_types: Record<
    string,
    Omit<CreateChannelOptions<ErmisChatGenerics>, 'client_id' | 'connection_id' | 'commands'> & {
      commands: CommandResponse<ErmisChatGenerics>[];
      created_at: string;
      updated_at: string;
      grants?: Record<string, string[]>;
    }
  >;
};

export type MuteChannelAPIResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = APIResponse & {
  channel_mute: ChannelMute<ErmisChatGenerics>;
  own_user: OwnUserResponse<ErmisChatGenerics>;
  channel_mutes?: ChannelMute<ErmisChatGenerics>[];
  // mute?: MuteResponse<ErmisChatGenerics>;
};

export type MessageResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> =
  MessageResponseBase<ErmisChatGenerics> & {
    quoted_message?: MessageResponseBase<ErmisChatGenerics>;
  };

export type MessageResponseBase<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> =
  MessageBase<ErmisChatGenerics> & {
    type: MessageLabel;
    args?: string;
    before_message_send_failed?: boolean;
    channel?: ChannelResponse<ErmisChatGenerics>;
    cid?: string;
    command?: string;
    command_info?: { name?: string };
    created_at?: string;
    deleted_at?: string;
    deleted_reply_count?: number;
    i18n?: RequireAtLeastOne<Record<`${TranslationLanguages}_text`, string>> & {
      language: TranslationLanguages;
    };
    latest_reactions?: ReactionResponse<ErmisChatGenerics>[];
    mentioned_users?: UserResponse<ErmisChatGenerics>[];
    message_text_updated_at?: string;
    moderation_details?: ModerationDetailsResponse;
    own_reactions?: ReactionResponse<ErmisChatGenerics>[] | null;
    pin_expires?: string | null;
    pinned_at?: string | null;
    pinned_by?: UserResponse<ErmisChatGenerics> | null;
    poll?: PollResponse<ErmisChatGenerics>;
    reaction_counts?: { [key: string]: number } | null;
    reaction_groups?: { [key: string]: ReactionGroupResponse } | null;
    reaction_scores?: { [key: string]: number } | null;
    reply_count?: number;
    shadowed?: boolean;
    status?: string;
    thread_participants?: UserResponse<ErmisChatGenerics>[];
    updated_at?: string;
  };

export type ReactionGroupResponse = {
  count: number;
  sum_scores: number;
  first_reaction_at?: string;
  last_reaction_at?: string;
};

export type ModerationDetailsResponse = {
  action: 'MESSAGE_RESPONSE_ACTION_BOUNCE' | (string & {});
  error_msg: string;
  harms: ModerationHarmResponse[];
  original_text: string;
};

export type ModerationHarmResponse = {
  name: string;
  phrase_list_ids: number[];
};

export type MuteResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = {
  user: UserResponse<ErmisChatGenerics>;
  created_at?: string;
  expires?: string;
  target?: UserResponse<ErmisChatGenerics>;
  updated_at?: string;
};

export type OwnUserBase<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = {
  channel_mutes: ChannelMute<ErmisChatGenerics>[];
  devices: Device<ErmisChatGenerics>[];
  // mutes: Mute<ErmisChatGenerics>[];
  total_unread_count: number;
  unread_channels: number;
  unread_count: number;
  unread_threads: number;
  invisible?: boolean;
  privacy_settings?: PrivacySettings;
  roles?: string[];
};

export type OwnUserResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> =
  UserResponse<ErmisChatGenerics> & OwnUserBase<ErmisChatGenerics>;

export type PartialUpdateChannelAPIResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> =
  APIResponse & {
    channel: ChannelResponse<ErmisChatGenerics>;
    members: ChannelMemberResponse<ErmisChatGenerics>[];
  };

export type ReactionAPIResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = APIResponse & {
  message: MessageResponse<ErmisChatGenerics>;
  reaction: ReactionResponse<ErmisChatGenerics>;
};

export type ReactionResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> =
  Reaction<ErmisChatGenerics> & {
    created_at: string;
    message_id: string;
    updated_at: string;
  };

export type ReadResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = {
  last_read: string;
  user: UserResponse<ErmisChatGenerics>;
  last_read_message_id?: string;
  unread_messages?: number;
  last_send?: string;
};

export type SearchAPIResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = APIResponse & {
  results: {
    message: MessageResponse<ErmisChatGenerics>;
  }[];
  next?: string;
  previous?: string;
  results_warning?: SearchWarning | null;
};

export type SearchWarning = {
  channel_search_cids: string[];
  channel_search_count: number;
  warning_code: number;
  warning_description: string;
};

// Thumb URL(thumb_url) is added considering video attachments as the backend will return the thumbnail in the response.
export type SendFileAPIResponse = APIResponse & { file: string; thumb_url?: string };

export type SendMessageAPIResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = APIResponse & {
  message: MessageResponse<ErmisChatGenerics>;
  pending_message_metadata?: Record<string, string> | null;
};

export type TruncateChannelAPIResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = APIResponse & {
  channel: ChannelResponse<ErmisChatGenerics>;
  message?: MessageResponse<ErmisChatGenerics>;
};

export type UpdateChannelAPIResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = APIResponse & {
  channel: ChannelResponse<ErmisChatGenerics>;
  members: ChannelMemberResponse<ErmisChatGenerics>[];
  message?: MessageResponse<ErmisChatGenerics>;
};

export type UsersAPIResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = APIResponse & {
  users: Array<UserResponse<ErmisChatGenerics>>;
};

export type UserResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = User<ErmisChatGenerics> & {
  project_id?: string;
  created_at?: string;
  updated_at?: string;
};
export type Contact = {
  project_id: string;
  user_id: string;
  other_id: string;
  relation_status: string;
  created_at: string;
  updated_at: string;
};

export type ContactResponse = APIResponse & {
  project_id_user_ids: {
    [key: string]: Contact[];
  };
};

export type ContactResult<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = APIResponse & {
  contact_users: UserResponse<ErmisChatGenerics>[];
  block_users: UserResponse<ErmisChatGenerics>[];
};

export type PrivacySettings = {
  read_receipts?: {
    enabled?: boolean;
  };
  typing_indicators?: {
    enabled?: boolean;
  };
};

/**
 * Option Types
 */

export type FlagsPaginationOptions = {
  limit?: number;
  offset?: number;
};

export type BanUserOptions<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = UnBanUserOptions & {
  banned_by?: UserResponse<ErmisChatGenerics>;
  banned_by_id?: string;
  ip_ban?: boolean;
  reason?: string;
  timeout?: number;
};

export type ChannelOptions = {
  limit?: number;
  member_limit?: number;
  message_limit?: number;
  offset?: number;
  presence?: boolean;
  state?: boolean;
  user_id?: string;
  watch?: boolean;
};

export type ChannelQueryOptions<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = {
  client_id?: string;
  connection_id?: string;
  data?: ChannelResponse<ErmisChatGenerics>;
  hide_for_creator?: boolean;
  members?: PaginationOptions;
  messages?: MessagePaginationOptions;
  presence?: boolean;
  state?: boolean;
  watch?: boolean;
  watchers?: PaginationOptions;
};

export type ChannelStateOptions = {
  offlineMode?: boolean;
  skipInitialization?: string[];
};

export type CreateChannelOptions<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = {
  automod?: ChannelConfigAutomod;
  automod_behavior?: ChannelConfigAutomodBehavior;
  automod_thresholds?: ChannelConfigAutomodThresholds;
  blocklist?: string;
  blocklist_behavior?: ChannelConfigAutomodBehavior;
  client_id?: string;
  commands?: CommandVariants<ErmisChatGenerics>[];
  connect_events?: boolean;
  connection_id?: string;
  custom_events?: boolean;
  grants?: Record<string, string[]>;
  mark_messages_pending?: boolean;
  max_message_length?: number;
  message_retention?: string;
  mutes?: boolean;
  name?: string;
  permissions?: PermissionObject[];
  polls?: boolean;
  push_notifications?: boolean;
  quotes?: boolean;
  reactions?: boolean;
  read_events?: boolean;
  reminders?: boolean;
  replies?: boolean;
  search?: boolean;
  typing_events?: boolean;
  uploads?: boolean;
  url_enrichment?: boolean;
};

export type CreateCommandOptions<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = {
  description: string;
  name: CommandVariants<ErmisChatGenerics>;
  args?: string;
  set?: CommandVariants<ErmisChatGenerics>;
};

// TODO: rename to UpdateChannelOptions in the next major update and use it in channel._update and/or channel.update
export type InviteOptions<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = {
  accept_invite?: boolean;
  add_members?: string[];
  promote_members?: string[];
  client_id?: string;
  connection_id?: string;
  data?: Omit<ChannelResponse<ErmisChatGenerics>, 'id' | 'cid'>;
  demote_members?: string[];
  invites?: string[];
  message?: MessageResponse<ErmisChatGenerics>;
  reject_invite?: boolean;
  remove_members?: string[];
  user?: UserResponse<ErmisChatGenerics>;
  user_id?: string;
};

export type MarkChannelsReadOptions<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = {
  client_id?: string;
  connection_id?: string;
  read_by_channel?: Record<string, string>;
  user?: UserResponse<ErmisChatGenerics>;
  user_id?: string;
};

export type MarkReadOptions<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = {
  client_id?: string;
  connection_id?: string;
  thread_id?: string;
  user?: UserResponse<ErmisChatGenerics>;
  user_id?: string;
};

export type MarkUnreadOptions<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = {
  client_id?: string;
  connection_id?: string;
  message_id?: string;
  thread_id?: string;
  user?: UserResponse<ErmisChatGenerics>;
  user_id?: string;
};

export type PaginationOptions = {
  created_at_after?: string | Date;
  created_at_after_or_equal?: string | Date;
  created_at_before?: string | Date;
  created_at_before_or_equal?: string | Date;
  id_gt?: string;
  id_gte?: string;
  id_lt?: string;
  id_lte?: string;
  limit?: number;
  offset?: number;
};

export type MessagePaginationOptions = PaginationOptions & {
  created_at_around?: string | Date;
  id_around?: string;
};

export type PinnedMessagePaginationOptions = {
  id_around?: string;
  id_gt?: string;
  id_gte?: string;
  id_lt?: string;
  id_lte?: string;
  limit?: number;
  offset?: number;
  pinned_at_after?: string | Date;
  pinned_at_after_or_equal?: string | Date;
  pinned_at_around?: string | Date;
  pinned_at_before?: string | Date;
  pinned_at_before_or_equal?: string | Date;
};

export type QueryMembersOptions = {
  limit?: number;
  offset?: number;
  user_id_gt?: string;
  user_id_gte?: string;
  user_id_lt?: string;
  user_id_lte?: string;
};

export type SearchOptions<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = {
  limit?: number;
  next?: string;
  offset?: number;
  sort?: SearchMessageSort<ErmisChatGenerics>;
};

export type ErmisChatOptions = AxiosRequestConfig & {
  /**
   * Used to disable warnings that are triggered by using connectUser or connectAnonymousUser server-side.
   */
  allowServerSideConnect?: boolean;
  axiosRequestConfig?: AxiosRequestConfig;
  /**
   * Base url for User BE API (uss/v1). Defaults to baseURL + '/uss/v1' if not provided.
   */
  userBaseURL?: string;
  browser?: boolean;
  device?: BaseDeviceFields;
  enableInsights?: boolean;
  /** experimental feature, please contact support if you want this feature enabled for you */
  logger?: Logger;
  /**
   * When network is recovered, we re-query the active channels on client. But in single query, you can recover
   * only 30 channels. So its not guaranteed that all the channels in activeChannels object have updated state.
   * Thus in UI sdks, state recovery is managed by components themselves, they don't rely on js client for this.
   *
   * `recoverStateOnReconnect` parameter can be used in such cases, to disable state recovery within js client.
   * When false, user/consumer of this client will need to make sure all the channels present on UI by
   * manually calling queryChannels endpoint.
   */
  recoverStateOnReconnect?: boolean;
  warmUp?: boolean;
  // Set the instance of StableWSConnection on chat client. Its purely for testing purpose and should
  // not be used in production apps.
  wsConnection?: StableWSConnection;
};

export type UnBanUserOptions = {
  client_id?: string;
  connection_id?: string;
  id?: string;
  shadow?: boolean;
  target_user_id?: string;
  type?: string;
};

// TODO: rename to UpdateChannelTypeOptions in the next major update
export type UpdateChannelOptions<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = Omit<
  CreateChannelOptions<ErmisChatGenerics>,
  'name'
> & {
  created_at?: string;
  updated_at?: string;
};

export type UpdateCommandOptions<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = {
  description: string;
  args?: string;
  set?: CommandVariants<ErmisChatGenerics>;
};

export type UserOptions = {
  include_deactivated_users?: boolean;
  limit?: number;
  offset?: number;
  presence?: boolean;
};

/**
 * Event Types
 */

export type Event<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = ErmisChatGenerics['eventType'] & {
  type: EventTypes;
  channel?: ChannelResponse<ErmisChatGenerics>;
  channel_id?: string;
  channel_type?: string;
  cid?: string;
  clear_history?: boolean;
  connection_id?: string;
  // event creation timestamp, format Date ISO string
  created_at?: string;
  // id of the message that was marked as unread - all the following messages are considered unread. (notification.mark_unread)
  first_unread_message_id?: string;
  hard_delete?: boolean;
  // creation date of a message with last_read_message_id, formatted as Date ISO string
  last_read_at?: string;
  last_read_message_id?: string;
  mark_messages_deleted?: boolean;
  me?: OwnUserResponse<ErmisChatGenerics>;
  member?: ChannelMemberResponse<ErmisChatGenerics>;
  message?: MessageResponse<ErmisChatGenerics>;
  mode?: string;
  online?: boolean;
  parent_id?: string;
  poll?: PollResponse<ErmisChatGenerics>;
  poll_vote?: PollVote<ErmisChatGenerics>;
  queriedChannels?: {
    channels: ChannelAPIResponse<ErmisChatGenerics>[];
    isLatestMessageSet?: boolean;
  };
  reaction?: ReactionResponse<ErmisChatGenerics>;
  received_at?: string | Date;
  team?: string;
  thread?: ThreadResponse<ErmisChatGenerics>;
  // @deprecated number of all unread messages across all current user's unread channels, equals unread_count
  total_unread_count?: number;
  // number of all current user's channels with at least one unread message including the channel in this event
  unread_channels?: number;
  // number of all unread messages across all current user's unread channels
  unread_count?: number;
  // number of unread messages in the channel from this event (notification.mark_unread)
  unread_messages?: number;
  user?: UserResponse<ErmisChatGenerics>;
  user_id?: string;
  watcher_count?: number;
};

export type UserCustomEvent<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> =
  ErmisChatGenerics['eventType'] & {
    type: string;
  };

export type EventHandler<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = (
  event: Event<ErmisChatGenerics>,
) => void;

export type EventTypes = 'all' | keyof typeof EVENT_MAP;

/**
 * Filter Types
 */

export type AscDesc = 1 | -1;

export type MessageFlagsFiltersOptions = {
  channel_cid?: string;
  is_reviewed?: boolean;
  team?: string;
  user_id?: string;
};

export type MessageFlagsFilters = QueryFilters<
  {
    channel_cid?:
      | RequireOnlyOne<Pick<QueryFilter<MessageFlagsFiltersOptions['channel_cid']>, '$eq' | '$in'>>
      | PrimitiveFilter<MessageFlagsFiltersOptions['channel_cid']>;
  } & {
    team?:
      | RequireOnlyOne<Pick<QueryFilter<MessageFlagsFiltersOptions['team']>, '$eq' | '$in'>>
      | PrimitiveFilter<MessageFlagsFiltersOptions['team']>;
  } & {
    user_id?:
      | RequireOnlyOne<Pick<QueryFilter<MessageFlagsFiltersOptions['user_id']>, '$eq' | '$in'>>
      | PrimitiveFilter<MessageFlagsFiltersOptions['user_id']>;
  } & {
    [Key in keyof Omit<MessageFlagsFiltersOptions, 'channel_cid' | 'user_id' | 'is_reviewed'>]:
      | RequireOnlyOne<QueryFilter<MessageFlagsFiltersOptions[Key]>>
      | PrimitiveFilter<MessageFlagsFiltersOptions[Key]>;
  }
>;

export type FlagsFiltersOptions = {
  channel_cid?: string;
  message_id?: string;
  message_user_id?: string;
  reporter_id?: string;
  team?: string;
  user_id?: string;
};

export type FlagsFilters = QueryFilters<
  {
    user_id?:
      | RequireOnlyOne<Pick<QueryFilter<FlagsFiltersOptions['user_id']>, '$eq' | '$in'>>
      | PrimitiveFilter<FlagsFiltersOptions['user_id']>;
  } & {
    message_id?:
      | RequireOnlyOne<Pick<QueryFilter<FlagsFiltersOptions['message_id']>, '$eq' | '$in'>>
      | PrimitiveFilter<FlagsFiltersOptions['message_id']>;
  } & {
    message_user_id?:
      | RequireOnlyOne<Pick<QueryFilter<FlagsFiltersOptions['message_user_id']>, '$eq' | '$in'>>
      | PrimitiveFilter<FlagsFiltersOptions['message_user_id']>;
  } & {
    channel_cid?:
      | RequireOnlyOne<Pick<QueryFilter<FlagsFiltersOptions['channel_cid']>, '$eq' | '$in'>>
      | PrimitiveFilter<FlagsFiltersOptions['channel_cid']>;
  } & {
    reporter_id?:
      | RequireOnlyOne<Pick<QueryFilter<FlagsFiltersOptions['reporter_id']>, '$eq' | '$in'>>
      | PrimitiveFilter<FlagsFiltersOptions['reporter_id']>;
  } & {
    team?:
      | RequireOnlyOne<Pick<QueryFilter<FlagsFiltersOptions['team']>, '$eq' | '$in'>>
      | PrimitiveFilter<FlagsFiltersOptions['team']>;
  }
>;

export type FlagReportsFiltersOptions = {
  channel_cid?: string;
  is_reviewed?: boolean;
  message_id?: string;
  message_user_id?: string;
  report_id?: string;
  review_result?: string;
  reviewed_by?: string;
  team?: string;
  user_id?: string;
};

export type FlagReportsFilters = QueryFilters<
  {
    report_id?:
      | RequireOnlyOne<Pick<QueryFilter<FlagReportsFiltersOptions['report_id']>, '$eq' | '$in'>>
      | PrimitiveFilter<FlagReportsFiltersOptions['report_id']>;
  } & {
    review_result?:
      | RequireOnlyOne<Pick<QueryFilter<FlagReportsFiltersOptions['review_result']>, '$eq' | '$in'>>
      | PrimitiveFilter<FlagReportsFiltersOptions['review_result']>;
  } & {
    reviewed_by?:
      | RequireOnlyOne<Pick<QueryFilter<FlagReportsFiltersOptions['reviewed_by']>, '$eq' | '$in'>>
      | PrimitiveFilter<FlagReportsFiltersOptions['reviewed_by']>;
  } & {
    user_id?:
      | RequireOnlyOne<Pick<QueryFilter<FlagReportsFiltersOptions['user_id']>, '$eq' | '$in'>>
      | PrimitiveFilter<FlagReportsFiltersOptions['user_id']>;
  } & {
    message_id?:
      | RequireOnlyOne<Pick<QueryFilter<FlagReportsFiltersOptions['message_id']>, '$eq' | '$in'>>
      | PrimitiveFilter<FlagReportsFiltersOptions['message_id']>;
  } & {
    message_user_id?:
      | RequireOnlyOne<Pick<QueryFilter<FlagReportsFiltersOptions['message_user_id']>, '$eq' | '$in'>>
      | PrimitiveFilter<FlagReportsFiltersOptions['message_user_id']>;
  } & {
    channel_cid?:
      | RequireOnlyOne<Pick<QueryFilter<FlagReportsFiltersOptions['channel_cid']>, '$eq' | '$in'>>
      | PrimitiveFilter<FlagReportsFiltersOptions['channel_cid']>;
  } & {
    team?:
      | RequireOnlyOne<Pick<QueryFilter<FlagReportsFiltersOptions['team']>, '$eq' | '$in'>>
      | PrimitiveFilter<FlagReportsFiltersOptions['team']>;
  } & {
    [Key in keyof Omit<
      FlagReportsFiltersOptions,
      'report_id' | 'user_id' | 'message_id' | 'review_result' | 'reviewed_by'
    >]: RequireOnlyOne<QueryFilter<FlagReportsFiltersOptions[Key]>> | PrimitiveFilter<FlagReportsFiltersOptions[Key]>;
  }
>;

export type BannedUsersFilterOptions = {
  banned_by_id?: string;
  channel_cid?: string;
  created_at?: string;
  reason?: string;
  user_id?: string;
};

export type ChannelFilters = {
  project_id?: string;
  type: ('messaging' | 'team' | 'topic')[];
  limit?: number;
  offset?: number;
  roles?: string[];
  other_roles?: string[];
  banned?: boolean;
  blocked?: boolean;
  include_pinned_messages?: boolean;
  parent_cid?: string;
  parent_id?: string;
  include_parent?: boolean;
};

export type VotesFiltersOptions = {
  is_answer?: boolean;
  option_id?: string;
  user_id?: string;
};

export type ContainsOperator<CustomType = {}> = {
  [Key in keyof CustomType]?: CustomType[Key] extends (infer ContainType)[]
    ?
        | RequireOnlyOne<
            {
              $contains?: ContainType extends object
                ? PrimitiveFilter<RequireAtLeastOne<ContainType>>
                : PrimitiveFilter<ContainType>;
            } & QueryFilter<PrimitiveFilter<ContainType>[]>
          >
        | PrimitiveFilter<PrimitiveFilter<ContainType>[]>
    : RequireOnlyOne<QueryFilter<CustomType[Key]>> | PrimitiveFilter<CustomType[Key]>;
};

export type MessageFilters<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = QueryFilters<
  ContainsOperator<ErmisChatGenerics['messageType']> & {
    text?:
      | RequireOnlyOne<
          {
            $autocomplete?: MessageResponse<ErmisChatGenerics>['text'];
            $q?: MessageResponse<ErmisChatGenerics>['text'];
          } & QueryFilter<MessageResponse<ErmisChatGenerics>['text']>
        >
      | PrimitiveFilter<MessageResponse<ErmisChatGenerics>['text']>;
  } & {
    [Key in keyof Omit<
      MessageResponse<{
        attachmentType: ErmisChatGenerics['attachmentType'];
        channelType: ErmisChatGenerics['channelType'];
        commandType: ErmisChatGenerics['commandType'];
        eventType: ErmisChatGenerics['eventType'];
        messageType: {};
        pollOptionType: ErmisChatGenerics['pollOptionType'];
        pollType: ErmisChatGenerics['pollType'];
        reactionType: ErmisChatGenerics['reactionType'];
        userType: ErmisChatGenerics['userType'];
      }>,
      'text'
    >]?:
      | RequireOnlyOne<
          QueryFilter<
            MessageResponse<{
              attachmentType: ErmisChatGenerics['attachmentType'];
              channelType: ErmisChatGenerics['channelType'];
              commandType: ErmisChatGenerics['commandType'];
              eventType: ErmisChatGenerics['eventType'];
              messageType: {};
              pollOptionType: ErmisChatGenerics['pollOptionType'];
              pollType: ErmisChatGenerics['pollType'];
              reactionType: ErmisChatGenerics['reactionType'];
              userType: ErmisChatGenerics['userType'];
            }>[Key]
          >
        >
      | PrimitiveFilter<
          MessageResponse<{
            attachmentType: ErmisChatGenerics['attachmentType'];
            channelType: ErmisChatGenerics['channelType'];
            commandType: ErmisChatGenerics['commandType'];
            eventType: ErmisChatGenerics['eventType'];
            messageType: {};
            pollOptionType: ErmisChatGenerics['pollOptionType'];
            pollType: ErmisChatGenerics['pollType'];
            reactionType: ErmisChatGenerics['reactionType'];
            userType: ErmisChatGenerics['userType'];
          }>[Key]
        >;
  }
>;

export type PrimitiveFilter<ObjectType> = ObjectType | null;

export type QueryFilter<ObjectType = string> = NonNullable<ObjectType> extends string | number | boolean
  ? {
      $eq?: PrimitiveFilter<ObjectType>;
      $exists?: boolean;
      $gt?: PrimitiveFilter<ObjectType>;
      $gte?: PrimitiveFilter<ObjectType>;
      $in?: PrimitiveFilter<ObjectType>[];
      $lt?: PrimitiveFilter<ObjectType>;
      $lte?: PrimitiveFilter<ObjectType>;
      $ne?: PrimitiveFilter<ObjectType>;
      $nin?: PrimitiveFilter<ObjectType>[];
    }
  : {
      $eq?: PrimitiveFilter<ObjectType>;
      $exists?: boolean;
      $in?: PrimitiveFilter<ObjectType>[];
      $ne?: PrimitiveFilter<ObjectType>;
      $nin?: PrimitiveFilter<ObjectType>[];
    };

export type QueryFilters<Operators = {}> = {
  [Key in keyof Operators]?: Operators[Key];
} & QueryLogicalOperators<Operators>;

export type QueryLogicalOperators<Operators> = {
  $and?: ArrayOneOrMore<QueryFilters<Operators>>;
  $nor?: ArrayOneOrMore<QueryFilters<Operators>>;
  $or?: ArrayTwoOrMore<QueryFilters<Operators>>;
};

export type UserFilters<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = QueryFilters<
  ContainsOperator<ErmisChatGenerics['userType']> & {
    id?:
      | RequireOnlyOne<
          { $autocomplete?: UserResponse<ErmisChatGenerics>['id'] } & QueryFilter<UserResponse<ErmisChatGenerics>['id']>
        >
      | PrimitiveFilter<UserResponse<ErmisChatGenerics>['id']>;
    name?:
      | RequireOnlyOne<
          { $autocomplete?: UserResponse<ErmisChatGenerics>['name'] } & QueryFilter<
            UserResponse<ErmisChatGenerics>['name']
          >
        >
      | PrimitiveFilter<UserResponse<ErmisChatGenerics>['name']>;
    teams?:
      | RequireOnlyOne<{
          $contains?: PrimitiveFilter<string>;
          $eq?: PrimitiveFilter<UserResponse<ErmisChatGenerics>['teams']>;
          $in?: PrimitiveFilter<UserResponse<ErmisChatGenerics>['teams']>;
        }>
      | PrimitiveFilter<UserResponse<ErmisChatGenerics>['teams']>;
    username?:
      | RequireOnlyOne<
          { $autocomplete?: UserResponse<ErmisChatGenerics>['username'] } & QueryFilter<
            UserResponse<ErmisChatGenerics>['username']
          >
        >
      | PrimitiveFilter<UserResponse<ErmisChatGenerics>['username']>;
  } & {
    [Key in keyof Omit<
      UserResponse<{
        attachmentType: ErmisChatGenerics['attachmentType'];
        channelType: ErmisChatGenerics['channelType'];
        commandType: ErmisChatGenerics['commandType'];
        eventType: ErmisChatGenerics['eventType'];
        messageType: ErmisChatGenerics['messageType'];
        pollOptionType: ErmisChatGenerics['pollOptionType'];
        pollType: ErmisChatGenerics['pollType'];
        reactionType: ErmisChatGenerics['reactionType'];
        userType: {};
      }>,
      'id' | 'name' | 'teams' | 'username'
    >]?:
      | RequireOnlyOne<
          QueryFilter<
            UserResponse<{
              attachmentType: ErmisChatGenerics['attachmentType'];
              channelType: ErmisChatGenerics['channelType'];
              commandType: ErmisChatGenerics['commandType'];
              eventType: ErmisChatGenerics['eventType'];
              messageType: ErmisChatGenerics['messageType'];
              pollOptionType: ErmisChatGenerics['pollOptionType'];
              pollType: ErmisChatGenerics['pollType'];
              reactionType: ErmisChatGenerics['reactionType'];
              userType: {};
            }>[Key]
          >
        >
      | PrimitiveFilter<
          UserResponse<{
            attachmentType: ErmisChatGenerics['attachmentType'];
            channelType: ErmisChatGenerics['channelType'];
            commandType: ErmisChatGenerics['commandType'];
            eventType: ErmisChatGenerics['eventType'];
            messageType: ErmisChatGenerics['messageType'];
            pollOptionType: ErmisChatGenerics['pollOptionType'];
            pollType: ErmisChatGenerics['pollType'];
            reactionType: ErmisChatGenerics['reactionType'];
            userType: {};
          }>[Key]
        >;
  }
>;

/**
 * Sort Types
 */

export type BannedUsersSort = BannedUsersSortBase | Array<BannedUsersSortBase>;

export type BannedUsersSortBase = { created_at?: AscDesc };

export type ReactionSort<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> =
  | ReactionSortBase<ErmisChatGenerics>
  | Array<ReactionSortBase<ErmisChatGenerics>>;

export type ReactionSortBase<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = Sort<
  ErmisChatGenerics['reactionType']
> & {
  created_at?: AscDesc;
};

export type ChannelSort = {
  field: string;
  direction: -1 | 1;
}[];

export type PinnedMessagesSort = PinnedMessagesSortBase | Array<PinnedMessagesSortBase>;
export type PinnedMessagesSortBase = { pinned_at?: AscDesc };

export type Sort<T> = {
  [P in keyof T]?: AscDesc;
};

export type UserSort<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> =
  | Sort<UserResponse<ErmisChatGenerics>>
  | Array<Sort<UserResponse<ErmisChatGenerics>>>;

export type MemberSort<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> =
  | Sort<Pick<UserResponse<ErmisChatGenerics>, 'id' | 'created_at' | 'name'>>
  | Array<Sort<Pick<UserResponse<ErmisChatGenerics>, 'id' | 'created_at' | 'name'>>>;

export type SearchMessageSortBase<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = Sort<
  ErmisChatGenerics['messageType']
> & {
  attachments?: AscDesc;
  'attachments.type'?: AscDesc;
  created_at?: AscDesc;
  id?: AscDesc;
  'mentioned_users.id'?: AscDesc;
  parent_id?: AscDesc;
  pinned?: AscDesc;
  relevance?: AscDesc;
  reply_count?: AscDesc;
  text?: AscDesc;
  type?: AscDesc;
  updated_at?: AscDesc;
  'user.id'?: AscDesc;
};

export type SearchMessageSort<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> =
  | SearchMessageSortBase<ErmisChatGenerics>
  | Array<SearchMessageSortBase<ErmisChatGenerics>>;

export type QuerySort<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> =
  | BannedUsersSort
  | ChannelSort
  | SearchMessageSort<ErmisChatGenerics>
  | UserSort<ErmisChatGenerics>;

export type PollSort = PollSortBase | Array<PollSortBase>;

export type PollSortBase = {
  created_at?: AscDesc;
  id?: AscDesc;
  is_closed?: AscDesc;
  name?: AscDesc;
  updated_at?: AscDesc;
};

export type VoteSort = VoteSortBase | Array<VoteSortBase>;

export type VoteSortBase = {
  created_at?: AscDesc;
  id?: AscDesc;
  is_closed?: AscDesc;
  name?: AscDesc;
  updated_at?: AscDesc;
};

/**
 * Base Types
 */

export type Action = {
  name?: string;
  style?: string;
  text?: string;
  type?: string;
  value?: string;
};

export type APNConfig = {
  auth_key?: string;
  auth_type?: string;
  bundle_id?: string;
  development?: boolean;
  enabled?: boolean;
  host?: string;
  key_id?: string;
  notification_template?: string;
  p12_cert?: string;
  team_id?: string;
};

export type AgoraOptions = {
  app_certificate: string;
  app_id: string;
  role_map?: Record<string, string>;
};

export type HMSOptions = {
  app_access_key: string;
  app_secret: string;
  default_role: string;
  default_room_template: string;
  default_region?: string;
  role_map?: Record<string, string>;
};

export type AsyncModerationOptions = {
  callback?: {
    mode?: 'CALLBACK_MODE_NONE' | 'CALLBACK_MODE_REST' | 'CALLBACK_MODE_TWIRP';
    server_url?: string;
  };
  timeout_ms?: number;
};

export type AppSettings = {
  agora_options?: AgoraOptions | null;
  apn_config?: {
    auth_key?: string;
    auth_type?: string;
    bundle_id?: string;
    development?: boolean;
    host?: string;
    key_id?: string;
    notification_template?: string;
    p12_cert?: string;
    team_id?: string;
  };
  async_moderation_config?: AsyncModerationOptions;
  async_url_enrich_enabled?: boolean;
  auto_translation_enabled?: boolean;
  before_message_send_hook_url?: string;
  cdn_expiration_seconds?: number;
  custom_action_handler_url?: string;
  disable_auth_checks?: boolean;
  disable_permissions_checks?: boolean;
  enforce_unique_usernames?: 'no' | 'app' | 'team';
  // all possible file mime types are https://www.iana.org/assignments/media-types/media-types.xhtml
  file_upload_config?: FileUploadConfig;
  firebase_config?: {
    apn_template?: string;
    credentials_json?: string;
    data_template?: string;
    notification_template?: string;
    server_key?: string;
  };
  grants?: Record<string, string[]>;
  hms_options?: HMSOptions | null;
  huawei_config?: {
    id: string;
    secret: string;
  };
  image_moderation_enabled?: boolean;
  image_upload_config?: FileUploadConfig;
  migrate_permissions_to_v2?: boolean;
  multi_tenant_enabled?: boolean;
  permission_version?: 'v1' | 'v2';
  push_config?: {
    offline_only?: boolean;
    version?: string;
  };
  reminders_interval?: number;
  revoke_tokens_issued_before?: string | null;
  sns_key?: string;
  sns_secret?: string;
  sns_topic_arn?: string;
  sqs_key?: string;
  sqs_secret?: string;
  sqs_url?: string;
  video_provider?: string;
  webhook_events?: Array<string> | null;
  webhook_url?: string;
  xiaomi_config?: {
    package_name: string;
    secret: string;
  };
};

export type Attachment<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> =
  ErmisChatGenerics['attachmentType'] & {
    // main fields for ermis.
    id?: string;
    thumb_url?: string;
    content_disposition?: string;
    content_length?: number;
    content_type?: string;
    updated_at?: string;
    created_at?: string;
    message_id?: string;
    file_name?: string;
    url?: string;
    cid?: string;
    user_id?: string;

    // old fields.
    actions?: Action[];
    asset_url?: string;
    author_icon?: string;
    author_link?: string;
    author_name?: string;
    color?: string;
    duration?: number;
    fallback?: string;
    fields?: Field[];
    file_size?: number | string;
    footer?: string;
    footer_icon?: string;
    giphy?: GiphyData;
    image_url?: string;
    mime_type?: string;
    og_scrape_url?: string;
    original_height?: number;
    original_width?: number;
    pretext?: string;
    text?: string;
    title?: string;
    title_link?: string;
    type?: string;
    waveform_data?: Array<number>;
  };

export type BlockList = {
  name: string;
  words: string[];
};

export type ChannelConfig<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = ChannelConfigFields &
  CreatedAtUpdatedAt & {
    commands?: CommandVariants<ErmisChatGenerics>[];
  };

export type ChannelConfigAutomod = '' | 'AI' | 'disabled' | 'simple';

export type ChannelConfigAutomodBehavior = '' | 'block' | 'flag';

export type ChannelConfigAutomodThresholds = null | {
  explicit?: { block?: number; flag?: number };
  spam?: { block?: number; flag?: number };
  toxic?: { block?: number; flag?: number };
};

export type ChannelConfigFields = {
  reminders: boolean;
  automod?: ChannelConfigAutomod;
  automod_behavior?: ChannelConfigAutomodBehavior;
  automod_thresholds?: ChannelConfigAutomodThresholds;
  blocklist_behavior?: ChannelConfigAutomodBehavior;
  connect_events?: boolean;
  custom_events?: boolean;
  mark_messages_pending?: boolean;
  max_message_length?: number;
  message_retention?: string;
  mutes?: boolean;
  name?: string;
  polls?: boolean;
  push_notifications?: boolean;
  quotes?: boolean;
  reactions?: boolean;
  read_events?: boolean;
  replies?: boolean;
  search?: boolean;
  typing_events?: boolean;
  uploads?: boolean;
  url_enrichment?: boolean;
};

export type ChannelConfigWithInfo<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> =
  ChannelConfigFields &
    CreatedAtUpdatedAt & {
      commands?: CommandResponse<ErmisChatGenerics>[];
    };

export type ChannelData<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> =
  ErmisChatGenerics['channelType'] & {
    members?: string[];
    name?: string;
    is_pinned?: boolean;
  };

export type ChannelMembership<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = {
  banned?: boolean;
  channel_role?: Role;
  created_at?: string;
  is_moderator?: boolean;
  notifications_muted?: boolean;
  role?: string;
  shadow_banned?: boolean;
  status?: string;
  updated_at?: string;
  user?: UserResponse<ErmisChatGenerics>;
};

export type ChannelMute<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = {
  user: UserResponse<ErmisChatGenerics>;
  channel?: ChannelResponse<ErmisChatGenerics>;
  created_at?: string;
  expires?: string;
  updated_at?: string;
};

export type PushProvider = 'apn' | 'firebase' | 'huawei' | 'xiaomi';

export type PushProviderConfig = PushProviderCommon &
  PushProviderID &
  PushProviderAPN &
  PushProviderFirebase &
  PushProviderHuawei &
  PushProviderXiaomi;

export type PushProviderID = {
  name: string;
  type: PushProvider;
};

export type PushProviderCommon = {
  created_at: string;
  updated_at: string;
  description?: string;
  disabled_at?: string;
  disabled_reason?: string;
};

export type PushProviderAPN = {
  apn_auth_key?: string;
  apn_auth_type?: 'token' | 'certificate';
  apn_development?: boolean;
  apn_host?: string;
  apn_key_id?: string;
  apn_notification_template?: string;
  apn_p12_cert?: string;
  apn_team_id?: string;
  apn_topic?: string;
};

export type PushProviderFirebase = {
  firebase_apn_template?: string;
  firebase_credentials?: string;
  firebase_data_template?: string;
  firebase_notification_template?: string;
  firebase_server_key?: string;
};

export type PushProviderHuawei = {
  huawei_app_id?: string;
  huawei_app_secret?: string;
};

export type PushProviderXiaomi = {
  xiaomi_package_name?: string;
  xiaomi_secret?: string;
};

export type CommandVariants<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> =
  | 'all'
  | 'ban'
  | 'fun_set'
  | 'giphy'
  | 'moderation_set'
  | 'mute'
  | 'unban'
  | 'unmute'
  | ErmisChatGenerics['commandType'];

export type Configs<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = Record<
  string,
  ChannelConfigWithInfo<ErmisChatGenerics> | undefined
>;

export type ConnectionOpen<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = {
  connection_id: string;
  cid?: string;
  created_at?: string;
  me?: OwnUserResponse<ErmisChatGenerics>;
  type?: string;
};

export type CreatedAtUpdatedAt = {
  created_at: string;
  updated_at: string;
};

export type Device<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = DeviceFields & {
  provider?: string;
  user?: UserResponse<ErmisChatGenerics>;
  user_id?: string;
};

export type BaseDeviceFields = {
  id: string;
  push_provider: PushProvider;
  push_provider_name?: string;
};

export type DeviceFields = BaseDeviceFields & {
  created_at: string;
  disabled?: boolean;
  disabled_reason?: string;
};

export type EndpointName =
  | 'Connect'
  | 'LongPoll'
  | 'DeleteFile'
  | 'DeleteImage'
  | 'DeleteMessage'
  | 'DeleteUser'
  | 'DeleteUsers'
  | 'DeactivateUser'
  | 'ExportUser'
  | 'DeleteReaction'
  | 'UpdateChannel'
  | 'UpdateChannelPartial'
  | 'UpdateMessage'
  | 'UpdateMessagePartial'
  | 'GetMessage'
  | 'GetManyMessages'
  | 'UpdateUsers'
  | 'UpdateUsersPartial'
  | 'CreateGuest'
  | 'GetOrCreateChannel'
  | 'StopWatchingChannel'
  | 'QueryChannels'
  | 'Search'
  | 'QueryUsers'
  | 'QueryMembers'
  | 'QueryBannedUsers'
  | 'QueryFlags'
  | 'QueryMessageFlags'
  | 'GetReactions'
  | 'GetReplies'
  | 'GetPinnedMessages'
  | 'Ban'
  | 'Unban'
  | 'MuteUser'
  | 'MuteChannel'
  | 'UnmuteChannel'
  | 'UnmuteUser'
  | 'RunMessageAction'
  | 'SendEvent'
  | 'SendUserCustomEvent'
  | 'MarkRead'
  | 'MarkChannelsRead'
  | 'SendMessage'
  | 'ImportChannelMessages'
  | 'UploadFile'
  | 'UploadImage'
  | 'UpdateApp'
  | 'GetApp'
  | 'CreateDevice'
  | 'DeleteDevice'
  | 'SendReaction'
  | 'Flag'
  | 'Unflag'
  | 'Unblock'
  | 'QueryFlagReports'
  | 'FlagReportReview'
  | 'CreateChannelType'
  | 'DeleteChannel'
  | 'DeleteChannels'
  | 'DeleteChannelType'
  | 'GetChannelType'
  | 'ListChannelTypes'
  | 'ListDevices'
  | 'TruncateChannel'
  | 'UpdateChannelType'
  | 'CheckPush'
  | 'PrivateSubmitModeration'
  | 'ReactivateUser'
  | 'HideChannel'
  | 'ShowChannel'
  | 'CreatePermission'
  | 'UpdatePermission'
  | 'GetPermission'
  | 'DeletePermission'
  | 'ListPermissions'
  | 'CreateRole'
  | 'DeleteRole'
  | 'ListRoles'
  | 'ListCustomRoles'
  | 'Sync'
  | 'TranslateMessage'
  | 'CreateCommand'
  | 'GetCommand'
  | 'UpdateCommand'
  | 'DeleteCommand'
  | 'ListCommands'
  | 'CreateBlockList'
  | 'UpdateBlockList'
  | 'GetBlockList'
  | 'ListBlockLists'
  | 'DeleteBlockList'
  | 'ExportChannels'
  | 'GetExportChannelsStatus'
  | 'CheckSQS'
  | 'GetRateLimits'
  | 'CreateSegment'
  | 'GetSegment'
  | 'QuerySegments'
  | 'UpdateSegment'
  | 'DeleteSegment'
  | 'CreateCampaign'
  | 'GetCampaign'
  | 'ListCampaigns'
  | 'UpdateCampaign'
  | 'DeleteCampaign'
  | 'ScheduleCampaign'
  | 'StopCampaign'
  | 'ResumeCampaign'
  | 'TestCampaign'
  | 'GetOG'
  | 'GetTask'
  | 'ExportUsers'
  | 'CreateImport'
  | 'CreateImportURL'
  | 'GetImport'
  | 'ListImports'
  | 'UpsertPushProvider'
  | 'DeletePushProvider'
  | 'ListPushProviders'
  | 'CreatePoll';

export type Field = {
  short?: boolean;
  title?: string;
  value?: string;
};

export type FileUploadConfig = {
  allowed_file_extensions?: string[] | null;
  allowed_mime_types?: string[] | null;
  blocked_file_extensions?: string[] | null;
  blocked_mime_types?: string[] | null;
  size_limit?: number | null;
};

export type FirebaseConfig = {
  apn_template?: string;
  credentials_json?: string;
  data_template?: string;
  enabled?: boolean;
  notification_template?: string;
  server_key?: string;
};

type GiphyVersionInfo = {
  height: string;
  url: string;
  width: string;
  frames?: string;
  size?: string;
};

type GiphyVersions =
  | 'original'
  | 'fixed_height'
  | 'fixed_height_still'
  | 'fixed_height_downsampled'
  | 'fixed_width'
  | 'fixed_width_still'
  | 'fixed_width_downsampled';

type GiphyData = {
  [key in GiphyVersions]: GiphyVersionInfo;
};

export type HuaweiConfig = {
  enabled?: boolean;
  id?: string;
  secret?: string;
};

export type XiaomiConfig = {
  enabled?: boolean;
  package_name?: string;
  secret?: string;
};

export type LiteralStringForUnion = string & {};

export type LogLevel = 'info' | 'error' | 'warn';

export type Logger = (logLevel: LogLevel, message: string, extraData?: Record<string, unknown>) => void;

export type Message<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = Partial<
  MessageBase<ErmisChatGenerics>
> & {
  id?: string;
  mentioned_all?: boolean;
  mentioned_users?: string[];
  cid?: string;
  forward_cid?: string;
  forward_message_id?: string;
  poll_type?: string; // single | multiple
  poll_choices?: string[];
  sticker_url?: string;
};

export type EditMessage = {
  text: string;
  mentioned_all?: boolean;
  mentioned_users?: string[];
};

export type PollMessage = {
  id?: string;
  text: string;
  poll_type: string; // single | multiple
  poll_choices: string[];
};

export type MessageBase<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> =
  ErmisChatGenerics['messageType'] & {
    id: string;
    attachments?: Attachment<ErmisChatGenerics>[];
    html?: string;
    mml?: string;
    parent_id?: string;
    pin_expires?: string | null;
    pinned?: boolean;
    pinned_at?: string | null;
    poll_id?: string;
    quoted_message_id?: string;
    show_in_channel?: boolean;
    silent?: boolean;
    text?: string;
    user?: UserResponse<ErmisChatGenerics> | null;
    user_id?: string;
  };

export type MessageLabel = 'deleted' | 'ephemeral' | 'error' | 'regular' | 'reply' | 'system';

export type SendMessageOptions = {
  force_moderation?: boolean;
  is_pending_message?: boolean;
  keep_channel_hidden?: boolean;
  pending?: boolean;
  pending_message_metadata?: Record<string, string>;
  skip_enrich_url?: boolean;
  skip_push?: boolean;
};

export type Mute<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = {
  created_at: string;
  target: UserResponse<ErmisChatGenerics>;
  updated_at: string;
  user: UserResponse<ErmisChatGenerics>;
};

export type PartialUpdateChannel<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = {
  set?: Partial<ChannelResponse<ErmisChatGenerics>>;
  unset?: Array<keyof ChannelResponse<ErmisChatGenerics>>;
};

export type MessageUpdatableFields<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = Omit<
  MessageResponse<ErmisChatGenerics>,
  'cid' | 'created_at' | 'updated_at' | 'deleted_at' | 'user' | 'user_id'
>;

export type PendingMessageResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = {
  message: MessageResponse<ErmisChatGenerics>;
  pending_message_metadata?: Record<string, string>;
};

export type PermissionAPIObject = {
  action?: string;
  condition?: object;
  custom?: boolean;
  description?: string;
  id?: string;
  level?: string;
  name?: string;
  owner?: boolean;
  same_team?: boolean;
  tags?: string[];
};

export type PermissionObject = {
  action?: 'Deny' | 'Allow';
  name?: string;
  owner?: boolean;
  priority?: number;
  resources?: string[];
  roles?: string[];
};

export type Policy = {
  action?: 0 | 1;
  created_at?: string;
  name?: string;
  owner?: boolean;
  priority?: number;
  resources?: string[];
  roles?: string[] | null;
  updated_at?: string;
};

export type RateLimitsInfo = {
  limit: number;
  remaining: number;
  reset: number;
};

export type RateLimitsMap = Record<EndpointName, RateLimitsInfo>;

export type Reaction<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> =
  ErmisChatGenerics['reactionType'] & {
    type: string;
    message_id?: string;
    score?: number;
    user?: UserResponse<ErmisChatGenerics> | null;
    user_id?: string;
  };

export type SearchPayload<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = Omit<
  SearchOptions<ErmisChatGenerics>,
  'sort'
> & {
  client_id?: string;
  connection_id?: string;
  filter_conditions?: ChannelFilters;
  message_filter_conditions?: MessageFilters<ErmisChatGenerics>;
  query?: string;
  sort?: Array<{
    direction: AscDesc;
    field: keyof SearchMessageSortBase<ErmisChatGenerics>;
  }>;
};

export type TokenOrProvider = null | string | TokenProvider | undefined;

export type TokenProvider = () => Promise<string>;

export type TranslationLanguages =
  | ''
  | 'af'
  | 'am'
  | 'ar'
  | 'az'
  | 'bg'
  | 'bn'
  | 'bs'
  | 'cs'
  | 'da'
  | 'de'
  | 'el'
  | 'en'
  | 'es'
  | 'es-MX'
  | 'et'
  | 'fa'
  | 'fa-AF'
  | 'fi'
  | 'fr'
  | 'fr-CA'
  | 'ha'
  | 'he'
  | 'hi'
  | 'hr'
  | 'hu'
  | 'id'
  | 'it'
  | 'ja'
  | 'ka'
  | 'ko'
  | 'lt'
  | 'lv'
  | 'ms'
  | 'nl'
  | 'no'
  | 'pl'
  | 'ps'
  | 'pt'
  | 'ro'
  | 'ru'
  | 'sk'
  | 'sl'
  | 'so'
  | 'sq'
  | 'sr'
  | 'sv'
  | 'sw'
  | 'ta'
  | 'th'
  | 'tl'
  | 'tr'
  | 'uk'
  | 'ur'
  | 'vi'
  | 'zh'
  | 'zh-TW';

export type User<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = ErmisChatGenerics['userType'] & {
  id: string;
  name?: string;
  avatar?: string;
  about_me?: string;
  email?: string;
  phone?: string;
};

export type TaskResponse = {
  task_id: string;
};

export type DeleteType = 'soft' | 'hard' | 'pruning';

/*
  DeleteUserOptions specifies a collection of one or more `user_ids` to be deleted.

  `user`:
    - soft: marks user as deleted and retains all user data
    - pruning: marks user as deleted and nullifies user information
    - hard: deletes user completely - this requires hard option for messages and conversation as well
  `conversations`:
    - soft: marks all conversation channels as deleted (same effect as Delete Channels with 'hard' option disabled)
    - hard: deletes channel and all its data completely including messages (same effect as Delete Channels with 'hard' option enabled)
  `messages`:
    - soft: marks all user messages as deleted without removing any related message data
    - pruning: marks all user messages as deleted, nullifies message information and removes some message data such as reactions and flags
    - hard: deletes messages completely with all related information
  `new_channel_owner_id`: any channels owned by the hard-deleted user will be transferred to this user ID
 */
export type DeleteUserOptions = {
  conversations?: Exclude<DeleteType, 'pruning'>;
  messages?: DeleteType;
  new_channel_owner_id?: string;
  user?: DeleteType;
};

export type SegmentType = 'channel' | 'user';

export type SegmentData = {
  all_sender_channels?: boolean;
  all_users?: boolean;
  description?: string;
  filter?: {};
  name?: string;
};

export type SegmentResponse = {
  created_at: string;
  deleted_at: string;
  id: string;
  locked: boolean;
  size: number;
  task_id: string;
  type: SegmentType;
  updated_at: string;
} & SegmentData;

export type Pager = {
  limit?: number;
  next?: string;
  prev?: string;
};

export type CampaignSort = {
  field: string;
  direction?: number;
}[];

export type CampaignQueryOptions = {
  limit?: number;
  next?: string;
  prev?: string;
  sort?: CampaignSort;
};

export type CampaignData = {
  channel_template?: {
    type: string;
    custom?: {};
    id?: string;
    members?: string[];
  };
  create_channels?: boolean;
  deleted_at?: string;
  description?: string;
  id?: string | null;
  message_template?: {
    text: string;
    attachments?: Attachment[];
    custom?: {};
    poll_id?: string;
  };
  name?: string;
  segment_ids?: string[];
  sender_id?: string;
  skip_push?: boolean;
  skip_webhook?: boolean;
  user_ids?: string[];
};

export type CampaignStats = {
  progress?: number;
  stats_channels_created?: number;
  stats_completed_at?: string;
  stats_messages_sent?: number;
  stats_started_at?: string;
};
export type TruncateOptions<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = {
  hard_delete?: boolean;
  message?: Message<ErmisChatGenerics>;
  skip_push?: boolean;
  truncated_at?: Date;
  user?: UserResponse<ErmisChatGenerics>;
  user_id?: string;
};

export type ImportTaskHistory = {
  created_at: string;
  next_state: string;
  prev_state: string;
};

export type ImportTask = {
  created_at: string;
  history: ImportTaskHistory[];
  id: string;
  path: string;
  state: string;
  updated_at: string;
  result?: UR;
  size?: number;
};

export type MessageSetType = 'latest' | 'current' | 'new';

export type CreateCallOptions<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = {
  id: string;
  type: string;
  options?: UR;
  user?: UserResponse<ErmisChatGenerics> | null;
  user_id?: string;
};

export type HMSCall = {
  room: string;
};

export type AgoraCall = {
  channel: string;
};

export type Call = {
  id: string;
  provider: string;
  agora?: AgoraCall;
  hms?: HMSCall;
};

export type CreateCallResponse = APIResponse & {
  call: Call;
  token: string;
  agora_app_id?: string;
  agora_uid?: number;
};

type ErrorResponseDetails = {
  code: number;
  messages: string[];
};

export type APIErrorResponse = {
  code: number;
  duration: string;
  message: string;
  more_info: string;
  StatusCode: number;
  details?: ErrorResponseDetails;
};

export class ErrorFromResponse<T> extends Error {
  code?: number;
  response?: AxiosResponse<T>;
  status?: number;
}

export type PollResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> =
  ErmisChatGenerics['pollType'] & {
    answers_count: number;
    created_at: string;
    created_by: UserResponse<ErmisChatGenerics> | null;
    created_by_id: string;
    enforce_unique_vote: boolean;
    id: string;
    latest_answers: PollVote<ErmisChatGenerics>[];
    latest_votes_by_option: Record<string, PollVote<ErmisChatGenerics>[]>;
    max_votes_allowed: number;
    name: string;
    options: PollOption<ErmisChatGenerics>[];
    updated_at: string;
    vote_count: number;
    vote_counts_by_option: Record<string, number>;
    allow_answers?: boolean;
    allow_user_suggested_options?: boolean;
    channel?: ChannelAPIResponse<ErmisChatGenerics> | null;
    cid?: string;
    description?: string;
    is_closed?: boolean;
    own_votes?: PollVote<ErmisChatGenerics>[];
    voting_visibility?: VotingVisibility;
  };

export type PollOption<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = {
  created_at: string;
  id: string;
  poll_id: string;
  text: string;
  updated_at: string;
  vote_count: number;
  votes?: PollVote<ErmisChatGenerics>[];
};

export enum VotingVisibility {
  anonymous = 'anonymous',
  public = 'public',
}

export type PollOptionData<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> =
  ErmisChatGenerics['pollType'] & {
    text: string;
    id?: string;
    position?: number;
  };

export type CreatePollOptionAPIResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = {
  poll_option: PollOptionResponse<ErmisChatGenerics>;
};

export type PollOptionResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> =
  ErmisChatGenerics['pollType'] & {
    created_at: string;
    id: string;
    poll_id: string;
    position: number;
    text: string;
    updated_at: string;
    vote_count: number;
    votes?: PollVote<ErmisChatGenerics>[];
  };

export type PollVote<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = {
  created_at: string;
  id: string;
  is_answer: boolean;
  poll_id: string;
  user_id: string;
  answer_text?: string;
  option_id?: string;
  user?: UserResponse<ErmisChatGenerics>;
};

/*
export type UsersResponse_OLD = {
  data: Array<UserResponse>;
  count: number;
  total: number;
  page: number;
  page_count: number;
};
*/

export type UsersResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = {
  data: Array<UserResponse<ErmisChatGenerics>>;
  count: number;
  total: number;
  page: number;
  page_count: number;
};

/*
 ** Chain Project Response
 */
export type Project = {
  project_name: string;
  project_id: string;
  display: string;
  description: string;
  image?: string;
};
export type UserWithProjectsResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = {
  client_name: string;
  client_id: string;
  client_image?: string;
  projects: Project[];
};
export type ChainProjectResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = {
  chain_id: number;
  clients: UserWithProjectsResponse<ErmisChatGenerics>[];
};

export type AttachmentResponse<ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics> = APIResponse & {
  attachments: Attachment<ErmisChatGenerics>[];
};
export class ExtendAxiosError<T = any> extends AxiosError<T> {}

export type SignalData = {
  cid?: string;
  is_video?: boolean;
  action?: string;
  signal?: Object;
  metadata?: Object;
};

export enum CallAction {
  CREATE_CALL = 'create-call',
  ACCEPT_CALL = 'accept-call',
  SIGNAL_CALL = 'signal-call',
  CONNECT_CALL = 'connect-call',
  HEALTH_CALL = 'health-call',
  END_CALL = 'end-call',
  REJECT_CALL = 'reject-call',
  MISS_CALL = 'miss-call',
  UPGRADE_CALL = 'upgrade-call',
}

export enum CallStatus {
  RINGING = 'ringing',
  ENDED = 'ended',
  CONNECTED = 'connected',
  ERROR = 'error',
}

export type CallEventType = 'incoming' | 'outgoing';

export type CallEventData = {
  type: CallEventType;
  callType: string;
  cid: string;
  callerInfo: UserCallInfo | undefined;
  receiverInfo: UserCallInfo | undefined;
  metadata?: Object;
};

export type UserCallInfo = {
  id: string;
  name?: string;
  avatar?: string;
};

export type Metadata = {
  address?: string;
};

export type INodeCall = {
  connect: (address: string) => Promise<void>;
  acceptConnection: () => Promise<void>;
  sendControlFrame: (packet: Uint8Array) => Promise<void>;
  sendAudioFrame: (packet: Uint8Array) => Promise<void>; // audio
  sendFrame: (packet: Uint8Array) => Promise<void>; // video delta
  beginWithGop: (packet: Uint8Array) => Promise<void>; // video key
  asyncRecv: () => Promise<Uint8Array>;
};

export type VideoConfig = {
  codec: string;
  codedWidth: number;
  codedHeight: number;
  frameRate?: number;
  orientation?: number;
  rotation?: number;
  description?: any;
};

export type AudioConfig = {
  codec: string;
  sampleRate: number;
  numberOfChannels: number;
  description?: string;
};

export type TransceiverState = {
  audio_enable: boolean;
  video_enable: boolean;
};

export interface IMediaReceiverEvents {
  onConnected?: () => void;
  onTransceiverState?: (state: any) => void;
  onRequestConfig?: () => void;
  onRequestKeyFrame?: () => void;
  onEndCall?: () => void;
}

export enum FRAME_TYPE {
  VIDEO_CONFIG = 0,
  AUDIO_CONFIG = 1,
  VIDEO_KEY = 2,
  VIDEO_DELTA = 3,
  AUDIO = 4,
  ORIENTATION = 5,
  CONNECTED = 6,
  TRANSCEIVER_STATE = 7,
  REQUEST_CONFIG = 8,
  REQUEST_KEY_FRAME = 9,
  END_CALL = 10,
}
