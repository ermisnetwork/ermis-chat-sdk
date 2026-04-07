import React, { useState, useMemo } from 'react';
import { formatRelativeDate, extractDomain, isImagePreloaded, preloadImage } from '../../utils';
import type { AttachmentItem } from '../../types';

export const LinkListItem: React.FC<{ item: AttachmentItem }> = React.memo(({ item }) => {
  const displayUrl = item.og_scrape_url || item.title_link || item.url;
  const domain = extractDomain(displayUrl);

  // Preload link preview image if available
  const imgSrc = item.image_url;
  const alreadyCached = imgSrc ? isImagePreloaded(imgSrc) : true;
  const [imgLoaded, setImgLoaded] = useState(alreadyCached);
  const imgRef = React.useRef<HTMLImageElement>(null);

  useMemo(() => { if (imgSrc) preloadImage(imgSrc); }, [imgSrc]);

  React.useEffect(() => {
    if (!imgLoaded && imgRef.current?.complete) {
      setImgLoaded(true);
    }
  }, [imgLoaded, imgSrc]);

  return (
    <a
      className="ermis-channel-info__link-item"
      href={displayUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="ermis-channel-info__link-icon">
        {imgSrc ? (
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {!imgLoaded && <div className="ermis-channel-info__media-shimmer" style={{ borderRadius: '8px' }} />}
            <img
              ref={imgRef}
              src={imgSrc}
              alt=""
              className="ermis-channel-info__link-preview-img"
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}
            />
          </div>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        )}
      </div>
      <div className="ermis-channel-info__link-content">
        <span className="ermis-channel-info__link-title">
          {item.title || item.file_name || domain}
        </span>
        <span className="ermis-channel-info__link-domain">{domain}</span>
      </div>
      <span className="ermis-channel-info__link-date">{formatRelativeDate(item.created_at)}</span>
    </a>
  );
}, (prev, next) => prev.item.id === next.item.id);
(LinkListItem as any).displayName = 'LinkListItem';
