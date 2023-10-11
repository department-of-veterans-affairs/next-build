import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { transformBreadcrumbs, deriveLastBreadcrumbFromPath, deriveLcBreadcrumbs } from '@/templates/globals/util/breadcrumbUtils';
import { BreadcrumbItem } from '@/types/index';

interface BreadcrumbProps {
  breadcrumbs?: BreadcrumbItem[];
  breadcrumbsOverride?: BreadcrumbItem[];
  label?: string;
  string?: string;
  disableAnalytics?: boolean;
  uswds?: boolean;
  wrapping?: boolean;
  deriveBreadcrumbsFromUrl?: boolean
  replaceLastItem?: boolean,
  constructLcBreadcrumbs?: boolean,
  title?: string,
  titleInclude?: boolean,
  hideHomeBreadcrumb?: boolean,
  customCrumbHomeText?: string,
  entityPath?: string,
}
const Breadcrumbs = ({
  breadcrumbs,
  breadcrumbsOverride,
  entityPath,
  label,
  string,
  disableAnalytics,
  uswds,
  wrapping,
  deriveBreadcrumbsFromUrl,
  replaceLastItem,
  constructLcBreadcrumbs,
  title,
  titleInclude,
  hideHomeBreadcrumb,
  customCrumbHomeText,
}: BreadcrumbProps) => {

  const breadcrumbData: BreadcrumbItem[] = breadcrumbs
  let crumbs = breadcrumbsOverride || breadcrumbData;


  if (!crumbs) return null;

  if (hideHomeBreadcrumb) {
    if (customCrumbHomeText) {
      crumbs = crumbs.map(crumb => {
        if (crumb.title === 'Home') {
          return { ...crumb, title: customCrumbHomeText };
        }
        return crumb;
      });
    } else {
      crumbs = crumbs.filter(crumb => crumb.title !== 'Home');
    }
  }

  if (deriveBreadcrumbsFromUrl) {
    crumbs = deriveLastBreadcrumbFromPath(breadcrumbData, string, entityPath, replaceLastItem)
  }

  if (constructLcBreadcrumbs) {
    crumbs = deriveLcBreadcrumbs(breadcrumbData, title, entityPath, titleInclude)
  }



  const breadcrumbList = transformBreadcrumbs(crumbs);

  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
      <VaBreadcrumbs
        className={"va-nav-breadcrumbs"}
        breadcrumbList={breadcrumbList}
        label={label}
        uswds={uswds}
        wrapping={wrapping}
        disableAnalytics={disableAnalytics}
      />
    </div>
  );
};

Breadcrumbs.defaultProps = {
  label: 'Breadcrumbs',
  uswds: true,
  string: '',
};

export default Breadcrumbs;
