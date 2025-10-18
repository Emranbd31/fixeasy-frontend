import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { SERVICE_OPTIONS, findServiceByName } from '../../data/services'
import { isValidIrishPhone, sanitizePhone, sanitizeText } from '../../lib/validation'

const initialState = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  serviceType: '',
  otherService: '',
  issueDetails: ''
}

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '')
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const SUPABASE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_CLIENT_BUCKET || 'client-uploads'

export default function ClientBooking() {
  const router = useRouter()
  const [formData, setFormData] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [issuePhoto, setIssuePhoto] = useState(null)
  const [issuePreview, setIssuePreview] = useState(null)
  const [uploading, setUploading] = useState(false)

  // Auto-fill service if accessed via ?service query
  useEffect(() => {
    const { service } = router.query
    if (typeof service !== 'string') return

    const decoded = decodeURIComponent(service)
    const knownService = findServiceByName(decoded)
    setFormData((prev) => ({
      ...prev,
      serviceType: knownService ? knownService.name : 'Other (please specify)',
      otherService: knownService ? prev.otherService : decoded
    }))
  }, [router.query])

  // Cleanup preview URL on un
