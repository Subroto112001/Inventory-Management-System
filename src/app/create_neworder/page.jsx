"use client";

import { IconProvider } from "@/Provider/IconProvider";
import Link from "next/link";
import React, { useState, useMemo } from "react";

const AVAILABLE_PRODUCTS = [
  { id: "p1", name: "Premium Wireless Headphones", sku: "SKU001", price: 200 },
  { id: "p2", name: "Ergonomic Office Chair", sku: "SKU002", price: 850 },
  { id: "p3", name: "Mechanical Keyboard", sku: "SKU003", price: 120 },
  { id: "p4", name: "USB-C Fast Charger", sku: "SKU004", price: 45 },
];

export default function CreateOrderPage() {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [cart, setCart] = useState([]);
  // প্রোডাক্ট সার্চ করার জন্য নতুন স্টেট
  const [searchQuery, setSearchQuery] = useState("");

  const { subtotal, tax, grandTotal } = useMemo(() => {
    const sub = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    const calculatedTax = sub * 0.1;
    return {
      subtotal: sub,
      tax: calculatedTax,
      grandTotal: sub + calculatedTax,
    };
  }, [cart]);

  // সার্চ কোয়েরি অনুযায়ী প্রোডাক্ট ফিল্টার করার লজিক
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return AVAILABLE_PRODUCTS;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return AVAILABLE_PRODUCTS.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerCaseQuery) ||
        product.sku.toLowerCase().includes(lowerCaseQuery),
    );
  }, [searchQuery]);

  const addToOrder = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromOrder = (productId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const generateMemo = () => {
    if (cart.length === 0) {
      alert("Please add products to the order before generating a memo.");
      return;
    }
    window.print();
  };

  return (
    <main className="p-5 mx-auto min-h-screen">
      <header className="mb-6 print:hidden">
        <Link
          href="/products"
          className="inline-flex gap-2 items-center text-gray-800 hover:text-[#611F69] focus:outline-none focus:ring-2 focus:ring-[#611F69] rounded-md transition-colors"
          aria-label="Go back to products page"
        >
          <span className="text-2xl text-[#611F69]" aria-hidden="true">
            {IconProvider?.leftIcon || "←"}
          </span>
          <span className="text-[16px] font-semibold">Back To Products</span>
        </Link>

        <div className="mt-4 flex flex-row items-center justify-between border-b border-gray-300 pb-4">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Create New Order
          </h1>
          <span className="text-lg font-medium text-gray-700 bg-white px-3 py-1 border border-gray-300 rounded-md shadow-sm">
            Order No: <strong className="text-gray-900">#001</strong>
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 flex flex-col gap-8 print:hidden">
          <section className="p-6 bg-white border border-gray-300 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Customer Information
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex items-center gap-2 p-2 border border-gray-300 bg-gray-50 rounded-md focus-within:ring-2 focus-within:ring-[#611F69] focus-within:border-transparent transition-all">
                <span className="text-gray-600" aria-hidden="true">
                  {IconProvider?.user || "👤"}
                </span>
                <label htmlFor="customerName" className="sr-only">
                  Customer Name
                </label>
                <input
                  id="customerName"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter Customer Name"
                  className="bg-transparent border-none focus:outline-none w-full text-gray-900 placeholder-gray-500"
                />
              </div>

              <div className="flex-1 flex items-center gap-2 p-2 border border-gray-300 bg-gray-50 rounded-md focus-within:ring-2 focus-within:ring-[#611F69] focus-within:border-transparent transition-all">
                <span className="text-gray-600" aria-hidden="true">
                  {IconProvider?.phone || "📞"}
                </span>
                <label htmlFor="customerPhone" className="sr-only">
                  Customer Phone Number
                </label>
                <input
                  id="customerPhone"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Enter Phone Number"
                  className="bg-transparent border-none focus:outline-none w-full text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
          </section>

          <section className="p-6 bg-white border border-gray-300 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Available Products
            </h2>

            {/* সার্চ অপশন UI */}
            <div className="mb-6">
              <label htmlFor="productSearch" className="sr-only">
                Search Products
              </label>
              <div className="flex items-center gap-2 p-3 border border-gray-300 bg-gray-50 rounded-md focus-within:ring-2 focus-within:ring-[#611F69] focus-within:border-transparent transition-all">
                <span className="text-gray-600" aria-hidden="true">
                  {IconProvider?.search || "🔍"}
                </span>
                <input
                  id="productSearch"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products by name or SKU..."
                  className="bg-transparent border-none focus:outline-none w-full text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            <div aria-live="polite">
              {filteredProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-4 italic">
                  No products found matching "{searchQuery}".
                </p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {filteredProducts.map((product) => (
                    <li
                      key={product.id}
                      className="p-4 border border-gray-200 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-gray-900">
                          {product.name}
                        </span>
                        <span className="text-sm text-gray-600 font-medium">
                          SKU: {product.sku}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="text-lg font-bold text-gray-900">
                          ${product.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => addToOrder(product)}
                          className="px-4 py-2 bg-[#611F69] text-white font-medium rounded-md hover:bg-[#4a1752] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#611F69] transition-all"
                          aria-label={`Add ${product.name} to order`}
                        >
                          Add to Order
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>

        <aside className="lg:col-span-5">
          <section className="p-6 bg-white border border-gray-300 rounded-lg shadow-sm sticky top-5 print:shadow-none print:border-none print:p-0">
            <div className="hidden print:block mb-8 text-center border-b border-gray-300 pb-4">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                SKRIPTO ORDER MEMO
              </h1>
              <p className="text-gray-700">
                Order No: <strong>#001</strong>
              </p>
              <p className="text-gray-700">
                Date: {new Date().toLocaleDateString()}
              </p>
              {(customerName || customerPhone) && (
                <div className="mt-4 text-left p-4 bg-gray-50 border border-gray-200 rounded">
                  <h2 className="font-bold text-gray-900">Billed To:</h2>
                  {customerName && (
                    <p className="text-gray-800">{customerName}</p>
                  )}
                  {customerPhone && (
                    <p className="text-gray-800">{customerPhone}</p>
                  )}
                </div>
              )}
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2 print:hidden">
              Order Information
            </h2>

            <div className="min-h-[200px]" aria-live="polite">
              {cart.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500 font-medium italic print:hidden">
                  No products added yet.
                </div>
              ) : (
                <ul className="flex flex-col gap-3 mb-6">
                  {cart.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between border-b border-gray-100 pb-3"
                    >
                      <div className="flex flex-col">
                        <span className="text-md font-bold text-gray-900">
                          {item.name}
                        </span>
                        <span className="text-sm text-gray-600">
                          ${item.price.toFixed(2)} x {item.quantity}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 print:hidden">
                        <button
                          onClick={() => removeFromOrder(item.id)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-[#611F69]"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          -
                        </button>
                        <span className="font-bold text-gray-900 w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addToOrder(item)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-[#611F69]"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>

                      <div className="hidden print:block font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-gray-300 pt-4 mt-auto">
              <div className="flex justify-between text-gray-700 mb-2">
                <span>Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700 mb-4">
                <span>Estimated Tax (10%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-extrabold text-gray-900 mb-6 border-t border-gray-200 pt-2">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={generateMemo}
                disabled={cart.length === 0}
                className="w-full py-3 bg-gray-900 text-white font-bold rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all print:hidden"
                aria-label="Generate and print order memo"
              >
                Generate Order Memo
              </button>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
