type NotificationPreference = {
  orderId: string
  userId: string
  email: boolean
  sms: boolean
  push: boolean
  whatsapp: boolean
  statusTypes: string[]  // Welche Status-Änderungen sollen benachrichtigt werden
  language: string
}

type StatusUpdate = {
  orderId: string
  oldStatus: string
  newStatus: string
  timestamp: Date
  details?: Record<string, any>
}

export class StatusNotificationService {
  private static readonly DEFAULT_PREFERENCES: Partial<NotificationPreference> = {
    email: true,
    sms: false,
    push: false,
    whatsapp: false,
    statusTypes: ['all'],  // 'all' oder spezifische Status
    language: 'de'
  }

  static async notifyStatusChange(update: StatusUpdate): Promise<void> {
    try {
      // Benutzereinstellungen abrufen
      const preferences = await this.getUserPreferences(update.orderId)

      // Prüfen, ob dieser Status-Typ benachrichtigt werden soll
      if (!this.shouldNotify(update, preferences)) {
        return
      }

      // Benachrichtigungen parallel versenden
      await Promise.all([
        preferences.email && this.sendEmailNotification(update, preferences),
        preferences.sms && this.sendSMSNotification(update, preferences),
        preferences.push && this.sendPushNotification(update, preferences),
        preferences.whatsapp && this.sendWhatsAppNotification(update, preferences)
      ])

      // Benachrichtigungsprotokoll speichern
      await this.logNotification(update)

    } catch (error) {
      console.error('Fehler beim Senden der Statusbenachrichtigung:', error)
      throw error
    }
  }

  private static shouldNotify(
    update: StatusUpdate,
    preferences: NotificationPreference
  ): boolean {
    return preferences.statusTypes.includes('all') ||
           preferences.statusTypes.includes(update.newStatus)
  }

  private static async getUserPreferences(
    orderId: string
  ): Promise<NotificationPreference> {
    try {
      // Benutzereinstellungen aus der Datenbank abrufen
      const userPrefs = await prisma.notificationPreferences.findFirst({
        where: { orderId }
      })

      // Mit Standardeinstellungen zusammenführen
      return {
        ...this.DEFAULT_PREFERENCES,
        ...userPrefs
      } as NotificationPreference
    } catch (error) {
      console.error('Fehler beim Abrufen der Benutzereinstellungen:', error)
      return this.DEFAULT_PREFERENCES as NotificationPreference
    }
  }

  private static async sendEmailNotification(
    update: StatusUpdate,
    preferences: NotificationPreference
  ): Promise<void> {
    const template = await this.getStatusEmailTemplate(
      update.newStatus,
      preferences.language
    )

    await emailService.send({
      to: preferences.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      data: {
        orderId: update.orderId,
        status: update.newStatus,
        timestamp: update.timestamp,
        ...update.details
      }
    })
  }

  private static async sendSMSNotification(
    update: StatusUpdate,
    preferences: NotificationPreference
  ): Promise<void> {
    const message = await this.getStatusSMSTemplate(
      update.newStatus,
      preferences.language
    )

    await smsService.send({
      to: preferences.phone,
      message: message,
      data: {
        orderId: update.orderId,
        status: update.newStatus
      }
    })
  }

  private static async sendPushNotification(
    update: StatusUpdate,
    preferences: NotificationPreference
  ): Promise<void> {
    const notification = await this.getStatusPushTemplate(
      update.newStatus,
      preferences.language
    )

    await pushService.send({
      userId: preferences.userId,
      title: notification.title,
      body: notification.body,
      data: {
        orderId: update.orderId,
        status: update.newStatus,
        timestamp: update.timestamp
      }
    })
  }

  private static async sendWhatsAppNotification(
    update: StatusUpdate,
    preferences: NotificationPreference
  ): Promise<void> {
    const message = await this.getStatusWhatsAppTemplate(
      update.newStatus,
      preferences.language
    )

    await whatsappService.send({
      to: preferences.whatsapp,
      message: message,
      data: {
        orderId: update.orderId,
        status: update.newStatus
      }
    })
  }

  private static async logNotification(update: StatusUpdate): Promise<void> {
    await prisma.notificationLog.create({
      data: {
        orderId: update.orderId,
        oldStatus: update.oldStatus,
        newStatus: update.newStatus,
        timestamp: update.timestamp,
        details: update.details
      }
    })
  }
} 