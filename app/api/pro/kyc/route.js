import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { getStore, addAuditLog } from '../../../../lib/memory-store'
import { sanitizeText } from '../../../../lib/validation'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  const store = getStore()
  const body = await request.json()
  const professionalId = sanitizeText(body.professionalId)
  const professional = store.professionals.find((pro) => pro.id === professionalId)

  if (!professional) {
    return NextResponse.json({ ok: false, message: 'Professional not found.' }, { status: 404 })
  }

  professional.documents.push({
    id: crypto.randomUUID(),
    type: sanitizeText(body.type),
    url: sanitizeText(body.url),
    uploadedAt: new Date().toISOString()
  })
  professional.kycStatus = sanitizeText(body.kycStatus || professional.kycStatus)

  addAuditLog({ event: 'professional.kyc.update', userId: professional.id, status: professional.kycStatus })

  return NextResponse.json({ ok: true, professional })
}
