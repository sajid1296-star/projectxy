type PriceFactors = {
  basePrice: number
  condition: string
  quantity: number
  category: string
  seasonality: number
  competitorPrice?: number
  stockLevel?: number
  demandLevel?: number
}

export class PricingService {
  private static readonly CONDITION_MULTIPLIERS = {
    'new': 2.0,
    'like-new': 1.8,
    'very-good': 1.6,
    'good': 1.4,
    'acceptable': 1.2
  }

  private static readonly CATEGORY_MARGINS = {
    'electronics': 0.3,
    'clothing': 0.5,
    'books': 0.4,
    'furniture': 0.6,
    'toys': 0.45,
    default: 0.4
  }

  private static readonly QUANTITY_DISCOUNTS = [
    { threshold: 50, discount: 0.15 },
    { threshold: 20, discount: 0.10 },
    { threshold: 10, discount: 0.05 },
  ]

  static calculateSellingPrice(factors: PriceFactors): number {
    let price = factors.basePrice

    // Grundmarge basierend auf Kategorie
    const categoryMargin = this.CATEGORY_MARGINS[factors.category] || this.CATEGORY_MARGINS.default
    price *= (1 + categoryMargin)

    // Zustandsmultiplikator
    const conditionMultiplier = this.CONDITION_MULTIPLIERS[factors.condition] || 1
    price *= conditionMultiplier

    // Mengenrabatt
    for (const { threshold, discount } of this.QUANTITY_DISCOUNTS) {
      if (factors.quantity >= threshold) {
        price *= (1 - discount)
        break
      }
    }

    // Saisonale Anpassung
    price *= (1 + factors.seasonality)

    // Wettbewerbsanpassung
    if (factors.competitorPrice) {
      const competitorDiff = factors.competitorPrice - price
      if (competitorDiff > 0) {
        // Wenn Wettbewerberpreis höher ist, erhöhen wir leicht
        price += competitorDiff * 0.5
      } else if (competitorDiff < 0) {
        // Wenn Wettbewerberpreis niedriger ist, senken wir leicht
        price += competitorDiff * 0.3
      }
    }

    // Lagerbestand- und Nachfrageanpassung
    if (factors.stockLevel !== undefined && factors.demandLevel !== undefined) {
      const stockDemandRatio = factors.stockLevel / factors.demandLevel
      if (stockDemandRatio > 1.5) {
        // Überbestand: Preis senken
        price *= 0.9
      } else if (stockDemandRatio < 0.5) {
        // Knapper Bestand: Preis erhöhen
        price *= 1.1
      }
    }

    // Mindestmarge sicherstellen
    const minMargin = factors.basePrice * 0.2
    if (price - factors.basePrice < minMargin) {
      price = factors.basePrice + minMargin
    }

    // Auf zwei Dezimalstellen runden
    return Number(price.toFixed(2))
  }

  static calculatePurchasePrice(factors: PriceFactors): number {
    // Maximaler Einkaufspreis basierend auf gewünschter Marge
    const targetMargin = this.CATEGORY_MARGINS[factors.category] || this.CATEGORY_MARGINS.default
    let maxPurchasePrice = factors.basePrice / (1 + targetMargin)

    // Zustandsanpassung
    const conditionMultiplier = this.CONDITION_MULTIPLIERS[factors.condition] || 1
    maxPurchasePrice /= conditionMultiplier

    // Mengenanpassung
    for (const { threshold, discount } of this.QUANTITY_DISCOUNTS) {
      if (factors.quantity >= threshold) {
        maxPurchasePrice *= (1 + discount)
        break
      }
    }

    // Saisonale Anpassung
    maxPurchasePrice /= (1 + factors.seasonality)

    return Number(maxPurchasePrice.toFixed(2))
  }
} 