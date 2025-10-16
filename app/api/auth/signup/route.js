import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { getStore, addAuditLog } from '../../../../lib/memory-store'
import {
  sanitizeText,
  sanitizePhone,
  isValidIrishPhone,
  isValidEircode,
  isValidCompanyNumber,
  isValidPpsNumber,
  assert
} from '../../../../lib/validation'
import { getLatestTerms, recordAcceptance } from '../../../../lib/terms'
import { createToken } from '../../../../lib/tokens'

export const dynamic = 'force-dynamic'

function createReference(prefix) {
  return `${prefix}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
}

function hashSecret(secret) {
  return crypto.createHash('sha256').update(secret).digest('hex')
}

export async function POST(request) {
  const store = getStore()
  const body = await request.json()
  const latestTerms = getLatestTerms()
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '0.0.0.0'

  const accountType = sanitizeText(body.accountType)
  assert(accountType === 'client' || accountType === 'professional', 'Unsupported account type.', 'accountType')

  assert(body.termsVersion === latestTerms.version, 'Terms version mismatch. Refresh and accept the latest terms.', 'acceptTerms')
  assert(body.termsAcceptedAt, 'Missing terms acceptance timestamp.', 'acceptTerms')

  const baseUser = {
    id: crypto.randomUUID(),
    email: sanitizeText(body.email).toLowerCase(),
    phone: sanitizePhone(body.phone),
    fullName: sanitizeText(body.fullName),
    marketingConsent: Boolean(body.marketingConsent),
    termsVersion: latestTerms.version,
    termsAcceptedAt: body.termsAcceptedAt,
    acceptedIp: ipAddress,
    userAgent,
    oauthProvider: sanitizeText(body.oauthProvider || 'password'),
    createdAt: new Date().toISOString(),
    verified: false
  }

  assert(/^([^\s@]+)@([^\s@]+)\.([\w-]{2,})$/.test(baseUser.email), 'Enter a valid email.', 'email')
  assert(isValidIrishPhone(baseUser.phone), 'Irish phone numbers must use +353 format.', 'phone')
  assert(baseUser.fullName.length >= 3, 'Enter your full legal name.', 'fullName')

  if (accountType === 'client') {
    assert(isValidEircode(body.eircode), 'Provide a valid Irish Eircode.', 'eircode')
    const reference = createReference('CL')
    const userRecord = {
      ...baseUser,
      role: 'client',
      reference,
      eircode: sanitizeText(body.eircode).toUpperCase(),
      location: sanitizeText(body.eircode).toUpperCase(),
      passwordHash: hashSecret(body.password || crypto.randomUUID())
    }
    store.users.push(userRecord)
    recordAcceptance({
      userId: userRecord.id,
      accountType,
      version: latestTerms.version,
      ipAddress,
      userAgent
    })
    addAuditLog({ event: 'client.signup', userId: userRecord.id, reference })
    const accessToken = createToken({ sub: userRecord.id, role: 'client' })
    const refreshToken = createToken({ sub: userRecord.id, role: 'client', type: 'refresh' }, 60 * 60 * 24 * 30)
    return NextResponse.json({
      ok: true,
      reference,
      receivedAt: new Date().toISOString(),
      accessToken,
      refreshToken
    })
  }

  // Professional onboarding
  assert(isValidCompanyNumber(body.registrationNumber), 'Provide a valid CRO/RBN number.', 'registrationNumber')
  assert(isValidPpsNumber(body.ppsNumber), 'Provide a valid PPS number.', 'ppsNumber')
  assert(Array.isArray(body.categories) && body.categories.length > 0, 'Select at least one service category.', 'categories')
  assert(sanitizeText(body.bankAccountToken), 'Connect a Stripe bank account token.', 'bankAccountToken')

  const reference = createReference('PR')
  const professionalRecord = {
    ...baseUser,
    role: 'professional',
    reference,
    companyName: sanitizeText(body.companyName),
    registrationNumber: sanitizeText(body.registrationNumber).toUpperCase(),
    ppsNumber: sanitizeText(body.ppsNumber).toUpperCase(),
    categories: body.categories.map((category) => sanitizeText(category)).filter(Boolean),
    serviceArea: sanitizeText(body.serviceArea),
    availability: sanitizeText(body.availability),
    bankAccountToken: sanitizeText(body.bankAccountToken),
    kycStatus: 'pending',
    stripeAccountId: null,
    documents: [],
    passwordHash: hashSecret(body.password || crypto.randomUUID())
  }

  store.professionals.push(professionalRecord)
  recordAcceptance({
    userId: professionalRecord.id,
    accountType,
    version: latestTerms.version,
    ipAddress,
    userAgent
  })
  addAuditLog({ event: 'professional.signup', userId: professionalRecord.id, reference })
  const accessToken = createToken({ sub: professionalRecord.id, role: 'professional' })
  const refreshToken = createToken({ sub: professionalRecord.id, role: 'professional', type: 'refresh' }, 60 * 60 * 24 * 30)

  return NextResponse.json({
    ok: true,
    reference,
    receivedAt: new Date().toISOString(),
    kycStatus: professionalRecord.kycStatus,
    accessToken,
    refreshToken
  })
}
