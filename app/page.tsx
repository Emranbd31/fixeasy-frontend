'use client';

import { motion, AnimatePresence } from 'framer-motion';
// Removed duplicate useState import
const serviceSuggestions: Record<string, Array<{ name: string; description: string }>> = {
  Builder: [
    { name: '🏗️ Home Construction', description: 'Build new homes and extensions.' },
    { name: '🔨 Renovation', description: 'Renovate and remodel existing spaces.' },
    { name: '🚧 Site Preparation', description: 'Prepare sites for construction.' },
    { name: '✨ Other', description: 'Describe your building needs in the booking description box.' },
  ],
  Cleaning: [
    { name: '🏠 House Cleaning', description: 'Full home cleaning, bedrooms, bathrooms, kitchen, living areas.' },
    { name: '🏢 Office Cleaning', description: 'Workspace, desks, meeting rooms, restrooms.' },
    { name: '🌳 Garden Cleaning', description: 'Lawn mowing, hedge trimming, leaf removal.' },
    { name: '✨ Other', description: 'Describe your custom cleaning needs in the booking description box.' },
  ],
  Handyman: [
    { name: '🔨 Furniture Assembly', description: 'Expert assembly of all types of furniture.' },
    { name: '🪛 Minor Repairs', description: 'Small fixes around the house.' },
    { name: '🧰 TV Mounting', description: 'Secure TV wall mounting.' },
    { name: '✨ Other', description: 'Describe your handyman needs in the booking description box.' },
  ],
  Plumbing: [
    { name: '🚰 Leak Repair', description: 'Fixing leaking pipes and faucets.' },
    { name: '🛁 Bathroom Plumbing', description: 'Install/repair bathroom fixtures.' },
    { name: '🔩 Pipe Installation', description: 'New pipe installation and replacement.' },
    { name: '✨ Other', description: 'Describe your plumbing needs in the booking description box.' },
  ],
  Electrical: [
    { name: '💡 Light Installation', description: 'Install new lights and fixtures.' },
    { name: '🔌 Socket Repair', description: 'Fix or replace electrical sockets.' },
    { name: '⚡ Circuit Breaker', description: 'Circuit breaker installation/repair.' },
    { name: '✨ Other', description: 'Describe your electrical needs in the booking description box.' },
  ],
  Painting: [
    { name: '🎨 Interior Painting', description: 'Painting walls, ceilings, and trim.' },
    { name: '🖌️ Exterior Painting', description: 'Painting outside walls and fences.' },
    { name: '🪑 Furniture Painting', description: 'Painting or refinishing furniture.' },
    { name: '✨ Other', description: 'Describe your painting needs in the booking description box.' },
  ],
  Gardening: [
    { name: '🌱 Lawn Mowing', description: 'Regular lawn mowing and care.' },
    { name: '🌷 Flower Planting', description: 'Planting and maintaining flowers.' },
    { name: '🌳 Hedge Trimming', description: 'Trimming and shaping hedges.' },
    { name: '✨ Other', description: 'Describe your gardening needs in the booking description box.' },
  ],
  Moving: [
    { name: '🚚 House Moving', description: 'Full house moving service.' },
    { name: '📦 Packing Service', description: 'Professional packing for your move.' },
    { name: '🪑 Furniture Moving', description: 'Moving large furniture items.' },
    { name: '✨ Other', description: 'Describe your moving needs in the booking description box.' },
  ],
  Carpentry: [
    { name: '🪚 Custom Furniture', description: 'Design and build custom furniture.' },
    { name: '🚪 Door Installation', description: 'Install or repair doors.' },
    { name: '🛠️ Shelving', description: 'Build and install shelves.' },
    { name: '✨ Other', description: 'Describe your carpentry needs in the booking description box.' },
  ],
  'Appliance Repair': [
     { name: '🧺 Washing Machine Repair', description: 'Repair and maintenance of washing machines.' },
     { name: '🧊 Refrigerator Repair', description: 'Fixing refrigerator cooling and leaks.' },
     { name: '🔥 Oven/Stove Repair', description: 'Repair ovens, stoves, and cooktops.' },
     { name: '✨ Other', description: 'Describe your appliance repair needs in the booking description box.' },
  ],
  HVAC: [
    { name: '❄️ AC Installation', description: 'Install new air conditioning units.' },
    { name: '🔥 Heating Repair', description: 'Repair heating systems and radiators.' },
    { name: '🧊 Cooling Maintenance', description: 'Service and maintain cooling systems.' },
    { name: '✨ Other', description: 'Describe your HVAC needs in the booking description box.' },
  ],
  'Pest Control': [
    { name: '🐜 Ant Removal', description: 'Remove ants from your home.' },
    { name: '🦟 Mosquito Control', description: 'Mosquito elimination.' },
    { name: '🐭 Rodent Removal', description: 'Get rid of mice and rats.' },
    { name: '✨ Other', description: 'Describe your pest control needs in the booking description box.' },
  ],
  Locksmith: [
    { name: '🔐 Lock Installation', description: 'Install new locks for doors and windows.' },
    { name: '🗝️ Key Duplication', description: 'Duplicate or replace lost keys.' },
    { name: '🚪 Emergency Unlock', description: 'Emergency door unlocking service.' },
    { name: '✨ Other', description: 'Describe your locksmith needs in the booking description box.' },
  ],
  Welding: [
    { name: '🔩 Metal Fabrication', description: 'Custom metal fabrication and welding.' },
    { name: '🛠️ Equipment Repair', description: 'Repair metal equipment and tools.' },
    { name: '🚗 Auto Welding', description: 'Welding for vehicles and auto parts.' },
    { name: '✨ Other', description: 'Describe your welding needs in the booking description box.' },
  ],
  'CCTV Installation': [
    { name: '📹 Home CCTV', description: 'Install CCTV for home security.' },
    { name: '🏢 Office CCTV', description: 'Install CCTV for offices and businesses.' },
    { name: '🔧 System Maintenance', description: 'CCTV system maintenance and repair.' },
    { name: '✨ Other', description: 'Describe your CCTV needs in the booking description box.' },
  ],
  'Solar Panels': [
    { name: '🔆 Panel Installation', description: 'Install new solar panels.' },
    { name: '🔋 Battery Setup', description: 'Install and configure solar batteries.' },
    { name: '🛠️ System Maintenance', description: 'Solar panel system maintenance.' },
    { name: '✨ Other', description: 'Describe your solar panel needs in the booking description box.' },
  ],
  Roofing: [
    { name: '🏠 Roof Repair', description: 'Repair damaged roofs.' },
    { name: '🪜 Roof Installation', description: 'Install new roofing.' },
    { name: '🧹 Roof Cleaning', description: 'Clean moss and debris from roofs.' },
    { name: '✨ Other', description: 'Describe your roofing needs in the booking description box.' },
  ],
  Flooring: [
    { name: '🪵 Wood Flooring', description: 'Install and repair wood floors.' },
    { name: '🧽 Tile Flooring', description: 'Install and repair tile floors.' },
    { name: '🛋️ Carpet Installation', description: 'Install new carpets.' },
    { name: '✨ Other', description: 'Describe your flooring needs in the booking description box.' },
  ],
  Tiling: [
    { name: '🧱 Wall Tiling', description: 'Install tiles on walls.' },
    { name: '🛁 Bathroom Tiling', description: 'Tile bathrooms and showers.' },
    { name: '🍽️ Kitchen Tiling', description: 'Tile kitchen floors and backsplashes.' },
    { name: '✨ Other', description: 'Describe your tiling needs in the booking description box.' },
  ],
  Plastering: [
    { name: '🧑‍🎨 Wall Plastering', description: 'Plaster and finish walls.' },
    { name: '🏠 Ceiling Plastering', description: 'Plaster and finish ceilings.' },
    { name: '🛠️ Repair Cracks', description: 'Repair cracks and holes in plaster.' },
    { name: '✨ Other', description: 'Describe your plastering needs in the booking description box.' },
  ],
  'Window Cleaning': [
    { name: '🪟 Exterior Windows', description: 'Clean exterior windows.' },
    { name: '🧼 Interior Windows', description: 'Clean interior windows.' },
    { name: '🏢 Office Windows', description: 'Clean office and commercial windows.' },
    { name: '✨ Other', description: 'Describe your window cleaning needs in the booking description box.' },
  ],
  'Pressure Washing': [
    { name: '🚗 Driveway Washing', description: 'Pressure wash driveways.' },
    { name: '🏡 Patio Cleaning', description: 'Pressure wash patios and decks.' },
    { name: '🧱 Wall Cleaning', description: 'Pressure wash exterior walls.' },
    { name: '✨ Other', description: 'Describe your pressure washing needs in the booking description box.' },
  ],
  'Chimney Sweep': [
    { name: '🔥 Chimney Cleaning', description: 'Clean and sweep chimneys.' },
    { name: '🧹 Soot Removal', description: 'Remove soot and debris.' },
    { name: '🔍 Inspection', description: 'Inspect chimney for safety.' },
    { name: '✨ Other', description: 'Describe your chimney needs in the booking description box.' },
  ],
  'Gutter Cleaning': [
    { name: '🧹 Gutter Cleaning', description: 'Clean gutters and downspouts.' },
    { name: '🔧 Gutter Repair', description: 'Repair damaged gutters.' },
    { name: '🪜 Gutter Installation', description: 'Install new gutters.' },
    { name: '✨ Other', description: 'Describe your gutter needs in the booking description box.' },
  ],
  'Air Conditioning': [
    { name: '❄️ AC Installation', description: 'Install new air conditioning units.' },
    { name: '🧊 AC Repair', description: 'Repair and maintain AC units.' },
    { name: '🧹 Filter Cleaning', description: 'Clean and replace AC filters.' },
    { name: '✨ Other', description: 'Describe your air conditioning needs in the booking description box.' },
  ],
  'Roof Cleaning': [
    { name: '🧹 Moss Removal', description: 'Remove moss from roof.' },
    { name: '💧 Roof Washing', description: 'Wash and clean roof surfaces.' },
    { name: '🪜 Gutter Cleaning', description: 'Clean gutters as part of roof cleaning.' },
    { name: '✨ Other', description: 'Describe your roof cleaning needs in the booking description box.' },
  ],
  'Carpet Cleaning': [
    { name: '🧼 Deep Cleaning', description: 'Deep clean carpets and rugs.' },
    { name: '🧽 Stain Removal', description: 'Remove stains from carpets.' },
    { name: '🪟 Odor Removal', description: 'Eliminate odors from carpets.' },
    { name: '✨ Other', description: 'Describe your carpet cleaning needs in the booking description box.' },
  ],
  // Add more as needed for other services
};
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

const services = [
  { id: 1, name: 'Cleaning', description: 'Professional home & office cleaning', gradient: 'from-blue-400 to-cyan-400', price: '€29', image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=400&h=300&fit=crop' },
  { id: 2, name: 'Handyman', description: 'Expert repair & maintenance', gradient: 'from-orange-400 to-red-400', price: '€35', image: 'https://images.unsplash.com/photo-1534398079543-7ae6d016b86a?w=400&h=300&fit=crop' },
  { id: 3, name: 'Plumbing', description: 'Licensed plumbing services', gradient: 'from-blue-500 to-indigo-500', price: '€45', image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop' },
  { id: 4, name: 'Electrical', description: 'Certified electrical work', gradient: 'from-yellow-400 to-orange-500', price: '€55', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop' },
  { id: 5, name: 'Painting', description: 'Interior & exterior painting', gradient: 'from-purple-400 to-pink-500', price: '€40', image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop' },
  { id: 6, name: 'Gardening', description: 'Lawn care & landscaping', gradient: 'from-green-400 to-emerald-500', price: '€30', image: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=400&h=300&fit=crop' },
  { id: 7, name: 'Moving', description: 'Reliable moving services', gradient: 'from-indigo-400 to-blue-500', price: '€60', image: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=400&h=300&fit=crop' },
  { id: 8, name: 'Carpentry', description: 'Custom woodwork & furniture', gradient: 'from-amber-600 to-orange-600', price: '€50', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop' },
  { id: 9, name: 'Appliance Repair', description: 'Fix all home appliances', gradient: 'from-gray-500 to-slate-600', price: '€40', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop' },
  { id: 10, name: 'HVAC', description: 'Heating & cooling services', gradient: 'from-cyan-500 to-blue-600', price: '€65', image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=400&h=300&fit=crop' },
  { id: 11, name: 'Pest Control', description: 'Safe pest elimination', gradient: 'from-red-500 to-orange-600', price: '€45', image: '/images/services/pest-control.png' },
  { id: 12, name: 'Locksmith', description: 'Security & lock services', gradient: 'from-slate-600 to-gray-700', price: '€35', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop' },
  { id: 13, name: 'Welding', description: 'Metal fabrication & welding', gradient: 'from-orange-600 to-red-600', price: '€70', image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop' },
  { id: 14, name: 'CCTV Installation', description: 'Security camera systems', gradient: 'from-slate-700 to-gray-800', price: '€80', image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&h=300&fit=crop' },
  { id: 15, name: 'Solar Panels', description: 'Solar energy installation', gradient: 'from-yellow-500 to-orange-600', price: '€150', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop' },
  { id: 16, name: 'Builder', description: 'Construction & renovation', gradient: 'from-orange-500 to-amber-600', price: '€85', image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop' },
  { id: 17, name: 'Roofing', description: 'Roof repair & installation', gradient: 'from-gray-600 to-slate-700', price: '€75', image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400&h=300&fit=crop' },
  { id: 18, name: 'Flooring', description: 'Floor installation & repair', gradient: 'from-amber-700 to-orange-800', price: '€55', image: 'https://images.unsplash.com/photo-1581858726788-75bc0f1a4edf?w=400&h=300&fit=crop' },
  { id: 19, name: 'Tiling', description: 'Professional tiling services', gradient: 'from-teal-500 to-cyan-600', price: '€50', image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=300&fit=crop' },
  { id: 20, name: 'Plastering', description: 'Wall plastering & finishing', gradient: 'from-gray-400 to-gray-600', price: '€45', image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop' },
  { id: 21, name: 'Window Cleaning', description: 'Exterior & interior windows', gradient: 'from-sky-400 to-blue-500', price: '€35', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop' },
  { id: 22, name: 'Pressure Washing', description: 'Deep cleaning driveways', gradient: 'from-blue-600 to-cyan-700', price: '€40', image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400&h=300&fit=crop' },
  { id: 23, name: 'Chimney Sweep', description: 'Chimney cleaning & inspection', gradient: 'from-stone-600 to-gray-700', price: '€60', image: 'https://images.unsplash.com/photo-1609757644538-5d5c4e93e6f1?w=400&h=300&fit=crop' },
  { id: 24, name: 'Gutter Cleaning', description: 'Gutter maintenance & repair', gradient: 'from-blue-500 to-slate-600', price: '€40', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop' },
  { id: 25, name: 'Air Conditioning', description: 'AC installation & repair', gradient: 'from-cyan-600 to-blue-700', price: '€70', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop' },
  { id: 26, name: 'Roof Cleaning', description: 'Roof moss removal & cleaning', gradient: 'from-green-600 to-teal-700', price: '€65', image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400&h=300&fit=crop' },
  { id: 27, name: 'Carpet Cleaning', description: 'Deep carpet cleaning service', gradient: 'from-indigo-500 to-purple-600', price: '€50', image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=300&fit=crop' }
];

const serviceIcons: Record<string, string> = {
  'Cleaning': '🧹', 'Handyman': '🔨', 'Plumbing': '🔧', 'Electrical': '⚡',
  'Painting': '🎨', 'Gardening': '🌿', 'Moving': '📦', 'Carpentry': '🪚',
  'Appliance Repair': '🔌', 'HVAC': '❄️', 'Pest Control': '🐛', 'Locksmith': '🔐'
};

// Live Service Requests Data
const liveRequests = [
  { id: 1, name: 'Mary O.', service: 'Plumbing', location: 'Dublin 2', budget: '€85', time: '2 mins ago', icon: '🔧', urgent: true },
  { id: 2, name: 'John D.', service: 'Electrical', location: 'Cork City', budget: '€120', time: '5 mins ago', icon: '⚡', urgent: false },
  { id: 3, name: 'Sarah M.', service: 'Cleaning', location: 'Galway', budget: '€45', time: '8 mins ago', icon: '🧹', urgent: false },
  { id: 4, name: 'Patrick L.', service: 'Gardening', location: 'Limerick', budget: '€60', time: '12 mins ago', icon: '🌿', urgent: false },
  { id: 5, name: 'Emma C.', service: 'Painting', location: 'Dublin 4', budget: '€200', time: '15 mins ago', icon: '🎨', urgent: true },
  { id: 6, name: 'Michael B.', service: 'HVAC', location: 'Waterford', budget: '€150', time: '18 mins ago', icon: '❄️', urgent: false },
  { id: 7, name: 'Lisa K.', service: 'Locksmith', location: 'Dublin 1', budget: '€55', time: '22 mins ago', icon: '🔐', urgent: true },
  { id: 8, name: 'David R.', service: 'Carpentry', location: 'Kilkenny', budget: '€180', time: '28 mins ago', icon: '🪚', urgent: false },
  { id: 9, name: 'Anna W.', service: 'Handyman', location: 'Dublin 6', budget: '€75', time: '32 mins ago', icon: '🔨', urgent: false },
  { id: 10, name: 'Tom S.', service: 'Pest Control', location: 'Drogheda', budget: '€90', time: '35 mins ago', icon: '🐛', urgent: false },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredServices, setFilteredServices] = useState(services);
  const [showServiceModal, setShowServiceModal] = useState<{ open: boolean; service: string | null }>({ open: false, service: null });

  // Live stats counters
  const [activeRequests, setActiveRequests] = useState(0);
  const [professionalsOnline, setProfilessionalsOnline] = useState(0);
  const [servicesCompleted, setServicesCompleted] = useState(0);

  // Animate counters on mount
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    const targetActive = 23;
    const targetPros = 187;
    const targetCompleted = 342;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setActiveRequests(Math.floor(targetActive * progress));
      setProfilessionalsOnline(Math.floor(targetPros * progress));
      setServicesCompleted(Math.floor(targetCompleted * progress));

      if (step >= steps) {
        clearInterval(timer);
        setActiveRequests(targetActive);
        setProfilessionalsOnline(targetPros);
        setServicesCompleted(targetCompleted);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredServices(services);
    } else {
      const filtered = services.filter(service =>
        service.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden pt-8 pb-8 md:pt-12 md:pb-12 lg:pt-16 lg:pb-16 min-h-[80vh] md:min-h-[90vh] flex items-center">
        {/* Background Image - Positioned on Right Side */}
        <div className="absolute inset-0 z-0">
          <div className="absolute right-0 top-0 bottom-0 w-full md:w-[60%]">
            <img
              src="/images/hero-professional.png"
              alt="Trusted FixEasy professional with happy client"
              className="w-full h-full object-cover object-left brightness-90"
            />
          </div>
          {/* Extra wide, soft gradient overlay for natural blend */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 via-slate-900/40 to-transparent" style={{ width: '100%', maxWidth: '100vw' }}></div>
        </div>

        {/* Decorative Background Elements - More subtle */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-400 rounded-full mix-blend-soft-light filter blur-3xl opacity-10 animate-pulse z-10"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-soft-light filter blur-3xl opacity-10 animate-pulse z-10" style={{ animationDelay: '2s' }}></div>

        <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
          <div className="max-w-2xl lg:max-w-3xl">
            {/* Content with no background color */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-4 md:space-y-6 text-left"
            >
              {/* Badge moved to Header */}

              <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-3 md:mb-4 leading-tight md:leading-[1.05] tracking-tight">
                Home services,<br />
                <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-200 bg-clip-text text-transparent drop-shadow-lg">
                  made easy
                </span>
              </h1>

              <p className="text-base md:text-lg lg:text-xl text-gray-200 mb-4 md:mb-6 leading-relaxed max-w-xl font-light">
                Book <span className="font-bold text-cyan-300">trusted professionals</span> for cleaning, repairs, and more. Quick booking, clear pricing, and verified professionals.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-4 md:mb-6">
                <Link href="/book">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 25px 50px rgba(6, 182, 212, 0.5)' }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    className="w-full sm:w-auto px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-bold text-base md:text-lg shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300"
                  >
                    📅 Book a Service
                  </motion.button>
                </Link>
                <Link href="/register/professional">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 25px 50px rgba(255, 255, 255, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    className="w-full sm:w-auto px-8 md:px-10 py-3 md:py-4 bg-white/90 backdrop-blur-sm text-slate-900 rounded-full font-bold text-base md:text-lg shadow-2xl hover:bg-white transition-all duration-300"
                  >
                    💼 Become a Professional
                  </motion.button>
                </Link>
              </div>

              {/* Trust Badges - Compact */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-3 md:mt-4 flex flex-wrap gap-2 md:gap-3"
              >
                <div className="flex items-center gap-2 bg-green-500/15 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-lg">
                  <span className="text-lg">✅</span>
                  <span className="text-xs font-bold text-green-200">ID Verified</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-500/15 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-lg">
                  <span className="text-lg">🛡️</span>
                  <span className="text-xs font-bold text-blue-200">Insured</span>
                </div>
                <div className="flex items-center gap-2 bg-purple-500/15 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-lg">
                  <span className="text-lg">💳</span>
                  <span className="text-xs font-bold text-purple-200">Secure Payment</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="services" className="py-8 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold"
              >
                🏆 1000+ Professional Services for Every Need
              </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
              Choose Your <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Service</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Professional home services at your fingertips. Book instantly with verified professionals.
            </p>
          </motion.div>

          {/* SEARCH BAR */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto mb-6"
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search services... (e.g., cleaning, plumbing, electrical)"
                className="w-full px-6 py-4 pl-14 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-lg"
              />
              <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl">
                🔍
              </div>
              {searchQuery && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Search Suggestions */}
            {searchQuery && filteredServices.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 bg-white rounded-xl shadow-xl border-2 border-gray-100 overflow-hidden"
              >
                <div className="p-3 text-sm text-gray-500 font-semibold border-b border-gray-100">
                  {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {filteredServices.slice(0, 8).map((service) => (
                    <Link key={service.id} href="/book">
                      <motion.div
                        whileHover={{ backgroundColor: '#f0f9ff' }}
                        className="px-4 py-3 cursor-pointer border-b border-gray-50 last:border-b-0 flex items-center gap-3"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{service.name}</div>
                          <div className="text-sm text-gray-500">{service.description}</div>
                        </div>
                        <div className="text-blue-600 font-bold">{service.price}</div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* No Results */}
            {searchQuery && filteredServices.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 bg-white rounded-xl shadow-xl border-2 border-gray-100 p-6 text-center"
              >
                <div className="text-4xl mb-2">😕</div>
                <div className="text-gray-900 font-semibold mb-1">No services found</div>
                <div className="text-sm text-gray-500">Try searching for: cleaning, plumbing, electrical, etc.</div>
              </motion.div>
            )}
          </motion.div>

          {/* Service Cards Grid - WITH REAL PHOTOS */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {filteredServices.map((service, index) => {
              // Add emoji for each service type
              let emoji = '';
              if (service.name === 'Cleaning') emoji = '🧼';
              if (service.name === 'Handyman') emoji = '🔨';
              if (service.name === 'Plumbing') emoji = '🔧';
              if (service.name === 'Electrical') emoji = '💡';
              if (service.name === 'Painting') emoji = '🎨';
              if (service.name === 'Gardening') emoji = '🌿';
              if (service.name === 'Moving') emoji = '🚚';
              if (service.name === 'Carpentry') emoji = '🪚';
              if (service.name === 'Appliance Repair') emoji = '🛠️';
              if (service.name === 'Pest Control') emoji = '🐜';
              if (service.name === 'Other') emoji = '✨';
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
                  whileHover={{ y: -8, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 17 } }}
                  whileTap={{ scale: 0.98 }}
                  className="group cursor-pointer"
                  onClick={() => setShowServiceModal({ open: true, service: service.name })}
                >
                  <div className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-400 h-full">
                    {/* REAL PHOTO - Like Competitors */}
                    <div className="relative h-40 md:h-48 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Gradient Overlay for Text Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                      {/* Popular Badge */}
                      {index < 3 && (
                        <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          ⭐ Popular
                        </div>
                      )}

                      {/* Service Name Overlay */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-lg md:text-xl font-bold text-white drop-shadow-lg flex items-center gap-2">
                          <span>{emoji}</span> {service.name}
                        </h3>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed flex items-center gap-2">
                        <span>{emoji}</span> {service.description}
                      </p>

                      {/* Pricing - More Prominent */}
                      <div className="mb-4 pb-4 border-b border-gray-100">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            {service.price}
                          </span>
                          <span className="text-xs text-gray-500">starting</span>
                        </div>
                      </div>

                      {/* Book Button */}
                      <div className="flex items-center justify-between text-blue-600 font-semibold text-sm">
                        <span className="group-hover:text-blue-700 transition-colors">Book Now</span>
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="text-blue-600 group-hover:text-blue-700"
                        >
                          →
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Service Modal for all services */}
            {showServiceModal.open && showServiceModal.service && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
                  <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold" onClick={() => setShowServiceModal({ open: false, service: null })}>×</button>
                  <h2 className="text-2xl font-bold mb-4 text-blue-600 flex items-center gap-2">
                    {serviceIcons[showServiceModal.service] || '✨'} Choose {showServiceModal.service} Option
                  </h2>
                  <div className="space-y-4">
                    {(serviceSuggestions[showServiceModal.service] || [
                      { name: '✨ Other', description: 'Describe your needs in the booking description box.' }
                    ]).map(opt => (
                      <button key={opt.name} className="w-full text-left px-4 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold shadow transition-all flex flex-col gap-1" onClick={() => { setShowServiceModal({ open: false, service: null }); window.location.href = '/book?type=' + encodeURIComponent(opt.name); }}>
                        <div className="font-bold flex items-center gap-2">{opt.name}</div>
                        <div className="text-sm text-blue-500">{opt.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RECENT JOBS COMPLETED SECTION */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold"
            >
              🔥 Live Activity
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              Recently <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Completed Jobs</span>
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              Real jobs completed by our verified professionals across Ireland
            </p>
          </motion.div>

          {/* Jobs Feed */}
          <div className="max-w-4xl mx-auto space-y-3">
            {[
              { service: 'Plumbing', location: 'Dublin 2', time: '2 hours ago', pro: 'John M.', rating: 5, icon: '🔧' },
              { service: 'Cleaning', location: 'Cork', time: '3 hours ago', pro: 'Sarah K.', rating: 5, icon: '🧹' },
              { service: 'Electrical', location: 'Galway', time: '5 hours ago', pro: 'Michael P.', rating: 5, icon: '⚡' },
              { service: 'Gardening', location: 'Limerick', time: '6 hours ago', pro: 'Emma W.', rating: 5, icon: '🌿' },
              { service: 'Handyman', location: 'Waterford', time: '8 hours ago', pro: 'David O.', rating: 5, icon: '🔨' },
              { service: 'Painting', location: 'Dublin 4', time: '12 hours ago', pro: 'Lisa B.', rating: 5, icon: '🎨' }
            ].map((job, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ x: 4, transition: { type: 'spring', stiffness: 400, damping: 17 } }}
                className="bg-white rounded-2xl p-4 md:p-5 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">{job.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 text-sm md:text-base">
                        {job.service} completed in {job.location}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap">{job.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs md:text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <span className="text-blue-600 font-semibold">✓</span> {job.pro}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="font-semibold text-gray-900">{job.rating}.0</span>
                      </span>
                    </div>
                  </div>

                  {/* Success Badge */}
                  <div className="hidden sm:flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                    <span>✓</span> Completed
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All Jobs Link */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-8"
          >
            <Link href="/jobs">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm md:text-base"
              >
                View all recent jobs
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* LIVE SERVICE REQUESTS FEED */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-red-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-4 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold animate-pulse">
              🔴 LIVE NOW
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Service Requests <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Happening Now</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See real-time service requests from customers across Ireland. Join our network and start earning!
            </p>
          </motion.div>

          {/* Scrolling Feed */}
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {liveRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex-shrink-0 w-80 snap-center"
                >
                  <div className={`bg-white rounded-2xl p-6 shadow-xl border-2 ${request.urgent ? 'border-red-300 bg-red-50/50' : 'border-gray-200'} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl">
                          {request.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{request.name}</h3>
                          <p className="text-sm text-gray-500">{request.time}</p>
                        </div>
                      </div>
                      {request.urgent && (
                        <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                          URGENT
                        </span>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm">🛠️ Service:</span>
                        <span className="font-semibold text-gray-900">{request.service}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm">📍 Location:</span>
                        <span className="font-semibold text-gray-900">{request.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm">💰 Budget:</span>
                        <span className="font-bold text-green-600 text-lg">{request.budget}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105">
                        View Request →
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Gradient Overlays for scroll hint */}
            <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-orange-50 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-red-50 to-transparent pointer-events-none" />
          </div>

          <div className="text-center mt-8">
            <Link href="/register/professional">
              <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
                💼 Join as Professional & Get Requests
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4 px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-semibold"
            >
              ⚡ Quick & Easy Process
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
              How It <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Get your home services done in three simple steps
            </p>
          </motion.div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto relative">
            {/* Connecting Lines */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>

            {[
              {
                icon: '🔍',
                number: '01',
                title: 'Choose Service',
                desc: 'Browse our 12 professional services and select what you need',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: '📅',
                number: '02',
                title: 'Book & Schedule',
                desc: 'Pick a convenient time and get instant confirmation from verified pros',
                color: 'from-cyan-500 to-blue-600'
              },
              {
                icon: '✅',
                number: '03',
                title: 'Get It Done',
                desc: 'Sit back while our professionals complete your service perfectly',
                color: 'from-blue-600 to-cyan-600'
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                whileHover={{ y: -12, transition: { type: 'spring', stiffness: 400, damping: 17 } }}
                className="relative"
              >
                {/* Step Number Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center shadow-xl text-white font-bold text-lg`}>
                    {step.number}
                  </div>
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl p-8 pt-14 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-blue-200 h-full relative overflow-hidden">
                  {/* Decorative Background */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${step.color} opacity-5 rounded-full -mr-16 -mt-16`}></div>

                  {/* Icon */}
                  <div className="relative">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                      className="w-24 h-24 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg"
                    >
                      <span className="text-5xl">{step.icon}</span>
                    </motion.div>

                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 text-center tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-center leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* Arrow for connection (desktop only) */}
                  {i < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-8 z-20">
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-3xl text-blue-500"
                      >
                        →
                      </motion.div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION COVERAGE SECTION */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold"
            >
              🇮🇪 Nationwide Coverage
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
              Serving All of <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Ireland</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Professional home services available in all 32 counties across Ireland
            </p>
          </motion.div>

          {/* Counties Grid */}
          <div className="max-w-6xl mx-auto">
            {/* Province: Leinster */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-3xl">🏛️</span> Leinster
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {['Dublin', 'Carlow', 'Kildare', 'Kilkenny', 'Laois', 'Longford', 'Louth', 'Meath', 'Offaly', 'Westmeath', 'Wexford', 'Wicklow'].map((county, i) => (
                  <motion.div
                    key={county}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    whileHover={{ scale: 1.05, y: -4, transition: { type: 'spring', stiffness: 400, damping: 17 } }}
                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-400 text-center cursor-pointer"
                  >
                    <div className="text-lg font-semibold text-gray-900">{county}</div>
                    <div className="text-xs text-green-600 font-semibold mt-1">✓ Available</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Province: Munster */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-12"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-3xl">🏰</span> Munster
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {['Cork', 'Clare', 'Kerry', 'Limerick', 'Tipperary', 'Waterford'].map((county, i) => (
                  <motion.div
                    key={county}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    whileHover={{ scale: 1.05, y: -4, transition: { type: 'spring', stiffness: 400, damping: 17 } }}
                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-400 text-center cursor-pointer"
                  >
                    <div className="text-lg font-semibold text-gray-900">{county}</div>
                    <div className="text-xs text-green-600 font-semibold mt-1">✓ Available</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Province: Connacht */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-3xl">🌊</span> Connacht
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {['Galway', 'Leitrim', 'Mayo', 'Roscommon', 'Sligo'].map((county, i) => (
                  <motion.div
                    key={county}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    whileHover={{ scale: 1.05, y: -4, transition: { type: 'spring', stiffness: 400, damping: 17 } }}
                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-400 text-center cursor-pointer"
                  >
                    <div className="text-lg font-semibold text-gray-900">{county}</div>
                    <div className="text-xs text-green-600 font-semibold mt-1">✓ Available</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Province: Ulster */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-3xl">⛰️</span> Ulster (ROI)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {['Cavan', 'Donegal', 'Monaghan'].map((county, i) => (
                  <motion.div
                    key={county}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    whileHover={{ scale: 1.05, y: -4, transition: { type: 'spring', stiffness: 400, damping: 17 } }}
                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-400 text-center cursor-pointer"
                  >
                    <div className="text-lg font-semibold text-gray-900">{county}</div>
                    <div className="text-xs text-green-600 font-semibold mt-1">✓ Available</div>
                  </motion.div>
                ))}
                </div>
              </motion.div>
            </div>

          {/* Coverage Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 md:p-12 border-2 border-blue-200 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">32</div>
                  <div className="text-gray-700 font-semibold">Counties Covered</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">500+</div>
                  <div className="text-gray-700 font-semibold">Local Professionals</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">100%</div>
                  <div className="text-gray-700 font-semibold">Ireland Coverage</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AS SEEN IN SECTION */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-8">
              As Featured In
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
              <div className="text-xl md:text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors">The Irish Times</div>
              <div className="text-xl md:text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors">RTÉ</div>
              <div className="text-xl md:text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors">Irish Independent</div>
              <div className="text-xl md:text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors">The Herald</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CUSTOMER TESTIMONIALS SECTION */}
      <section className="py-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold"
            >
              ⭐ Trusted by Thousands
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
              What Our <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Customers Say</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Real reviews from real customers across Ireland
            </p>
          </motion.div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                name: 'Sarah Murphy',
                location: 'Dublin',
                service: 'Cleaning',
                rating: 5,
                text: 'Simply amazing! Booked a cleaner within minutes. The service was professional and my house has never looked better. Highly recommend!',
                avatar: 'https://i.pravatar.cc/150?img=1'
              },
              {
                name: 'John O\'Brien',
                location: 'Cork',
                service: 'Plumbing',
                rating: 5,
                text: 'Had a plumbing emergency at 9pm. Found a verified pro immediately who fixed everything the next morning. Outstanding service!',
                avatar: 'https://i.pravatar.cc/150?img=12'
              },
              {
                name: 'Emma Walsh',
                location: 'Galway',
                service: 'Electrical',
                rating: 5,
                text: 'The electrician was ID-verified, arrived on time, and did excellent work. Transparent pricing with no hidden fees. Will use again!',
                avatar: 'https://i.pravatar.cc/150?img=5'
              },
              {
                name: 'Michael Byrne',
                location: 'Limerick',
                service: 'Handyman',
                rating: 5,
                text: 'Needed several repairs done. The handyman was skilled, friendly, and finished ahead of schedule. Great value for money!',
                avatar: 'https://i.pravatar.cc/150?img=13'
              },
              {
                name: 'Lisa Keane',
                location: 'Waterford',
                service: 'Gardening',
                rating: 5,
                text: 'My garden was completely transformed! The gardener was knowledgeable and the results exceeded my expectations.',
                avatar: 'https://i.pravatar.cc/150?img=9'
              },
              {
                name: 'David Kelly',
                location: 'Dublin',
                service: 'Moving',
                rating: 5,
                text: 'Stress-free moving experience! The team was careful with my belongings and made the whole process smooth and easy.',
                avatar: 'https://i.pravatar.cc/150?img=14'
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8, transition: { type: 'spring', stiffness: 400, damping: 17 } }}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-blue-200"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, idx) => (
                    <span key={idx} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-700 leading-relaxed mb-6 text-sm md:text-base">
                  "{testimonial.text}"
                </p>

                {/* Customer Info - WITH REAL PHOTO */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover shadow-md"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.location} • {testimonial.service}</div>
                  </div>
                  <div className="text-green-600 font-semibold text-sm">✓ Verified</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trustpilot-style Overall Rating */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border-2 border-green-200 max-w-2xl mx-auto"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, idx) => (
                  <span key={idx} className="text-green-500 text-3xl">★</span>
                ))}
              </div>
              <div>
                <div className="text-4xl font-bold text-gray-900">4.8 out of 5</div>
                <div className="text-gray-600 mt-2">Based on 2,847+ customer reviews</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold"
            >
              💎 Premium Quality Service
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">FixEasy</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best home service experience in Ireland
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                icon: '✅',
                title: 'ID-Verified Professionals',
                desc: 'All pros are background checked, ID-verified, and certified before joining our platform',
                color: 'from-green-400 to-emerald-500'
              },
              {
                icon: '🏆',
                title: 'Happiness Pledge',
                desc: 'Not satisfied? We\'ll work to make it right or your money back - guaranteed',
                color: 'from-yellow-400 to-orange-500'
              },
              {
                icon: '💰',
                title: 'Transparent Pricing',
                desc: 'No hidden fees - see clear upfront costs before you book. Starting from €29',
                color: 'from-blue-400 to-cyan-500'
              },
              {
                icon: '⚡',
                title: 'Instant Booking',
                desc: 'Book your service online in minutes. 24/7 availability with real-time confirmation',
                color: 'from-purple-400 to-pink-500'
              }
            ].map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -10, transition: { type: 'spring', stiffness: 400, damping: 17 } }}
                className="group"
              >
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-blue-200 text-center h-full relative overflow-hidden">
                  {/* Decorative Background */}
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${feat.color} opacity-5 rounded-full -mr-12 -mt-12`}></div>

                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    className="relative"
                  >
                    <div className={`w-20 h-20 bg-gradient-to-br ${feat.color} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl transition-shadow`}>
                      <span className="text-4xl">{feat.icon}</span>
                    </div>
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 tracking-tight group-hover:text-blue-600 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 flex flex-wrap justify-center items-center gap-8 text-center"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛡️</span>
              <span className="text-gray-700 font-semibold">Insured Services</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💬</span>
              <span className="text-gray-700 font-semibold">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <span className="text-gray-700 font-semibold">4.8/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇮🇪</span>
              <span className="text-gray-700 font-semibold">Proudly Irish</span>
            </div>
          </motion.div>

          {/* Money-Back Guarantee Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 max-w-3xl mx-auto"
          >
            <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 border-4 border-green-300 rounded-3xl p-8 text-center shadow-xl">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Our Happiness Pledge</h3>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                If you're not 100% satisfied with your service, we'll work to make it right or provide a <span className="font-bold text-green-700">full refund</span>. Your satisfaction is our guarantee.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center max-w-4xl mx-auto">
            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">Ready to Get Started?</h2>
            <p className="text-xl text-white/90 mb-12 leading-relaxed font-light">Join thousands of satisfied customers who trust FixEasy for their home service needs</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="px-12 py-5 bg-white text-blue-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300">Book Now</motion.button>
              </Link>
              <Link href="/register/professional">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="px-12 py-5 bg-transparent text-white rounded-2xl font-bold text-lg border-2 border-white hover:bg-white/10 transition-all duration-300">Join as Professional</motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
