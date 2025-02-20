type AdvancedEmailTemplate = {
  id: string
  subject: string
  html: string
  text: string
  variables: string[]
  attachments?: {
    type: string
    name: string
    content?: string
  }[]
  conditions?: {
    field: string
    operator: 'equals' | 'contains' | 'greater' | 'less'
    value: any
  }[]
}

export class AdvancedEmailTemplateService {
  private static advancedTemplates: Record<string, AdvancedEmailTemplate> = {
    RETURN_PREMIUM: {
      id: 'return_premium',
      subject: 'Ihr Premium-Rücksendelabel für {{orderId}}',
      html: `
        <div style="background-color: #f8f8f8; padding: 20px;">
          <h1 style="color: #333;">Premium-Rücksendung</h1>
          <p>Sehr geehrte(r) {{customerName}},</p>
          <p>als Premium-Kunde genießen Sie folgende Vorteile:</p>
          <ul>
            <li>Express-Rückversand</li>
            <li>Bevorzugte Bearbeitung</li>
            <li>Erweiterte Versicherung</li>
          </ul>
        </div>
      `,
      text: 'Premium-Rücksendung für {{orderId}}...',
      variables: ['orderId', 'customerName'],
      conditions: [
        { field: 'customerType', operator: 'equals', value: 'premium' }
      ]
    },
    RETURN_BULK: {
      id: 'return_bulk',
      subject: 'Ihre Rücksendelabel für Mehrfachsendungen',
      html: `
        <div style="background-color: #f8f8f8; padding: 20px;">
          <h1 style="color: #333;">Mehrfach-Rücksendung</h1>
          <p>Sehr geehrte(r) {{customerName}},</p>
          <p>anbei finden Sie die Label für Ihre {{packageCount}} Pakete.</p>
          <p>Bitte beachten Sie die Nummerierung auf den Labels.</p>
        </div>
      `,
      text: 'Mehrfach-Rücksendung...',
      variables: ['customerName', 'packageCount']
    },
    RETURN_INTERNATIONAL: {
      id: 'return_international',
      subject: 'Your International Return Labels',
      html: `
        <div style="background-color: #f8f8f8; padding: 20px;">
          <h1 style="color: #333;">International Return</h1>
          <p>Dear {{customerName}},</p>
          <p>Please find attached:</p>
          <ul>
            <li>Return shipping label</li>
            <li>Customs declaration form</li>
            <li>Commercial invoice</li>
          </ul>
        </div>
      `,
      text: 'International return documents...',
      variables: ['customerName'],
      attachments: [
        { type: 'pdf', name: 'customs_declaration.pdf' },
        { type: 'pdf', name: 'commercial_invoice.pdf' }
      ]
    }
  }

  static async generateEmail(
    templateId: string,
    data: Record<string, any>
  ): Promise<{
    subject: string
    html: string
    text: string
    attachments?: any[]
  }> {
    const template = this.advancedTemplates[templateId]
    if (!template) {
      throw new Error('E-Mail-Vorlage nicht gefunden')
    }

    // Bedingungen prüfen
    if (template.conditions) {
      const meetsConditions = template.conditions.every(condition => {
        const value = data[condition.field]
        switch (condition.operator) {
          case 'equals':
            return value === condition.value
          case 'contains':
            return value.includes(condition.value)
          case 'greater':
            return value > condition.value
          case 'less':
            return value < condition.value
          default:
            return false
        }
      })

      if (!meetsConditions) {
        throw new Error('Bedingungen für Template nicht erfüllt')
      }
    }

    // Template verarbeiten
    let html = template.html
    let text = template.text
    let subject = template.subject

    template.variables.forEach(variable => {
      const value = data[variable] || ''
      const regex = new RegExp(`{{${variable}}}`, 'g')
      html = html.replace(regex, value)
      text = text.replace(regex, value)
      subject = subject.replace(regex, value)
    })

    return {
      subject,
      html,
      text,
      attachments: template.attachments
    }
  }
} 