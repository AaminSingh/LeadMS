/**
 * Calculates quotation breakdown based on selected products and vendor pricing profile.
 *
 * @param {Array<{ basePrice: number, quantity: number }>} items
 * @param {{ marginPercentage?: number, installationPrice?: number, miscCharges?: number }} vendorProfile
 * @returns {{
 *   baseTotal: number,
 *   marginAmount: number,
 *   subtotalWithMargin: number,
 *   installationPrice: number,
 *   miscCharges: number,
 *   finalTotal: number
 * }}
 */
export function calculateQuote(items = [], vendorProfile = {}) {
  const marginPct = Number(vendorProfile?.marginPercentage || 0)
  const installPrice = Number(vendorProfile?.installationPrice || 0)
  const misc = Number(vendorProfile?.miscCharges || 0)

  // 1. Base Total = Sum of (item.basePrice * item.quantity)
  const baseTotal = items.reduce((sum, item) => {
    const price = Number(item.basePrice || 0)
    const qty = Number(item.quantity || 1)
    return sum + price * qty
  }, 0)

  // 2. Apply Margin
  const marginAmount = baseTotal * (marginPct / 100)
  const subtotalWithMargin = baseTotal + marginAmount

  // 3. Final Total
  const finalTotal = subtotalWithMargin + installPrice + misc

  return {
    baseTotal: Number(baseTotal.toFixed(2)),
    marginAmount: Number(marginAmount.toFixed(2)),
    subtotalWithMargin: Number(subtotalWithMargin.toFixed(2)),
    installationPrice: Number(installPrice.toFixed(2)),
    miscCharges: Number(misc.toFixed(2)),
    finalTotal: Number(finalTotal.toFixed(2)),
  }
}
