import { NextApiRequest, NextApiResponse } from 'next'
import { ShippingLabelService } from '@/services/ShippingLabelService'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { orderId, customerAddress } = req.body

    if (!orderId || !customerAddress) {
      return res.status(400).json({ 
        message: 'Auftrags-ID und Kundenadresse sind erforderlich' 
      })
    }

    const label = await ShippingLabelService.generateReturnLabel(
      orderId,
      customerAddress
    )

    // Automatischer E-Mail-Versand
    await ShippingLabelService.sendLabelByEmail(
      label,
      customerAddress.email
    )

    return res.status(200).json(label)
  } catch (error) {
    console.error('Fehler bei der Verarbeitung:', error)
    return res.status(500).json({ 
      message: 'Interner Serverfehler bei der Label-Generierung' 
    })
  }
} 