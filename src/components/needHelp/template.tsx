import {
  VaNeedHelp,
  VaTelephone,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings'

export const NeedHelp = () => {
  return (
    <div className="vads-grid-row vads-u-margin-bottom--8 vads-u-margin-top--8">
      <div className="vads-grid-col-12">
        <VaNeedHelp>
          <div slot="content">
            <p>
              Call us at <VaTelephone contact="8008271000" />. We’re here Monday
              through Friday, 8:00 a.m to 9:00 p.m ET. If you have hearing loss,
              call <VaTelephone contact="711" tty="true" />.
            </p>
          </div>
        </VaNeedHelp>
      </div>
    </div>
  )
}
