import React, { useState, useEffect, useMemo } from 'react';
import { useChatClient } from '../../hooks/useChatClient';
import type { Channel, ChannelMemberResponse } from '@ermis-network/ermis-chat-sdk';
import { Modal } from '../Modal';

interface AddMemberModalProps {
  channel: Channel;
  currentMembers: ChannelMemberResponse[];
  onClose: () => void;
  AvatarComponent: any;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ channel, currentMembers, onClose, AvatarComponent }) => {
  const { client } = useChatClient();
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [addingUser, setAddingUser] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchUsers = async () => {
      if (!client) return;
      try {
        const response = await client.queryUsers('100', 1);
        if (active && response.data) {
          setUsers(response.data);
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

  const existingMemberIds = useMemo(() => {
    return new Set(currentMembers.map(m => m.user_id));
  }, [currentMembers]);

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase().trim();
    return users.filter(u => {
      if (existingMemberIds.has(u.id)) return false;
      const name = (u.name || '').toLowerCase();
      const id = (u.id || '').toLowerCase();
      return name.includes(term) || id.includes(term);
    });
  }, [search, users, existingMemberIds]);

  const handleAdd = async (userId: string) => {
    try {
      setAddingUser(userId);
      await channel.addMembers([userId]);
      // Remove from visual list locally after add to show feedback
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      console.error('Failed to add member:', err);
    } finally {
      setAddingUser(null);
    }
  };

  return (
    <Modal isOpen onClose={onClose} title="Add Member" maxWidth="480px">
      <div className="ermis-modal-search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />
      </div>

      <div className="ermis-modal-user-list">
        {loading ? (
          <div className="ermis-modal-loading">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="ermis-modal-empty">No users found to add.</div>
        ) : (
          filteredUsers.map(user => (
            <div key={user.id} className="ermis-modal-user-item">
              <AvatarComponent image={user.avatar} name={user.name || user.id} size={36} />
              <div className="ermis-modal-user-info">
                <span className="ermis-modal-user-name">{user.name || user.id}</span>
              </div>
              <button
                className="ermis-modal-add-btn"
                onClick={() => handleAdd(user.id)}
                disabled={addingUser === user.id}
              >
                {addingUser === user.id ? 'Adding...' : 'Add'}
              </button>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};
