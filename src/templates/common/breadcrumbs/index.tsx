import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';

import React from 'react';

interface BreadcrumbProps {
  breadcrumbPath: BreadcrumbData[];
  breadcrumbsOverride?: BreadcrumbData[];
  label?: string;
  disableAnalytics?: boolean;
  uswds?: boolean;
  wrapping?: boolean;
}

interface BreadcrumbData {
  label: string;
  href: string;
}

const Breadcrumbs = ({
  breadcrumbPath,
  breadcrumbsOverride,
  label = 'Breadcrumb',
  disableAnalytics = false,
  uswds = true,
  wrapping = false,
}: BreadcrumbProps) => {
  const crumbs = breadcrumbsOverride || breadcrumbPath;

  // Convert to the structure that VA component expects.
  const breadcrumbList = JSON.stringify(crumbs);

  return (
    <VaBreadcrumbs
      label={label}
      breadcrumb-list={breadcrumbList}
      disable-analytics={disableAnalytics}
      uswds={uswds}
      wrapping={wrapping}
    />
  );
};

export default Breadcrumbs;
