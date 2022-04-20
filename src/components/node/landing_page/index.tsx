// Noting that landing_page is Benefit Hub Landing Page.
import Link from 'next/link'

const benefitsHubLink = ({ node }) => {
    if (node) {
        return (
            <>
                <p className="vads-u-margin--0">
                    <strong>
                        <Link
                            href={node.path?.alias ? node.path?.alias : ' '}
                            passHref
                        >
                            <a>{node.field_home_page_hub_label}</a>
                        </Link>
                    </strong>
                </p>
                <p className="vads-u-margin--0">{node.field_teaser_text}</p>
            </>
        )
    }
}

// This should not be the default; we will have a full display eventually.
export default benefitsHubLink
