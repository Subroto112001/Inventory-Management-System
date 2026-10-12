const FAQ_TOPICS = [
  { id: "ordering", question: "How can I place an order?" },
  { id: "payment", question: "What payment methods are supported?" },
  { id: "shipping", question: "How is shipping calculated?" },
  { id: "delivery", question: "What is the delivery process?" },
  { id: "returns", question: "What is the return or exchange policy?" },
  { id: "support", question: "How can I contact customer support?" },
];

function answerFor(topic, product) {
  if (topic === "ordering") {
    return "Choose the quantity, add this item to your cart, and complete checkout with your delivery details.";
  }
  if (topic === "payment") {
    const payment = {
      COD_ONLY: "Cash on delivery is configured for this item.",
      ONLINE_ONLY: "Online payment is configured for this item.",
      BOTH: "Cash on delivery and online payment are configured for this item.",
    };
    return `${payment[product.paymentOption] || "Available payment options are shown during checkout."} The final options are confirmed at checkout.`;
  }
  if (topic === "shipping") {
    const shipping = product.shipping || {};
    if (shipping.freeShipping || shipping.charge === 0) {
      return shipping.instructions || "This item is marked for free shipping.";
    }
    if (shipping.charge !== undefined && shipping.charge !== null && Number.isFinite(Number(shipping.charge))) {
      return `The configured shipping charge for this item is $${Number(shipping.charge).toFixed(2)}.${shipping.instructions ? ` ${shipping.instructions}` : ""}`;
    }
    return "Any available shipping charge and delivery details are confirmed during checkout.";
  }
  if (topic === "delivery") {
    return product.shipping?.deliveryEstimate || "Delivery information, when available, is shown with the shipping details and confirmed during checkout.";
  }
  if (topic === "returns") {
    const policy = product.returnPolicy || {};
    if (policy.eligible === false) return policy.conditions || policy.instructions || "Returns are not accepted for this item.";
    if (policy.eligible === true) {
      const period = policy.windowDays ? `The listed return period is ${policy.windowDays} days. ` : "Returns are accepted under the listed conditions. ";
      return `${period}${policy.conditions || policy.instructions || "Review the product return details before ordering."}`;
    }
    return "A return policy has not been specified for this item. Contact the store before ordering if you need clarification.";
  }
  return "Use the contact details listed in the store footer for customer support.";
}

export default function ProductFaq({ product }) {
  return (
    <section className="mx-auto mt-16 max-w-[1280px] px-4 sm:px-6" aria-labelledby="product-faq-title">
      <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p className="mb-1 text-sm text-[var(--theme-secondary)]">Need to know</p>
          <h2 id="product-faq-title" className="font-serif text-3xl text-[var(--theme-text)]">Frequently asked questions</h2>
        </div>
        <div className="divide-y divide-[var(--theme-border)] border-y border-[var(--theme-border)]">
          {FAQ_TOPICS.map((topic) => (
            <details key={topic.id} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-[var(--theme-text)] marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)]">
                {topic.question}
                <span aria-hidden="true" className="text-xl leading-none text-[var(--theme-primary)] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="max-w-2xl pt-3 text-sm leading-6 text-[var(--theme-muted)]">{answerFor(topic.id, product)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
