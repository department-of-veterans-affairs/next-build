import { Breadcrumb } from "@/types/breadcrumbTypes";

export function deriveLastBreadcrumbFromPath(
  breadcrumbs: Breadcrumb[],
  string: string,
  currentPath: string,
  replaceLastItem: boolean = false
): Breadcrumb[] {
  const last: Breadcrumb = {
    url: { path: currentPath, routed: true },
    text: string,
  };

  if (replaceLastItem) {
    breadcrumbs.splice(breadcrumbs.length - 1, 1, last);
  } else {
    breadcrumbs.push(last);
  }

  return breadcrumbs;
}

export function deriveLcBreadcrumbs(
  breadcrumbs: Breadcrumb[],
  string: string,
  currentPath: string,
  pageTitle?: string
): Breadcrumb[] {
  const filteredCrumbs: Breadcrumb[] = breadcrumbs.filter(
    crumb => crumb.url.path !== '/resources'
  );

  filteredCrumbs.push({
    url: { path: '/resources', routed: false },
    text: 'Resources and support',
  });

  if (pageTitle) {
    filteredCrumbs.push({
      url: { path: currentPath, routed: true },
      text: string,
    });
  }

  return filteredCrumbs;
}
