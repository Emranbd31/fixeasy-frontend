import { useState } from 'react'

const conciergeChannels = [
  {
    label: 'Live chat',
    description: 'Connect with a FixEasy concierge within two minutes.',
    href: 'https://fixeasy.irish/support/chat',
    type: 'link'
  },
  {
    label: 'Call +353 1 963 8020',
    description: 'Weekdays 07:00–22:00 GMT',
    href: 'tel:+35319638020',
    type: 'link'
  },
  {
    label: 'Email onboarding@fixeasy.irish',
    description: 'Replies within one business hour',
    href: 'mailto:onboarding@fixeasy.irish',
    type: 'link'
  }
]

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`support-widget ${isOpen ? 'is-open' : ''}`}>
      <button
        type="button"
        className="support-widget__toggle"
        aria-expanded={isOpen}
        aria-controls="support-widget-panel"
        onClick={() => setIsOpen((previous) => !previous)}
      >
        <span className="support-widget__pulse" aria-hidden="true" />
        <span className="support-widget__label">Need help?</span>
      </button>

      <div
        id="support-widget-panel"
        role="dialog"
        aria-modal="false"
        aria-labelledby="support-widget-title"
        className="support-widget__panel"
      >
        <div className="support-widget__header">
          <span className="support-widget__eyebrow">Concierge</span>
          <h2 id="support-widget-title">We are online</h2>
          <p>Message the FixEasy team any time for booking and onboarding support.</p>
        </div>

        <ul className="support-widget__channels" role="list">
          {conciergeChannels.map((channel) => (
            <li key={channel.href} className="support-widget__channel">
              <a href={channel.href} className="support-widget__channel-link">
                <span className="support-widget__channel-label">{channel.label}</span>
                <span className="support-widget__channel-meta">{channel.description}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
