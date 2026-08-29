import Layout from '../components/layout/Layout'
import { useState } from 'react'

export default function PrivilegeMembership() {
  const [selectedTier, setSelectedTier] = useState('silver')

  const tiers = [
    {
      id: 'silver',
      name: 'Silver',
      price: '₹999/month',
      benefits: [
        '10% discount on food and beverages',
        'Priority reservations',
        'Exclusive member events',
        'Free birthday gift voucher'
      ]
    },
    {
      id: 'gold',
      name: 'Gold',
      price: '₹1,999/month',
      benefits: [
        '20% discount on food and beverages',
        'Priority reservations',
        'Exclusive member events',
        'Free birthday special package',
        'Complimentary shisha upgrade',
        'Birthday party discount'
      ]
    },
    {
      id: 'platinum',
      name: 'Platinum',
      price: '₹4,999/month',
      benefits: [
        '30% discount on food and beverages',
        'Guaranteed reservations',
        'VIP exclusive events',
        'Premium birthday celebration',
        'Free premium shisha upgrade',
        'Complimentary starter on every visit',
        'Dedicated concierge service'
      ]
    }
  ]

  const selectedTierData = tiers.find(t => t.id === selectedTier)

  return (
    <Layout>
      <section className="membership-page">
        <h1>Privilege Membership</h1>
        <p>Experience luxury with our exclusive membership benefits</p>

        <div className="tier-selector">
          {tiers.map(tier => (
            <button
              key={tier.id}
              className={`tier-btn ${selectedTier === tier.id ? 'active' : ''}`}
              onClick={() => setSelectedTier(tier.id)}
            >
              {tier.name}
            </button>
          ))}
        </div>

        {selectedTierData && (
          <div className="tier-details">
            <h2>{selectedTierData.name} Membership</h2>
            <p className="tier-price">{selectedTierData.price}</p>
            
            <ul className="benefits-list">
              {selectedTierData.benefits.map((benefit, idx) => (
                <li key={idx}>✓ {benefit}</li>
              ))}
            </ul>

            <a href="/" className="btn btn-primary">Upgrade Membership</a>
          </div>
        )}

        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-item">
            <h3>How do I become a member?</h3>
            <p>Simply visit our lounge or contact us to start your membership journey.</p>
          </div>
          <div className="faq-item">
            <h3>Can I change my membership tier?</h3>
            <p>Yes, you can upgrade or downgrade your membership anytime.</p>
          </div>
          <div className="faq-item">
            <h3>What payment methods do you accept?</h3>
            <p>We accept all major credit cards, debit cards, and digital payment methods.</p>
          </div>
        </section>
      </section>
    </Layout>
  )
}
