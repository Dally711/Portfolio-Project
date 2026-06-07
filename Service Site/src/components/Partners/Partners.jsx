import './Partners.css'
import acmeLogo from '../../assets/partners/ACME_Corporation.webp'
import losPollosLogo from '../../assets/partners/Los_Pollos.webp'
import capsuleCorpLogo from '../../assets/partners/capsulcorplogo.png'
import voughtLogo from '../../assets/partners/VoughtIntl.webp'

const partners = [
  {
    name: 'ACME Corporation',
    logo: acmeLogo,
    className: '',
  },
  {
    name: 'Los Pollos',
    logo: losPollosLogo,
    className: '',
  },
  {
    name: 'Capsule Corp',
    logo: capsuleCorpLogo,
    className: 'partner-logo-capsule',
  },
  {
    name: 'Vought International',
    logo: voughtLogo,
    className: '',
  },
]

function Partners() {
  return (
    <section className="partners-band container-fluid" aria-label="Our partners">
      <p>Trusted by our community partners</p>
      <div className="partners-track d-flex align-items-center justify-content-center">
        {partners.map((partner) => (
          <figure
            className={`partner-logo ${partner.className} d-flex align-items-center justify-content-center`}
            key={partner.name}
          >
            <img src={partner.logo} alt={partner.name} />
          </figure>
        ))}
      </div>
    </section>
  )
}

export default Partners
