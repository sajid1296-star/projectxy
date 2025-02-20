type EmailTemplate = {
  id: string
  subject: string
  html: string
  text: string
  variables: string[]
}

export class EmailTemplateService {
  private static templates: Record<string, EmailTemplate> = {
    RETURN_LABEL_STANDARD: {
      id: 'return_label_standard',
      subject: 'Ihr Rücksendelabel für Bestellung {{orderId}}',
      html: `
        <h1>Ihr Rücksendelabel für die Bestellung {{orderId}}</h1>
        <p>Sehr geehrte(r) {{customerName}},</p>
        <p>anbei finden Sie Ihr Rücksendelabel. Das Label ist gültig bis zum {{validUntil}}.</p>
        <p>Tracking-Nummer: {{trackingNumber}}</p>
        <p>Versanddienstleister: {{carrier}}</p>
        {{#instructions}}
      `,
      text: 'Ihr Rücksendelabel für die Bestellung {{orderId}}...',
      variables: ['orderId', 'customerName', 'validUntil', 'trackingNumber', 'carrier']
    },
    RETURN_LABEL_EXPRESS: {
      id: 'return_label_express',
      subject: 'Ihr Express-Rücksendelabel für Bestellung {{orderId}}',
      html: `
        <h1>Ihr Express-Rücksendelabel für die Bestellung {{orderId}}</h1>
        <p>Sehr geehrte(r) {{customerName}},</p>
        <p>anbei finden Sie Ihr Express-Rücksendelabel...</p>
      `,
      text: 'Ihr Express-Rücksendelabel für die Bestellung {{orderId}}...',
      variables: ['orderId', 'customerName', 'validUntil', 'trackingNumber', 'carrier']
    },
    RETURN_LABEL_INTERNATIONAL: {
      id: 'return_label_international',
      subject: 'Your Return Label for Order {{orderId}}',
      html: `
        <h1>Your Return Label for Order {{orderId}}</h1>
        <p>Dear {{customerName}},</p>
        <p>Please find your return label attached...</p>
      `,
      text: 'Your Return Label for Order {{orderId}}...',
      variables: ['orderId', 'customerName', 'validUntil', 'trackingNumber', 'carrier']
    }
  }

  static getTemplate(templateId: string, data: Record<string, string>): string {
    const template = this.templates[templateId]
    if (!template) {
      throw new Error('E-Mail-Vorlage nicht gefunden')
    }

    let html = template.html
    template.variables.forEach(variable => {
      const value = data[variable] || ''
      html = html.replace(new RegExp(`{{${variable}}}`, 'g'), value)
    })

    return html
  }
} 