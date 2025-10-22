'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabaseClient'

const categories = [
  'Cleaning', 'Handyman', 'Plumbing', 'Electrical', 'Painting', 'Gardening',
  'Moving', 'Carpentry', 'Appliance Repair', 'HVAC', 'Pest Control', 'Locksmith',
  'Welding', 'CCTV Installation', 'Solar Panels', 'Builder', 'Roofing', 'Flooring',
  'Tiling', 'Plastering', 'Window Cleaning', 'Pressure Washing', 'Chimney Sweep',
  'Gutter Cleaning', 'Air Conditioning', 'Roof Cleaning', 'Carpet Cleaning'
]

export default function ProfessionalRegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sb = createSupabaseBrowserClient()

  // Form fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [category, setCategory] = useState('')
  const [customCategory, setCustomCategory] = useState('')
  const [experience, setExperience] = useState<number>(0)
  const [rate, setRate] = useState<number>(0)
  const [serviceArea, setServiceArea] = useState('')
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [idDocument, setIdDocument] = useState<File | null>(null)
  const [addressProof, setAddressProof] = useState<File | null>(null)
  const [qualificationFile, setQualificationFile] = useState<File | null>(null)
  const [insuranceFile, setInsuranceFile] = useState<File | null>(null)
  const [portfolioFiles, setPortfolioFiles] = useState<File[]>([])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    // Basic validation
    if (!name || !email || !phone || !password) {
      setError('Please fill in all required personal information')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    const chosenCategory = category === 'Other' ? customCategory.trim() : category
    if (!chosenCategory || !experience || !rate || !serviceArea) {
      setError('Please complete your service details (select a category or enter one)')
      return
    }
    if (!idDocument) {
      setError('Photo ID is required for verification')
      return
    }

    setLoading(true)
    try {
      // 1. Create auth user
      const { data: signUpData, error: signUpError } = await sb.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'professional',
            name,
            phone
          }
        }
      })

      if (signUpError) throw signUpError
      const user = signUpData.user
      if (!user) throw new Error('Sign up failed')

      const userId = user.id
      const bucket = 'pro-uploads'
      const timestamp = Date.now()

      // 2. Upload files
      async function uploadOne(file: File | null, key: string): Promise<string | null> {
        if (!file) return null
        const path = `pros/${userId}/${key}-${timestamp}-${file.name}`
        const { error: upErr } = await sb.storage.from(bucket).upload(path, file, {
          cacheControl: '3600',
          upsert: true
        })
        if (upErr) throw upErr
        return path
      }

      const profile_photo = await uploadOne(profilePhoto, 'profile-photo')
      const id_document_path = await uploadOne(idDocument, 'id-document')
      const address_proof_path = await uploadOne(addressProof, 'address-proof')
      const qualification_file_path = await uploadOne(qualificationFile, 'qualification')
      const insurance_file_path = await uploadOne(insuranceFile, 'insurance')

      const portfolio_paths: string[] = []
      for (const [i, f] of portfolioFiles.entries()) {
        const p = await uploadOne(f, `portfolio-${i + 1}`)
        if (p) portfolio_paths.push(p)
      }

      // 3. Call API to create professional record
      const res = await fetch('/api/register/professional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          name,
          email,
          phone,
          category: category === 'Other' ? customCategory.trim() : category,
          experience: Number(experience),
          rate: Number(rate),
          service_area: serviceArea,
          id_document: id_document_path,
          address_proof: address_proof_path,
          qualification_file: qualification_file_path,
          insurance_file: insurance_file_path,
          portfolio_files: portfolio_paths,
          profile_photo
        })
      })

      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.error || `Registration failed (${res.status})`)
      }

      // 4. Redirect to dashboard
      router.push('/pro-dashboard?status=pending')
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Become a FixEasy Professional
          </h1>
          <p className="text-lg text-gray-600">
            Join Ireland's leading home services platform and start getting jobs today
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 md:p-12">
            {error && (
              <div className="mb-8 p-4 rounded-xl bg-red-50 border-l-4 border-red-500 text-red-700">
                <p className="font-semibold">⚠️ {error}</p>
              </div>
            )}

            {/* Personal Information */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                Personal Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+353 87 123 4567"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                    required
                  />
                </div>
              </div>
            </div>

            <hr className="my-10 border-gray-200" />

            {/* Service Details */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">2</span>
                Service Details
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Service Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition bg-white"
                    required
                  >
                    <option value="">Select your primary service...</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="Other">Other (not listed)</option>
                  </select>
                  {category === 'Other' && (
                    <div className="mt-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Enter your service</label>
                      <input
                        type="text"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="e.g., Locksmith & Safe Engineer, Satellite Dish Installation"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                      />
                      <p className="text-xs text-gray-500 mt-1">We'll use this as your primary category</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={experience || ''}
                    onChange={(e) => setExperience(Number(e.target.value))}
                    min="0"
                    placeholder="5"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hourly Rate (€) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={rate || ''}
                    onChange={(e) => setRate(Number(e.target.value))}
                    min="0"
                    step="0.01"
                    placeholder="45.00"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Service Area <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={serviceArea}
                    onChange={(e) => setServiceArea(e.target.value)}
                    placeholder="e.g., Dublin & Surrounding Areas, Cork City, All Ireland"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Specify counties, cities, or Eircodes you serve</p>
                </div>
              </div>
            </div>

            <hr className="my-10 border-gray-200" />

            {/* Documents */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">3</span>
                Verification Documents
              </h2>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>📋 Required:</strong> Photo ID is mandatory for account verification.
                  Additional documents help build trust with customers and increase your bookings.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Profile Photo
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
                    accept="image/*"
                    className="w-full text-sm text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-blue-600 file:text-white file:font-semibold hover:file:bg-blue-700 file:cursor-pointer cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">A clear headshot helps customers trust you</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Photo ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setIdDocument(e.target.files?.[0] || null)}
                    accept="image/*,.pdf"
                    className="w-full text-sm text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-blue-600 file:text-white file:font-semibold hover:file:bg-blue-700 file:cursor-pointer cursor-pointer"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Passport, Driver's License, or National ID</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Proof of Address <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setAddressProof(e.target.files?.[0] || null)}
                    accept="image/*,.pdf"
                    className="w-full text-sm text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-gray-100 file:text-gray-700 file:font-semibold hover:file:bg-gray-200 file:cursor-pointer cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">Utility bill or bank statement</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Qualifications/Certifications <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setQualificationFile(e.target.files?.[0] || null)}
                    accept="image/*,.pdf"
                    className="w-full text-sm text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-gray-100 file:text-gray-700 file:font-semibold hover:file:bg-gray-200 file:cursor-pointer cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">Trade certificates, licenses, or diplomas</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Insurance Certificate <span className="text-gray-500 text-xs">(Optional - Recommended)</span>
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setInsuranceFile(e.target.files?.[0] || null)}
                    accept="image/*,.pdf"
                    className="w-full text-sm text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-gray-100 file:text-gray-700 file:font-semibold hover:file:bg-gray-200 file:cursor-pointer cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">Public liability or professional indemnity insurance</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Portfolio/Work Samples <span className="text-gray-500 text-xs">(Optional - Multiple files allowed)</span>
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setPortfolioFiles(Array.from(e.target.files || []))}
                    accept="image/*,.pdf"
                    className="w-full text-sm text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-gray-100 file:text-gray-700 file:font-semibold hover:file:bg-gray-200 file:cursor-pointer cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">Photos of your previous work to showcase your skills</p>
                </div>
              </div>
            </div>

            {/* Terms & Submit */}
            <div className="pt-6">
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <p className="text-sm text-gray-600 leading-relaxed">
                  By clicking "Create Account", you agree to FixEasy's{' '}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and acknowledge our{' '}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                  . Your account will be reviewed and activated within 24-48 hours.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Your Account...
                  </span>
                ) : (
                  '🚀 Create Professional Account'
                )}
              </button>

              <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Benefits */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-3">💼</div>
            <h3 className="font-bold text-gray-900 mb-2">Get More Jobs</h3>
            <p className="text-sm text-gray-600">Connect with customers across Ireland looking for your services</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-bold text-gray-900 mb-2">Fast Payments</h3>
            <p className="text-sm text-gray-600">Secure payment processing with quick transfers to your account</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-3">⭐</div>
            <h3 className="font-bold text-gray-900 mb-2">Build Your Brand</h3>
            <p className="text-sm text-gray-600">Showcase your skills, get reviews, and grow your reputation</p>
          </div>
        </div>
      </div>
    </div>
  )
}
