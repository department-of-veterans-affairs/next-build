import { Breadcrumb, BreadcrumbItem } from "@/types/index";

export function deriveLastBreadcrumbFromPath(
  breadcrumbs: BreadcrumbItem[],
  string: string,
  currentPath: string,
  replaceLastItem: boolean
): BreadcrumbItem[] {
  const last: BreadcrumbItem = {
    uri: currentPath,
    title: string,
    options: []
  };

  if (replaceLastItem) {
    breadcrumbs.splice(breadcrumbs.length - 1, 1, last);
  } else {
    breadcrumbs.push(last);
  }

  return breadcrumbs;
}

export function deriveLcBreadcrumbs(
  breadcrumbs: BreadcrumbItem[],
  string: string,
  currentPath: string,
  titleInclude?: boolean
): BreadcrumbItem[] {
  const filteredCrumbs: BreadcrumbItem[] = breadcrumbs.filter(
    crumb => crumb.uri !== '/resources'
  );

  filteredCrumbs.push({
    uri: currentPath,
    title: 'Resources and support',
    options: []
  });

  if (titleInclude) {
    filteredCrumbs.push({
      uri: currentPath,
      title: string,
      options: []
    });
  }

  return filteredCrumbs;
}


export function transformBreadcrumbs(breadcrumbs) {
  const transformedCrumbs = breadcrumbs.map(crumb => ({
    href: crumb.uri,
    label: crumb.title,
    options: crumb.options
  }));

  return transformedCrumbs
}