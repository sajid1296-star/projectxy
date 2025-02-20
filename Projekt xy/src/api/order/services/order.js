'use strict';

module.exports = {
  async sendOrderConfirmation(order) {
    try {
      await strapi.plugins['email'].services.email.send({
        to: order.user.email,
        subject: `Bestellung #${order.orderNumber} bestätigt`,
        html: `
          <h1>Vielen Dank für Ihre Bestellung!</h1>
          <p>Ihre Bestellnummer: ${order.orderNumber}</p>
          <h2>Bestellübersicht:</h2>
          <ul>
            ${order.items.map(item => `
              <li>${item.attributes.title} - ${item.quantity}x - ${item.attributes.price}€</li>
            `).join('')}
          </ul>
          <p>Gesamtbetrag: ${order.total}€</p>
          <p>Status: ${order.status}</p>
        `,
      });
    } catch (error) {
      console.error('E-Mail-Versand fehlgeschlagen:', error);
    }
  },

  async sendShippingConfirmation(order) {
    try {
      await strapi.plugins['email'].services.email.send({
        to: order.user.email,
        subject: `Bestellung #${order.orderNumber} wurde versandt`,
        html: `
          <h1>Ihre Bestellung wurde versandt!</h1>
          <p>Bestellnummer: ${order.orderNumber}</p>
          <p>Tracking-Nummer: ${order.trackingNumber}</p>
          <p>Sie können Ihre Sendung hier verfolgen: [Tracking-Link]</p>
        `,
      });
    } catch (error) {
      console.error('E-Mail-Versand fehlgeschlagen:', error);
    }
  }
}; 