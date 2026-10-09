export function calculateShipping(lines) {
  let configured = 0;
  let standardSubtotal = 0;

  for (const { product, quantity, unitPrice } of lines) {
    const policy = product.shipping || {};
    if (policy.freeShipping) continue;

    if (policy.charge !== undefined && policy.charge !== null) {
      configured += Number(policy.charge) * quantity;
    } else {
      standardSubtotal += unitPrice * quantity;
    }
  }

  // Existing storefront rule: legacy products share the standard $12 fee
  // below a $75 subtotal. Configured charges are per unit and are never counted
  // toward that legacy threshold.
  const standard = standardSubtotal > 0 && standardSubtotal < 75 ? 12 : 0;
  return roundMoney(configured + standard);
}

export function roundMoney(amount) {
  return Math.round((Number(amount) + Number.EPSILON) * 100) / 100;
}

export function calculatePayableTotal({ subtotal, discount, tax, shipping, taxInclusive }) {
  const roundedSubtotal = roundMoney(subtotal);
  const roundedDiscount = roundMoney(discount);
  const roundedTax = roundMoney(tax);
  const roundedShipping = roundMoney(shipping);
  const total = roundMoney(
    Math.max(0, roundedSubtotal - roundedDiscount + (taxInclusive ? 0 : roundedTax) + roundedShipping),
  );

  return {
    subtotal: roundedSubtotal,
    discount: roundedDiscount,
    tax: roundedTax,
    shipping: roundedShipping,
    total,
  };
}
