import React, { useState, useEffect, useMemo, useCallback, useTransition } from 'react';
import { useChatClient } from '../../hooks/useChatClient';
import { Modal } from '../Modal';
import { VList } from 'virtua';
import type { AddMemberModalProps, AddMemberUserItemProps } from '../../types';

/* ---------- Static styles hoisted outside render ---------- */
const LIST_CONTAINER_STYLE: React.CSSProperties = { overflow: 'hidden', height: '400px' };
const VLIST_STYLE: React.CSSProperties = { height: '100%' };
const DISABLED_BTN_STYLE: React.CSSProperties = { opacity: 0.5, cursor: 'not-allowed' };

/* ---------- Default user row ---------- */
const DefaultUserItem: React.FC<AddMemberUserItemProps> = React.memo(({
  user, isExisting, isAdding, onAdd, AvatarComponent,
  addedLabel = 'Added', addingLabel = 'Adding...', addLabel = 'Add',
}) => (
  <div className="ermis-modal-user-item">
    <AvatarComponent image={user.avatar} name={user.name || user.id} size={36} />
    <div className="ermis-modal-user-info">
      <span className="ermis-modal-user-name">{user.name || user.id}</span>
    </div>
    <button
      className={`ermis-modal-add-btn ${isExisting ? 'ermis-modal-add-btn--disabled' : ''}`}
      onClick={() => onAdd(user.id)}
      disabled={isAdding || isExisting}
      style={isExisting ? DISABLED_BTN_STYLE : undefined}
    >
      {isExisting ? addedLabel : (isAdding ? addingLabel : addLabel)}
    </button>
  </div>
));
DefaultUserItem.displayName = 'DefaultUserItem';

/* ---------- Default search input ---------- */
const DefaultSearchInput: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string }> = ({ value, onChange, placeholder }) => (
  <div className="ermis-modal-search">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoFocus
    />
  </div>
);

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  channel,
  currentMembers,
  onClose,
  AvatarComponent,
  title = 'Add Member',
  searchPlaceholder = 'Search by name, email or phone...',
  loadingText = 'Loading users...',
  emptyText = 'No users found.',
  addLabel = 'Add',
  addingLabel = 'Adding...',
  addedLabel = 'Added',
  UserItemComponent,
  SearchInputComponent,
}) => {
  const { client } = useChatClient();
  const [initialUsers, setInitialUsers] = useState<any[]>([]);
  const [remoteUsers, setRemoteUsers] = useState<any[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [isPendingFilter, startTransition] = useTransition();

  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [addingUser, setAddingUser] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState<Set<string>>(new Set());

  const UserRow = UserItemComponent || DefaultUserItem;
  const SearchInput = SearchInputComponent || DefaultSearchInput;

  // Handle immediate input + deferred filter via transition
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchInput(val);
    startTransition(() => {
      setSearch(val);
    });
  }, [startTransition]);

  // 1. Fetch initial 100 users
  useEffect(() => {
    let active = true;
    const fetchUsers = async () => {
      if (!client) return;
      try {
        const response = await client.queryUsers('100', 1);
        if (active && response.data) {
          setInitialUsers(response.data);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchUsers();
    return () => { active = false; };
  }, [client]);

  // 2. Local filter by name/email/phone
  const localFilteredUsers = useMemo(() => {
    if (!search.trim()) return initialUsers;
    const term = search.toLowerCase().trim();
    return initialUsers.filter(u => {
      const email = (u.email || '').toLowerCase();
      const phone = (u.phone || '').toLowerCase();
      const name = (u.name || '').toLowerCase();
      return email.includes(term) || phone.includes(term) || name.includes(term);
    });
  }, [search, initialUsers]);

  // 3. Remote search fallback (with race-condition guard)
  useEffect(() => {
    if (!search.trim() || localFilteredUsers.length > 0) {
      setRemoteUsers([]);
      setIsSearching(false);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await client.searchUsers(1, 25, search.trim());
        if (!cancelled && response.data) {
          setRemoteUsers(response.data);
        }
      } catch (err) {
        console.error('Error searching remote users:', err);
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search, localFilteredUsers.length, client]);

  // 4. Derived state
  const usersToDisplay = (search.trim() && localFilteredUsers.length === 0) ? remoteUsers : localFilteredUsers;
  const isListLoading = loading || isSearching || isPendingFilter;

  const existingMemberIds = useMemo(() => {
    return new Set(currentMembers.map((m: any) => m.user_id));
  }, [currentMembers]);

  const handleAdd = useCallback(async (userId: string) => {
    try {
      setAddingUser(userId);
      await channel.addMembers([userId]);
      setJustAdded(prev => new Set(prev).add(userId));
    } catch (err) {
      console.error('Failed to add member:', err);
    } finally {
      setAddingUser(null);
    }
  }, [channel]);

  return (
    <Modal isOpen onClose={onClose} title={title} maxWidth="480px">
      <SearchInput
        value={searchInput}
        onChange={handleSearchChange}
        placeholder={searchPlaceholder}
      />

      <div className="ermis-modal-user-list" style={LIST_CONTAINER_STYLE}>
        {isListLoading ? (
          <div className="ermis-modal-loading">{loadingText}</div>
        ) : usersToDisplay.length === 0 ? (
          <div className="ermis-modal-empty">{emptyText}</div>
        ) : (
          <VList style={VLIST_STYLE}>
            {usersToDisplay.map(user => (
              <UserRow
                key={user.id}
                user={user}
                isExisting={existingMemberIds.has(user.id) || justAdded.has(user.id)}
                isAdding={addingUser === user.id}
                onAdd={handleAdd}
                AvatarComponent={AvatarComponent}
                addedLabel={addedLabel}
                addingLabel={addingLabel}
                addLabel={addLabel}
              />
            ))}
          </VList>
        )}
      </div>
    </Modal>
  );
};
