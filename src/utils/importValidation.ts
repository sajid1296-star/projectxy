type ValidationRule = {
  field: string
  type: 'required' | 'number' | 'string' | 'enum' | 'range' | 'format'
  options?: {
    min?: number
    max?: number
    pattern?: RegExp
    values?: string[]
    message?: string
  }
}

export const importValidationRules: ValidationRule[] = [
  {
    field: 'sku',
    type: 'required',
    options: {
      message: 'SKU ist erforderlich'
    }
  },
  {
    field: 'sku',
    type: 'format',
    options: {
      pattern: /^[A-Z0-9]{6,12}$/,
      message: 'SKU muss 6-12 Zeichen lang sein und nur Großbuchstaben und Zahlen enthalten'
    }
  },
  {
    field: 'name',
    type: 'required',
    options: {
      message: 'Produktname ist erforderlich'
    }
  },
  {
    field: 'brand',
    type: 'required',
    options: {
      message: 'Marke ist erforderlich'
    }
  },
  {
    field: 'category',
    type: 'enum',
    options: {
      values: ['electronics', 'clothing', 'books', 'furniture', 'toys'],
      message: 'Ungültige Kategorie'
    }
  },
  {
    field: 'condition',
    type: 'enum',
    options: {
      values: ['new', 'like-new', 'very-good', 'good', 'acceptable'],
      message: 'Ungültiger Zustand'
    }
  },
  {
    field: 'supplierPrice',
    type: 'number',
    options: {
      min: 0.01,
      message: 'Lieferantenpreis muss größer als 0 sein'
    }
  },
  {
    field: 'quantity',
    type: 'number',
    options: {
      min: 1,
      message: 'Menge muss mindestens 1 sein'
    }
  },
  {
    field: 'marketPosition',
    type: 'enum',
    options: {
      values: ['premium', 'standard', 'budget'],
      message: 'Ungültige Marktpositionierung'
    }
  }
]

export function validateImportData(data: any[]): {
  valid: boolean
  errors: Array<{ row: number, field: string, message: string }>
} {
  const errors: Array<{ row: number, field: string, message: string }> = []

  data.forEach((row, index) => {
    importValidationRules.forEach(rule => {
      const value = row[rule.field]

      switch (rule.type) {
        case 'required':
          if (!value) {
            errors.push({
              row: index + 1,
              field: rule.field,
              message: rule.options?.message || `${rule.field} ist erforderlich`
            })
          }
          break

        case 'number':
          if (isNaN(value) || 
              (rule.options?.min !== undefined && value < rule.options.min) ||
              (rule.options?.max !== undefined && value > rule.options.max)) {
            errors.push({
              row: index + 1,
              field: rule.field,
              message: rule.options?.message || `Ungültiger Wert für ${rule.field}`
            })
          }
          break

        case 'enum':
          if (!rule.options?.values?.includes(value)) {
            errors.push({
              row: index + 1,
              field: rule.field,
              message: rule.options?.message || `Ungültiger Wert für ${rule.field}`
            })
          }
          break

        case 'format':
          if (!rule.options?.pattern?.test(value)) {
            errors.push({
              row: index + 1,
              field: rule.field,
              message: rule.options?.message || `Ungültiges Format für ${rule.field}`
            })
          }
          break
      }
    })
  })

  return {
    valid: errors.length === 0,
    errors
  }
} 