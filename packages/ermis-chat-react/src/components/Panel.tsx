import React, { useEffect, useRef } from 'react';

export type PanelProps = {
  /** Whether the panel is visible */
  isOpen: boolean;
  /** Called when user clicks the back button */
  onClose: () => void;
  /** Panel title shown in the header */
  title?: string;
  /** Panel body content */
  children: React.ReactNode;
  /** Optional header content (replaces default title + back button) */
  headerContent?: React.ReactNode;
  /** Additional CSS class name */
  className?: string;
};

/**
 * Reusable sliding panel component.
 * Slides in from the right to overlay itself on whatever container it's placed in.
 * Use it like a Modal but inside a sidebar — call `isOpen` to show/hide.
 */
export const Panel: React.FC<PanelProps> = React.memo(({
  isOpen,
  onClose,
  title,
  children,
  headerContent,
  className,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus trap: focus the panel when it opens for accessibility
  useEffect(() => {
    if (isOpen && panelRef.current) {
      panelRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div
      ref={panelRef}
      className={`ermis-panel${isOpen ? ' ermis-panel--open' : ''}${className ? ` ${className}` : ''}`}
      tabIndex={-1}
    >
      {headerContent ? (
        headerContent
      ) : (
        <div className="ermis-panel__header">
          <button className="ermis-panel__back" onClick={onClose} aria-label="Back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          {title && <h3 className="ermis-panel__title">{title}</h3>}
        </div>
      )}
      <div className="ermis-panel__body">
        {children}
      </div>
    </div>
  );
});
Panel.displayName = 'Panel';
