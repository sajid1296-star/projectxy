type TrackingUpdate = {
  orderId: string
  orderType: 'purchase' | 'sales'
  status: string
  timestamp: Date
  location?: string
  note?: string
}

export class TrackingAPI {
  static async updateTracking(update: TrackingUpdate): Promise<void> {
    try {
      await fetch('/api/tracking/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(update),
      })
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Trackings:', error)
      throw error
    }
  }

  static async getTrackingInfo(
    orderType: 'purchase' | 'sales',
    orderId: string
  ) {
    try {
      const response = await fetch(`/api/tracking/${orderType}/${orderId}`)
      if (!response.ok) {
        throw new Error('Tracking-Informationen konnten nicht geladen werden')
      }
      return await response.json()
    } catch (error) {
      console.error('Fehler beim Laden der Tracking-Informationen:', error)
      throw error
    }
  }

  static async subscribeToUpdates(
    orderType: 'purchase' | 'sales',
    orderId: string,
    email: string
  ): Promise<void> {
    try {
      await fetch('/api/tracking/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderType,
          orderId,
          email,
        }),
      })
    } catch (error) {
      console.error('Fehler beim Abonnieren von Updates:', error)
      throw error
    }
  }
} 