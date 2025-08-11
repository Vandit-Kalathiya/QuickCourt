import React from 'react';
import Icon from '../../../components/AppIcon';

const Breadcrumb = ({ venueName }) => {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Search', href: '/venue-search-listings' },
    { label: venueName, href: null, current: true }
  ];

  return (
    <nav className="flex items-center space-x-2 text-sm text-text-secondary mb-6">
      {breadcrumbItems?.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          )}
          {item?.current ? (
            <span className="text-foreground font-medium truncate max-w-xs">
              {item?.label}
            </span>
          ) : (
            <a
              href={item?.href}
              className="hover:text-primary transition-colors"
            >
              {item?.label}
            </a>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;