import React from 'react';
import { render } from '@testing-library/react';
import Breadcrumbs from '.';

describe('Breadcrumbs Component', () => {

  it('should not render <va-breadcrumbs> when no crumbs are provided', () => {
    const { container } = render(<Breadcrumbs />);
    const vaBreadcrumbsElement = container.querySelector('va-breadcrumbs');
    expect(vaBreadcrumbsElement).toBeNull();
  });


  it('should render <va-breadcrumbs> when valid crumbs are provided', () => {
    const breadcrumbsData = [
      { uri: '/test1', title: 'Test1', options: [] }
    ];
    const { container } = render(<Breadcrumbs breadcrumbs={breadcrumbsData} />);
    const vaBreadcrumbsElement = container.querySelector('va-breadcrumbs');
    expect(vaBreadcrumbsElement).not.toBeNull();
  });
});