export const FOOTER_COLUMNS = {
    PROGRAMS: '1',
    RESOURCES: '2',
    CONNECT: '3',
    CONTACT: '4',
    SUPERLINKS: 'bottom_rail',
};

export const FOOTER_EVENTS = {
    [FOOTER_COLUMNS.PROGRAMS]: 'nav-footer-programs',
    [FOOTER_COLUMNS.RESOURCES]: 'nav-footer-resources',
    [FOOTER_COLUMNS.CONNECT]: 'nav-footer-connect',
    [FOOTER_COLUMNS.CONTACT]: 'nav-footer-contact',
    [FOOTER_COLUMNS.SUPERLINKS]: 'nav-footer-superlinks',
    CRISIS_LINE: 'nav-footer-crisis',
    LANGUAGE_SUPPORT: 'nav-footer-language-support',
};

// Static Footer Content
export const FOOTER_CONTENT = {
    PROGRAMS: 'Veteran programs and services',
    RESOURCES: 'More VA resources',
    CONNECT: 'Get VA updates',
    CONTACT: 'Get answers',
    CRISIS: 'In crisis? Talk to someone now',
    CRISIS_LINE: 'Veterans Crisis Line'
};


export const renderColumns = (columnLinks) => {
    const render = columnLinks.map(column => {
        return (
            <>
                <ul className="va-footer-links">
                    {column.links.map(link => {
                        return (
                            <li key={link.title}>
                                <span className="va-footer-link-text"><a href={link.href}>{link.title}</a></span>
                            </li>
                        )
                    })}
                </ul>
            </>
        )
    });
    return render;
}

export const generateLinkItems = (allColumns) => {
    const linkColumns = Object.keys(allColumns).map(key => {
        return {
            columns: key,
            links: allColumns[key]
        }
    });
    return renderColumns(linkColumns)
}

export const createLinkGroups = (links) => {
    const allGroups = links.reduce((acc, link) => {
        if (!acc[link.column]) {
            acc[link.column] = [];
        }
        acc[link.column].push({
            href: link.href,
            title: link.title
        });
        return acc;
    }, {});
    return generateLinkItems(allGroups);
}