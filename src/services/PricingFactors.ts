type MarketConditions = {
  competitorPrices: number[]
  marketShare: number
  demandTrend: number
  seasonalityIndex: number
  marketSaturation: number
  priceElasticity: number
  promotionalPeriod: boolean
}

type ProductAttributes = {
  age: number
  condition: string
  brand: string
  category: string
  uniqueSellingPoints: string[]
  sustainabilityScore: number
  qualityRating: number
  popularity: number
  stockRotation: number
  lastSaleDate: Date
  warrantyPeriod: number
}

type OperationalFactors = {
  stockLevel: number
  warehouseCosts: number
  shippingCosts: number
  returnRate: number
  handlingCosts: number
  marketingCosts: number
  overheadAllocation: number
  supplierTerms: {
    minimumMargin: number
    volumeDiscounts: Array<{
      quantity: number
      discount: number
    }>
  }
}

export class PricingFactors {
  private static readonly TREND_IMPACT = {
    strong_positive: 0.15,
    positive: 0.08,
    neutral: 0,
    negative: -0.05,
    strong_negative: -0.12
  }

  private static readonly POPULARITY_MULTIPLIER = {
    high: 1.15,
    medium: 1.0,
    low: 0.9
  }

  static calculatePriceAdjustments(
    basePrice: number,
    market: MarketConditions,
    product: ProductAttributes,
    operations: OperationalFactors
  ): {
    finalPrice: number,
    adjustments: Record<string, number>
  } {
    const adjustments: Record<string, number> = {}
    let price = basePrice

    // Marktbasierte Anpassungen
    adjustments.market = this.calculateMarketAdjustment(price, market)
    price *= (1 + adjustments.market)

    // Produktbasierte Anpassungen
    adjustments.product = this.calculateProductAdjustment(product)
    price *= (1 + adjustments.product)

    // Operative Anpassungen
    adjustments.operational = this.calculateOperationalAdjustment(price, operations)
    price *= (1 + adjustments.operational)

    // Dynamische Preisanpassung
    adjustments.dynamic = this.calculateDynamicAdjustment(
      price,
      product,
      market,
      operations
    )
    price *= (1 + adjustments.dynamic)

    return {
      finalPrice: Number(price.toFixed(2)),
      adjustments
    }
  }

  private static calculateMarketAdjustment(
    price: number,
    market: MarketConditions
  ): number {
    let adjustment = 0

    // Wettbewerbsbasierte Anpassung
    const competitorAvg = market.competitorPrices.reduce((a, b) => a + b, 0) / 
                         market.competitorPrices.length
    adjustment += (competitorAvg - price) / price * 0.5

    // Marktanteilsbasierte Anpassung
    adjustment += market.marketShare > 0.3 ? 0.05 : 0

    // Elastizitätsbasierte Anpassung
    adjustment += (1 - market.priceElasticity) * 0.1

    // Sättigungsbasierte Anpassung
    adjustment -= market.marketSaturation * 0.1

    return adjustment
  }

  private static calculateProductAdjustment(
    product: ProductAttributes
  ): number {
    let adjustment = 0

    // Popularitätsanpassung
    adjustment += this.POPULARITY_MULTIPLIER[
      product.popularity > 0.7 ? 'high' :
      product.popularity > 0.3 ? 'medium' : 'low'
    ] - 1

    // Garantieanpassung
    adjustment += product.warrantyPeriod * 0.02

    // Rotationsanpassung
    adjustment -= Math.max(0, (product.stockRotation - 30) * 0.001)

    // Alterungsanpassung
    const ageInMonths = product.age
    if (ageInMonths > 12) {
      adjustment -= Math.min(0.3, (ageInMonths - 12) * 0.02)
    }

    return adjustment
  }

  private static calculateOperationalAdjustment(
    price: number,
    operations: OperationalFactors
  ): number {
    let adjustment = 0

    // Kostenbasierte Anpassung
    const totalCosts = 
      operations.warehouseCosts +
      operations.shippingCosts +
      operations.handlingCosts +
      operations.marketingCosts +
      operations.overheadAllocation

    const costRatio = totalCosts / price
    adjustment += Math.max(0, costRatio - 0.4) * 0.5

    // Mengenrabattanpassung
    for (const { quantity, discount } of operations.supplierTerms.volumeDiscounts) {
      if (operations.stockLevel >= quantity) {
        adjustment -= discount
        break
      }
    }

    return adjustment
  }

  private static calculateDynamicAdjustment(
    price: number,
    product: ProductAttributes,
    market: MarketConditions,
    operations: OperationalFactors
  ): number {
    let adjustment = 0

    // Zeitbasierte Anpassung
    const daysSinceLastSale = 
      (new Date().getTime() - product.lastSaleDate.getTime()) / 
      (1000 * 60 * 60 * 24)
    
    if (daysSinceLastSale > 30) {
      adjustment -= Math.min(0.2, daysSinceLastSale * 0.005)
    }

    // Bestandsbasierte Anpassung
    if (operations.stockLevel > 100) {
      adjustment -= 0.1
    } else if (operations.stockLevel < 10) {
      adjustment += 0.1
    }

    // Saisonale Anpassung
    adjustment += (market.seasonalityIndex - 1) * 0.2

    return adjustment
  }
} 