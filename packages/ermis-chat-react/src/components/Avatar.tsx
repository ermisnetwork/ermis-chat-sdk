import React, { useMemo } from 'react';

export type AvatarProps = {
  /** Image URL */
  image?: string | null;
  /** Name used for fallback initials */
  name?: string;
  /** Size in pixels (default: 36) */
  size?: number;
  /** Additional CSS class name */
  className?: string;
};

/**
 * Extracts 1–2 initials from a name.
 */
function getInitials(name?: string): string {
  if (!name) return '?';
  if (name.startsWith('0x')) return '0x';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
}

/**
 * Avatar component with image or initial fallback.
 */
export const Avatar: React.FC<AvatarProps> = React.memo(({
  image,
  name,
  size = 36,
  className,
}) => {
  const initials = useMemo(() => getInitials(name), [name]);

  const style = useMemo<React.CSSProperties>(() => ({
    width: size,
    height: size,
    minWidth: size,
    fontSize: size * 0.4,
  }), [size]);

  if (image) {
    return (
      <img
        className={`ermis-avatar${className ? ` ${className}` : ''}`}
        src={image}
        alt={name || 'Avatar'}
        style={style}
      />
    );
  }

  return (
    <div
      className={`ermis-avatar ermis-avatar--fallback${className ? ` ${className}` : ''}`}
      style={style}
      title={name}
    >
      {initials}
    </div>
  );
});

Avatar.displayName = 'Avatar';
