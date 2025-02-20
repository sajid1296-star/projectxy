type MarketData = {
  competitorPrices: number[]
  marketShare: number
  demandTrend: number
  seasonalityIndex: number
}

type ProductData = {
  age: number
  condition: string
  brand: string
  category: string
  uniqueSellingPoints: string[]
  sustainabilityScore: number
  qualityRating: number
}

type OperationalData = {
  stockLevel: number
  warehouseCosts: number
  shippingCosts: number
  returnRate: number
  handlingCosts: number
}

export class ExtendedPricingService extends AdvancedPricingService {
  private static readonly SUSTAINABILITY_PREMIUM = 0.15
  private static readonly QUALITY_MULTIPLIERS = {
    5: 1.3,  // 5 Sterne
    4: 1.15, // 4 Sterne
    3: 1.0,  // 3 Sterne
    2: 0.9,  // 2 Sterne
    1: 0.8   // 1 Stern
  }

  static calculateExtendedPrice(
    basePrice: number,
    marketData: MarketData,
    productData: ProductData,
    operationalData: OperationalData
  ): number {
    let price = basePrice

    // Marktbasierte Anpassungen
    const competitorAverage = this.calculateCompetitorAverage(marketData.competitorPrices)
    const marketAdjustment = this.calculateMarketAdjustment(
      price,
      competitorAverage,
      marketData.marketShare,
      marketData.demandTrend
    )
    price *= (1 + marketAdjustment)

    // Produktbasierte Anpassungen
    price *= this.calculateProductMultiplier(productData)

    // Nachhaltigkeitsprämie
    if (productData.sustainabilityScore > 0.7) {
      price *= (1 + this.SUSTAINABILITY_PREMIUM)
    }

    // Qualitätsbasierte Anpassung
    const qualityMultiplier = this.QUALITY_MULTIPLIERS[
      Math.round(productData.qualityRating)
    ] || 1.0
    price *= qualityMultiplier

    // Operative Kostenanpassungen
    price = this.adjustForOperationalCosts(price, operationalData)

    // Saisonale Anpassung
    price *= (1 + (marketData.seasonalityIndex - 1) * 0.2)

    // Mindestmarge sicherstellen
    const minMargin = this.calculateMinimumMargin(
      basePrice,
      operationalData.handlingCosts,
      operationalData.warehouseCosts
    )
    if (price - basePrice < minMargin) {
      price = basePrice + minMargin
    }

    return Number(price.toFixed(2))
  }

  private static calculateCompetitorAverage(prices: number[]): number {
    return prices.reduce((a, b) => a + b, 0) / prices.length
  }

  private static calculateMarketAdjustment(
    currentPrice: number,
    competitorAverage: number,
    marketShare: number,
    demandTrend: number
  ): number {
    const competitivenessAdjustment = (competitorAverage - currentPrice) / currentPrice
    const marketShareAdjustment = marketShare > 0.3 ? 0.1 : 0
    const trendAdjustment = demandTrend * 0.2

    return competitivenessAdjustment + marketShareAdjustment + trendAdjustment
  }

  private static calculateProductMultiplier(productData: ProductData): number {
    let multiplier = 1.0

    // USP-Bonus
    multiplier += productData.uniqueSellingPoints.length * 0.05

    // Markeneinfluss
    if (this.BRAND_MULTIPLIERS[productData.brand]) {
      multiplier *= this.BRAND_MULTIPLIERS[productData.brand]
    }

    // Kategorieeinfluss
    if (this.CATEGORY_MARGINS[productData.category]) {
      multiplier *= (1 + this.CATEGORY_MARGINS[productData.category])
    }

    return multiplier
  }

  private static adjustForOperationalCosts(
    price: number,
    operationalData: OperationalData
  ): number {
    const totalCosts = 
      operationalData.warehouseCosts +
      operationalData.shippingCosts +
      operationalData.handlingCosts

    // Kostendeckung sicherstellen
    const minPrice = totalCosts * 1.2 // 20% Mindestmarge über Kosten
    if (price < minPrice) {
      price = minPrice
    }

    // Lagerbestandsanpassung
    if (operationalData.stockLevel > 100) {
      price *= 0.95 // Rabatt bei hohem Lagerbestand
    } else if (operationalData.stockLevel < 10) {
      price *= 1.1 // Aufschlag bei niedrigem Lagerbestand
    }

    // Retourenanpassung
    if (operationalData.returnRate > 0.1) {
      price *= (1 + operationalData.returnRate) // Kompensation für Retouren
    }

    return price
  }

  private static calculateMinimumMargin(
    basePrice: number,
    handlingCosts: number,
    warehouseCosts: number
  ): number {
    return Math.max(
      basePrice * 0.2, // Mindestens 20% Marge
      (handlingCosts + warehouseCosts) * 1.5 // Oder 150% der operativen Kosten
    )
  }
} 