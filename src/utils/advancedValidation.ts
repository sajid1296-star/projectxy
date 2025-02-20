type ValidationContext = {
  existingSkus: Set<string>
  categoryRules: Record<string, {
    minPrice: number
    maxPrice: number
    allowedConditions: string[]
  }>
  brandRules: Record<string, {
    requiredFields: string[]
    allowedCategories: string[]
  }>
}

export class AdvancedValidation {
  private static readonly PRICE_PATTERNS = {
    premium: /^[1-9][0-9]*\.?[0-9]*$/,
    standard: /^[0-9]+\.?[0-9]*$/,
    budget: /^[0-9]+\.?[0-9]*$/
  }

  private static readonly SKU_PATTERNS = {
    electronics: /^EL[A-Z0-9]{8}$/,
    clothing: /^CL[A-Z0-9]{8}$/,
    books: /^BK[A-Z0-9]{8}$/,
    furniture: /^FN[A-Z0-9]{8}$/
  }

  static validateProduct(product: any, context: ValidationContext): string[] {
    const errors: string[] = []

    // SKU-Validierung
    if (!this.validateSku(product.sku, product.category, context.existingSkus)) {
      errors.push('Ungültiges oder dupliziertes SKU-Format')
    }

    // Kategorie-spezifische Validierung
    const categoryRules = context.categoryRules[product.category]
    if (categoryRules) {
      if (product.price < categoryRules.minPrice || product.price > categoryRules.maxPrice) {
        errors.push(`Preis außerhalb des erlaubten Bereichs für ${product.category}`)
      }
      if (!categoryRules.allowedConditions.includes(product.condition)) {
        errors.push(`Unzulässiger Zustand für ${product.category}`)
      }
    }

    // Marken-spezifische Validierung
    const brandRules = context.brandRules[product.brand]
    if (brandRules) {
      for (const field of brandRules.requiredFields) {
        if (!product[field]) {
          errors.push(`${field} ist für ${product.brand} erforderlich`)
        }
      }
      if (!brandRules.allowedCategories.includes(product.category)) {
        errors.push(`${product.category} ist keine zulässige Kategorie für ${product.brand}`)
      }
    }

    // Preis-Pattern-Validierung
    if (!this.PRICE_PATTERNS[product.marketPosition]?.test(String(product.price))) {
      errors.push('Ungültiges Preisformat für die Marktposition')
    }

    return errors
  }

  static validateBatch(products: any[], context: ValidationContext): {
    valid: boolean
    errors: Record<number, string[]>
  } {
    const errors: Record<number, string[]> = {}
    let valid = true

    products.forEach((product, index) => {
      const productErrors = this.validateProduct(product, context)
      if (productErrors.length > 0) {
        errors[index] = productErrors
        valid = false
      }
    })

    return { valid, errors }
  }

  private static validateSku(sku: string, category: string, existingSkus: Set<string>): boolean {
    if (existingSkus.has(sku)) return false
    const pattern = this.SKU_PATTERNS[category]
    return pattern ? pattern.test(sku) : false
  }
} 