import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useChatClient } from '../../hooks/useChatClient';
import { Avatar } from '../Avatar';
import { DefaultChannelInfoTabs } from './ChannelInfoTabs';
import { AddMemberModal } from './AddMemberModal';
import type {
  ChannelInfoProps,
  ChannelInfoHeaderProps,
  ChannelInfoCoverProps,
  ChannelInfoActionsProps
} from '../../types';

export const DefaultChannelInfoHeader: React.FC<ChannelInfoHeaderProps> = React.memo(({ title, onClose }) => {
  return (
    <div className="ermis-channel-info__header">
      <h3 className="ermis-channel-info__title">{title}</h3>
      {onClose && (
        <button className="ermis-channel-info__close" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
});
DefaultChannelInfoHeader.displayName = 'DefaultChannelInfoHeader';

export const DefaultChannelInfoCover: React.FC<ChannelInfoCoverProps> = React.memo(({ channelName, channelImage, channelDescription, AvatarComponent }) => {
  return (
    <div className="ermis-channel-info__cover">
      <AvatarComponent image={channelImage} name={channelName} size={80} className="ermis-channel-info__avatar" />
      <h2 className="ermis-channel-info__name">{channelName}</h2>
      {channelDescription && (
        <p className="ermis-channel-info__description">{channelDescription}</p>
      )}
    </div>
  );
});
DefaultChannelInfoCover.displayName = 'DefaultChannelInfoCover';

export const DefaultChannelInfoActions: React.FC<ChannelInfoActionsProps> = React.memo(({
  onMuteToggle, onSearchClick, onLeaveChannel, onDeleteChannel, isTeamChannel, currentUserRole
}) => {
  return (
    <div className="ermis-channel-info__actions">
      <button className="ermis-channel-info__action-btn" onClick={onMuteToggle}>
        <div className="ermis-channel-info__action-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
        </div>
        <span>Mute</span>
      </button>
      <button className="ermis-channel-info__action-btn" onClick={onSearchClick}>
        <div className="ermis-channel-info__action-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <span>Search</span>
      </button>
      {isTeamChannel && (
        currentUserRole === 'owner' ? (
          <button className="ermis-channel-info__action-btn ermis-channel-info__action-btn--danger" onClick={onDeleteChannel}>
            <div className="ermis-channel-info__action-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6V20a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </div>
            <span>Delete</span>
          </button>
        ) : (
          <button className="ermis-channel-info__action-btn ermis-channel-info__action-btn--danger" onClick={onLeaveChannel}>
            <div className="ermis-channel-info__action-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </div>
            <span>Leave</span>
          </button>
        )
      )}
    </div>
  );
});
DefaultChannelInfoActions.displayName = 'DefaultChannelInfoActions';

export const ChannelInfo: React.FC<ChannelInfoProps> = React.memo((props) => {
  const {
    channel: channelProp,
    className = '',
    AvatarComponent = Avatar,
    onClose,
    title = 'Channel Info',
    HeaderComponent = DefaultChannelInfoHeader,
    CoverComponent = DefaultChannelInfoCover,
    ActionsComponent = DefaultChannelInfoActions,
    TabsComponent = DefaultChannelInfoTabs,
    MemberItemComponent,
    MediaItemComponent,
    LinkItemComponent,
    FileItemComponent,
    EmptyStateComponent,
    LoadingComponent,
    onMuteToggle,
    onSearchClick,
    onLeaveChannel: onLeaveChannelProp,
    onDeleteChannel: onDeleteChannelProp,
    onAddMemberClick,
    onRemoveMember: onRemoveMemberProp,
    onBanMember: onBanMemberProp,
    onUnbanMember: onUnbanMemberProp,
    onPromoteMember: onPromoteMemberProp,
    onDemoteMember: onDemoteMemberProp,
  } = props;

  const { activeChannel, client } = useChatClient();
  const channel = channelProp || activeChannel;

  const currentUserId = client?.userID;
  const currentUserRole = currentUserId ? channel?.state?.members?.[currentUserId]?.channel_role : undefined;

  const handleDeleteChannel = useCallback(async () => {
    if (onDeleteChannelProp) return onDeleteChannelProp();
    if (!channel) return;
    try {
      await channel.delete();
    } catch (e) {
      console.error("Error deleting channel", e);
    }
  }, [channel, onDeleteChannelProp]);

  const handleLeaveChannel = useCallback(async () => {
    if (onLeaveChannelProp) return onLeaveChannelProp();
    if (!channel || !currentUserId) return;
    try {
      await channel.removeMembers([currentUserId]);
    } catch (e) {
      console.error("Error leaving channel", e);
    }
  }, [channel, currentUserId, onLeaveChannelProp]);

  const handleRemoveMember = useCallback(async (memberId: string) => {
    if (onRemoveMemberProp) return onRemoveMemberProp(memberId);
    if (!channel) return;
    try {
      await channel.removeMembers([memberId]);
    } catch (e) {
      console.error("Error removing member", e);
    }
  }, [channel, onRemoveMemberProp]);

  const handleBanMember = useCallback(async (memberId: string) => {
    if (onBanMemberProp) return onBanMemberProp(memberId);
    if (!channel) return;
    try { await channel.banMembers([memberId]); } catch (e) { console.error("Error banning member", e); }
  }, [channel, onBanMemberProp]);

  const handleUnbanMember = useCallback(async (memberId: string) => {
    if (onUnbanMemberProp) return onUnbanMemberProp(memberId);
    if (!channel) return;
    try { await channel.unbanMembers([memberId]); } catch (e) { console.error("Error unbanning member", e); }
  }, [channel, onUnbanMemberProp]);

  const handlePromoteMember = useCallback(async (memberId: string) => {
    if (onPromoteMemberProp) return onPromoteMemberProp(memberId);
    if (!channel) return;
    try { await channel.addModerators([memberId]); } catch (e) { console.error("Error promoting member", e); }
  }, [channel, onPromoteMemberProp]);

  const handleDemoteMember = useCallback(async (memberId: string) => {
    if (onDemoteMemberProp) return onDemoteMemberProp(memberId);
    if (!channel) return;
    try { await channel.demoteModerators([memberId]); } catch (e) { console.error("Error demoting member", e); }
  }, [channel, onDemoteMemberProp]);

  const channelName = channel?.data?.name || channel?.cid || 'Unknown Channel';
  const channelImage = channel?.data?.image as string | undefined;
  const channelDescription = channel?.data?.description as string | undefined;

  // Reactivity for real-time member updates since channel.state.members is mutated in-place by the SDK
  const [memberUpdateCount, setMemberUpdateCount] = useState(0);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  const handleAddMemberClick = useCallback(() => {
    if (onAddMemberClick) return onAddMemberClick();
    setShowAddMemberModal(true);
  }, [onAddMemberClick]);

  useEffect(() => {
    if (!channel) return;
    const updateMembers = () => setMemberUpdateCount(c => c + 1);

    const sub1 = channel.on('member.added', updateMembers);
    const sub2 = channel.on('member.removed', updateMembers);
    const sub3 = channel.on('member.updated', updateMembers);
    const sub4 = channel.on('member.promoted', updateMembers);
    const sub5 = channel.on('member.demoted', updateMembers);
    const sub6 = channel.on('member.banned', updateMembers);
    const sub7 = channel.on('member.unbanned', updateMembers);

    return () => {
      sub1.unsubscribe();
      sub2.unsubscribe();
      sub3.unsubscribe();
      sub4.unsubscribe();
      sub5.unsubscribe();
      sub6.unsubscribe();
      sub7.unsubscribe();
    };
  }, [channel]);

  // Extract members
  const members = useMemo(() => {
    if (!channel?.state?.members) return [];
    return Object.values(channel.state.members);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel?.state?.members, memberUpdateCount]);

  const isTeamChannel = channel?.type === 'team';

  if (!channel) return null;

  return (
    <div className={`ermis-channel-info ${className}`.trim()}>
      <HeaderComponent title={title} onClose={onClose} />

      <CoverComponent
        channelName={channelName}
        channelImage={channelImage}
        channelDescription={channelDescription}
        AvatarComponent={AvatarComponent}
      />

      <ActionsComponent
        onMuteToggle={onMuteToggle}
        onSearchClick={onSearchClick}
        onLeaveChannel={handleLeaveChannel}
        onDeleteChannel={handleDeleteChannel}
        isTeamChannel={isTeamChannel}
        currentUserRole={currentUserRole}
      />

      <TabsComponent
        channel={channel}
        members={members as any}
        AvatarComponent={AvatarComponent}
        currentUserId={currentUserId}
        currentUserRole={currentUserRole}
        onAddMemberClick={isTeamChannel ? handleAddMemberClick : undefined}
        onRemoveMember={handleRemoveMember}
        onBanMember={handleBanMember}
        onUnbanMember={handleUnbanMember}
        onPromoteMember={handlePromoteMember}
        onDemoteMember={handleDemoteMember}
        MemberItemComponent={MemberItemComponent}
        MediaItemComponent={MediaItemComponent}
        LinkItemComponent={LinkItemComponent}
        FileItemComponent={FileItemComponent}
        EmptyStateComponent={EmptyStateComponent}
        LoadingComponent={LoadingComponent}
      />

      {showAddMemberModal && (
        <AddMemberModal
          channel={channel}
          currentMembers={members as any}
          onClose={() => setShowAddMemberModal(false)}
          AvatarComponent={AvatarComponent}
        />
      )}
    </div>
  );
});

ChannelInfo.displayName = 'ChannelInfo';
