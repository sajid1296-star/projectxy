type ExtendedPriceFactors = {
  basePrice: number
  condition: string
  quantity: number
  category: string
  seasonality: number
  competitorPrice?: number
  stockLevel?: number
  demandLevel?: number
  // Neue Faktoren
  brand: string
  age: number // Alter in Monaten
  trendFactor: number // -1 bis 1
  marketPosition: 'premium' | 'standard' | 'budget'
  shippingCost: number
  returnRate: number
  promotionalPeriod: boolean
  lastSaleDate?: Date
  averageSalesVelocity?: number
}

export class AdvancedPricingService extends PricingService {
  private static readonly BRAND_MULTIPLIERS: Record<string, number> = {
    'premium': 1.4,
    'standard': 1.2,
    'budget': 1.0
  }

  private static readonly MARKET_POSITION_MARGINS: Record<string, number> = {
    'premium': 0.5,
    'standard': 0.35,
    'budget': 0.25
  }

  static calculateAdvancedPrice(factors: ExtendedPriceFactors): number {
    let price = super.calculateSellingPrice(factors)

    // Markeneinfluss
    const brandMultiplier = this.BRAND_MULTIPLIERS[factors.brand] || 1.1
    price *= brandMultiplier

    // Altersbasierte Anpassung
    if (factors.age > 12) {
      price *= Math.max(0.7, 1 - (factors.age - 12) * 0.02)
    }

    // Trend-Einfluss
    price *= (1 + factors.trendFactor * 0.2)

    // Marktpositionierung
    const positionMargin = this.MARKET_POSITION_MARGINS[factors.marketPosition] || 0.35
    price *= (1 + positionMargin)

    // Versandkosten-Optimierung
    if (factors.shippingCost > price * 0.1) {
      price *= 1.05 // Preiserhöhung bei hohen Versandkosten
    }

    // Retourenrate-Anpassung
    if (factors.returnRate > 0.1) {
      price *= (1 + factors.returnRate * 0.5)
    }

    // Aktionszeitraum
    if (factors.promotionalPeriod) {
      price *= 0.9
    }

    // Verkaufsgeschwindigkeit
    if (factors.averageSalesVelocity && factors.lastSaleDate) {
      const daysSinceLastSale = (new Date().getTime() - factors.lastSaleDate.getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceLastSale > factors.averageSalesVelocity * 2) {
        price *= 0.95 // Preissenkung bei langsamem Verkauf
      }
    }

    return Number(price.toFixed(2))
  }
} 