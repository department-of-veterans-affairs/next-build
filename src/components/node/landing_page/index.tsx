import Link from 'next/link'

// Output a landing_page node as a link to itself, plus its teaser text.
const BenefitsHubLink = ({ node }) => {
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
// Only here to meet required default rules.
export default BenefitsHubLink
