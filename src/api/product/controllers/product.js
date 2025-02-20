'use strict';

module.exports = {
  async ankauf(ctx) {
    try {
      const { data } = ctx.request.body;
      
      // Preisberechnung basierend auf Produktzustand und Kategorie
      const calculatedPrice = await this.calculateBuyPrice(data);
      
      // Erstelle vorläufigen Produkteintrag
      const entry = await strapi.entityService.create('api::product.product', {
        data: {
          title: data.title,
          description: data.description,
          condition: data.condition,
          category: data.categoryId,
          status: 'in_pruefung',
          originalPrice: data.originalPrice,
          price: calculatedPrice,
          seller: ctx.state.user.id,
        },
      });

      return {
        success: true,
        data: entry,
        estimatedPrice: calculatedPrice,
      };
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async calculateBuyPrice(productData) {
    // Implementiere deine Preisberechnungslogik hier
    // Dies ist ein vereinfachtes Beispiel
    const basePrice = productData.originalPrice || 0;
    const conditionFactors = {
      neu: 0.7,
      sehr_gut: 0.6,
      gut: 0.5,
      akzeptabel: 0.4,
    };
    
    return basePrice * conditionFactors[productData.condition];
  },
}; 