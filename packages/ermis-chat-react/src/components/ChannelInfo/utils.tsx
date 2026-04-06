import React from 'react';
import type { MediaTab } from '../../types';

export function getFileIcon(contentType: string, fileName: string): React.ReactNode {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  if (contentType.includes('pdf') || ext === 'pdf') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    );
  }

  if (contentType.includes('zip') || contentType.includes('rar') || contentType.includes('archive') || ['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8v13H3V3h13" />
        <path d="M16 3v5h5" />
        <path d="M10 12h4M10 16h4M10 8h1" />
      </svg>
    );
  }

  // Default file icon
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

export const ROLE_WEIGHTS: Record<string, number> = {
  owner: 4,
  moder: 3,
  member: 2,
  pending: 1,
};

export const MESSAGING_TABS: MediaTab[] = ['media', 'links', 'files'];
export const ALL_TABS: MediaTab[] = ['members', 'media', 'links', 'files'];

export const PENDING_STYLE = { opacity: 0.7, transition: 'opacity 0.15s ease' } as const;
export const READY_STYLE = { opacity: 1, transition: 'opacity 0.15s ease' } as const;
