'use strict';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = {
  async createCheckoutSession(ctx) {
    const { items } = ctx.request.body;

    // Erstelle eine eindeutige Bestellnummer
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.attributes.title,
          },
          unit_amount: Math.round(item.attributes.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/erfolg?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/fehler`,
      metadata: {
        orderNumber,
      },
    });

    // Erstelle die Bestellung in der Datenbank
    const order = await strapi.entityService.create('api::order.order', {
      data: {
        orderNumber,
        user: ctx.state.user.id,
        items,
        total: items.reduce((sum, item) => sum + (item.attributes.price * item.quantity), 0),
        status: 'pending',
        paymentStatus: 'pending',
      },
    });

    return { id: session.id, orderNumber };
  },

  async handleWebhook(ctx) {
    const sig = ctx.request.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        ctx.request.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      ctx.throw(400, `Webhook Error: ${err.message}`);
      return;
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Aktualisiere die Bestellung
      const order = await strapi.db.query('api::order.order').findOne({
        where: { orderNumber: session.metadata.orderNumber }
      });

      if (order) {
        await strapi.entityService.update('api::order.order', order.id, {
          data: {
            paymentStatus: 'paid',
            status: 'processing',
          }
        });

        // Sende Bestätigungs-E-Mail
        await strapi.service('api::order.order').sendOrderConfirmation(order);
      }
    }

    ctx.send({ received: true });
  },
}; 