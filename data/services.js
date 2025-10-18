export const SERVICE_OPTIONS = [
  'Plumber',
  'Electrician',
  'Gardener',
  'Carpenter',
  'Roofer',
  'Cleaner',
  'Handyman',
  'Painter & Decorator',
  'Appliance Repairs',
  'Window Cleaning',
  'Gutter Maintenance',
  'Security & CCTV Installation',
  'Flooring & Tiling',
  'Smart Home Automation',
  'Other (please specify)'
]

export const SERVICE_GROUPS = [
  {
    id: 'home-repairs',
    title: 'Home Repairs',
    description: 'Trusted experts for urgent call-outs and everyday fixes.',
    services: [
      { id: 'plumber', name: 'Plumber', summary: 'Emergency leaks, boiler care, and bathroom upgrades.', icon: 'plumber' },
      { id: 'electrician', name: 'Electrician', summary: 'Fuse board checks, rewiring, and EV charger installs.', icon: 'electrician' },
      { id: 'handyman', name: 'Handyman', summary: 'Quick repairs, fittings, and same-day support.', icon: 'handyman' },
      { id: 'roofer', name: 'Roofer', summary: 'Storm repairs, slate replacement, and leak prevention.', icon: 'roofer' },
      { id: 'carpenter', name: 'Carpenter', summary: 'Custom carpentry, storage, and home fit-outs.', icon: 'carpenter' }
    ]
  },
  {
    id: 'cleaning',
    title: 'Cleaning & Care',
    description: 'Detailed cleaning teams for homes, rentals, and offices.',
    services: [
      { id: 'cleaner', name: 'Cleaner', summary: 'One-off deep cleans and regular maintenance plans.', icon: 'cleaner' },
      { id: 'window-cleaning', name: 'Window Cleaning', summary: 'Crystal clear glass with safe reach systems.', icon: 'window' },
      { id: 'gutter', name: 'Gutter Maintenance', summary: 'Clearing, repairs, and leaf-guard installations.', icon: 'gutter' },
      { id: 'appliance', name: 'Appliance Repairs', summary: 'Cooker, washer, and refrigeration specialists.', icon: 'appliance' }
    ]
  },
  {
    id: 'outdoor',
    title: 'Garden & Outdoor',
    description: 'Year-round care for lawns, hedges, and landscaping projects.',
    services: [
      { id: 'gardener', name: 'Gardener', summary: 'Seasonal tidy-ups, planting, and grounds maintenance.', icon: 'gardener' },
      { id: 'painter', name: 'Painter & Decorator', summary: 'Interior and exterior finishes with a tidy crew.', icon: 'painter' }
    ]
  },
  {
    id: 'smart-secure',
    title: 'Smart & Secure',
    description: 'Modern upgrades that keep Irish homes connected and safe.',
    services: [
      { id: 'security', name: 'Security & CCTV Installation', summary: 'Alarms, monitoring, and access control set-ups.', icon: 'security' },
      { id: 'smart-home', name: 'Smart Home Automation', summary: 'Connected lighting, heating, and voice control.', icon: 'smart-home' },
      { id: 'flooring', name: 'Flooring & Tiling', summary: 'Precision tiling, hardwood, and luxury vinyl installs.', icon: 'flooring' }
    ]
  }
]

export function findServiceByName(name) {
  if (!name) return null
  const normalized = name.trim().toLowerCase()
  for (const group of SERVICE_GROUPS) {
    const match = group.services.find((service) => service.name.toLowerCase() === normalized)
    if (match) return match
  }
  return null
}
