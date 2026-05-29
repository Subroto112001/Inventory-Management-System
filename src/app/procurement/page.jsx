"use client";

import React, { useState } from "react";
import {
  MdBusiness,
  MdPerson,
  MdAddShoppingCart,
  MdDeleteOutline,
  MdPrint,
  MdFormatListBulleted,
} from "react-icons/md";

// Predefined Regular Suppliers/Companies
const PREDEFINED_SUPPLIERS = [
  "Pran Foods Ltd.",
  "Square Food & Beverage",
  "Meghna Group of Industries",
  "City Group",
  "TK Group",
  "Akij Food & Beverage",
  "Unilever Bangladesh",
  "Nestle Bangladesh",
  "ACI Limited",
  "Fresh (Meghna Group)",
  "Radhuni (Square)",
];

// 50 Predefined Shop Products
const SHOP_PRODUCTS = [
  "Miniket Rice (50kg)",
  "Basmati Rice (5kg)",
  "Soybean Oil (5L)",
  "Mustard Oil (1L)",
  "Red Lentils / Masoor Dal (1kg)",
  "Moong Dal (1kg)",
  "Sugar (1kg)",
  "Iodized Salt (1kg)",
  "Wheat Flour / Atta (2kg)",
  "Maida (1kg)",
  "Black Tea (500g)",
  "Green Tea (Box)",
  "Instant Coffee (100g)",
  "Full Cream Milk Powder (500g)",
  "Liquid Milk (1L)",
  "Eggs (Dozen)",
  "Butter (200g)",
  "Cheese (200g)",
  "Yogurt (500g)",
  "Bottled Water (1.5L)",
  "Orange Juice (1L)",
  "Cola Beverage (1L)",
  "Lemon-Lime Soda (1L)",
  "Potato Chips (Large)",
  "Chocolate Biscuits (Pack)",
  "Toast Biscuit (Pack)",
  "Instant Noodles (8 Pack)",
  "Pasta (500g)",
  "Tomato Ketchup (500g)",
  "Chili Sauce (300g)",
  "Mayonnaise (250ml)",
  "Bathing Soap (150g)",
  "Liquid Hand Wash (250ml)",
  "Anti-dandruff Shampoo (300ml)",
  "Hair Oil (200ml)",
  "Toothpaste (200g)",
  "Toothbrush (Pack of 3)",
  "Shaving Cream (100g)",
  "Body Lotion (250ml)",
  "Laundry Detergent Powder (1kg)",
  "Dishwashing Liquid (500ml)",
  "Toilet Cleaner (750ml)",
  "Floor Cleaner (1L)",
  "Glass Cleaner (500ml)",
  "Facial Tissue (Box)",
  "Toilet Paper (Roll)",
  "Garbage Bags (Pack of 30)",
  "Mosquito Repellent Spray (400ml)",
  "Air Freshener (300ml)",
  "Batteries (AA - Pack of 4)",
].sort();

export default function PurchaseOrderPage() {
  // States for Supplier and Officer Info
  const [supplierName, setSupplierName] = useState("");
  const [supplierContact, setSupplierContact] = useState("");
  const [officerName, setOfficerName] = useState("");

  // States for Products List
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState("");
  const [currentQty, setCurrentQty] = useState("");
  const [currentUnit, setCurrentUnit] = useState("Pcs");

  // Handle adding product to the list
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!currentProduct || !currentQty.trim()) return;

    const newProduct = {
      id: Date.now().toString(),
      name: currentProduct,
      qty: currentQty,
      unit: currentUnit,
    };

    setProducts([...products, newProduct]);

    // Clear inputs after adding
    setCurrentProduct("");
    setCurrentQty("");
    setCurrentUnit("Pcs");
  };

  // Handle removing product from the list
  const handleRemoveProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  // Handle Memo Print
  const handlePrint = () => {
    if (products.length === 0) {
      alert(
        "Please add at least one product to the order list before printing.",
      );
      return;
    }
    window.print();
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans p-4 md:p-8">
      {/* Page Header (Hidden on Print) */}
      <header className="mb-8 print:hidden">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
          <MdFormatListBulleted className="text-[#611F69]" aria-hidden="true" />
          Restock / Purchase Order Request
        </h1>
        <p className="text-gray-600 mt-2">
          Create a purchase order and material list for restocking inventory.
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* =========================================
            LEFT COLUMN: FORM SECTION (Hidden on Print)
        =========================================== */}
        <div className="xl:col-span-5 flex flex-col gap-6 print:hidden">
          {/* Company & Officer Info Form */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
              Supplier & Order Details
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="supplierName"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Company / Supplier Name
                </label>
                <div className="relative">
                  <MdBusiness
                    className="absolute left-3 top-3 text-gray-400"
                    size={20}
                    aria-hidden="true"
                  />
                  {/* Hybrid Input: Allows selecting from list OR typing a new one */}
                  <input
                    id="supplierName"
                    list="supplier-options"
                    type="text"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    placeholder="Select from list or type new..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#611F69] text-sm"
                  />
                  <datalist id="supplier-options">
                    {PREDEFINED_SUPPLIERS.map((supplier, idx) => (
                      <option key={idx} value={supplier} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <label
                  htmlFor="supplierContact"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Contact Information
                </label>
                <input
                  id="supplierContact"
                  type="text"
                  value={supplierContact}
                  onChange={(e) => setSupplierContact(e.target.value)}
                  placeholder="Mobile number or Email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#611F69] text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="officerName"
                  className="block text-sm font-semibold text-gray-700 mb-1 mt-2"
                >
                  Duty Officer / Manager Name
                </label>
                <div className="relative">
                  <MdPerson
                    className="absolute left-3 top-3 text-gray-400"
                    size={20}
                    aria-hidden="true"
                  />
                  <input
                    id="officerName"
                    type="text"
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#611F69] text-sm"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Add Product Form */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex-1">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
              Add Product to Requisition
            </h2>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label
                  htmlFor="productName"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Product Name
                </label>
                {/* Hybrid Input: Allows selecting from list OR typing a new product */}
                <input
                  id="productName"
                  list="product-options"
                  type="text"
                  value={currentProduct}
                  onChange={(e) => setCurrentProduct(e.target.value)}
                  placeholder="Select from list or type new product..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#611F69] text-sm bg-white"
                  required
                />
                <datalist id="product-options">
                  {SHOP_PRODUCTS.map((product, idx) => (
                    <option key={idx} value={product} />
                  ))}
                </datalist>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="productQty"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Quantity
                  </label>
                  <input
                    id="productQty"
                    type="number"
                    min="1"
                    value={currentQty}
                    onChange={(e) => setCurrentQty(e.target.value)}
                    placeholder="e.g., 50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#611F69] text-sm"
                    required
                  />
                </div>
                <div className="w-1/3">
                  <label
                    htmlFor="productUnit"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Unit
                  </label>
                  <select
                    id="productUnit"
                    value={currentUnit}
                    onChange={(e) => setCurrentUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#611F69] text-sm bg-white"
                  >
                    <option value="Pcs">Pcs</option>
                    <option value="Box">Box</option>
                    <option value="Kg">Kg</option>
                    <option value="Liter">Liter</option>
                    <option value="Dozen">Dozen</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 bg-[#611F69]/10 text-[#611F69] font-bold rounded-md hover:bg-[#611F69] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#611F69]"
              >
                <MdAddShoppingCart size={20} aria-hidden="true" />
                Add to List
              </button>
            </form>
          </section>
        </div>

        {/* =========================================
            RIGHT COLUMN: MEMO PREVIEW / PRINT VIEW
        =========================================== */}
        <aside className="xl:col-span-7 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col print:col-span-12 print:shadow-none print:border-none print:bg-transparent">
          <div className="p-8 flex-1" id="printable-memo">
            {/* Memo Header */}
            <div className="text-center mb-8 border-b-2 border-gray-800 pb-6">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-1 uppercase tracking-wider">
                Skripto Super Shop
              </h1>
              <p className="text-sm text-gray-600 font-medium">
                Head Office, Dhaka, Bangladesh
              </p>

              <div className="inline-block mt-4 px-4 py-1.5 border-2 border-[#611F69] text-[#611F69] font-bold text-lg uppercase rounded-full">
                Purchase Order Memo
              </div>
            </div>

            {/* Memo Info Row */}
            <div className="flex justify-between items-start mb-8 text-sm text-gray-800">
              <div className="w-1/2">
                <p className="font-bold text-gray-900 mb-1">Order To:</p>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded min-h-[80px]">
                  {supplierName ? (
                    <>
                      <p className="font-bold text-lg">{supplierName}</p>
                      <p className="text-gray-600 mt-1">
                        Contact: {supplierContact || "N/A"}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-400 italic print:hidden">
                      Company name not provided
                    </p>
                  )}
                </div>
              </div>

              <div className="text-right">
                <p>
                  <span className="font-bold">Memo No:</span> PO-
                  {Math.floor(10000 + Math.random() * 90000)}
                </p>
                <p className="mt-1">
                  <span className="font-bold">Date:</span>{" "}
                  {new Date().toLocaleDateString("en-GB")}
                </p>
              </div>
            </div>

            {/* Products Table */}
            <div className="mb-12 min-h-[300px]">
              <table
                className="w-full text-left border-collapse"
                aria-label="Purchase Order Item List"
              >
                <thead>
                  <tr className="bg-gray-100 border-y-2 border-gray-800 text-sm">
                    <th
                      scope="col"
                      className="py-3 px-4 font-bold text-gray-900 w-12 text-center"
                    >
                      SL
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-4 font-bold text-gray-900"
                    >
                      Product Description
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-4 font-bold text-gray-900 text-center w-24"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-4 font-bold text-gray-900 text-center w-24"
                    >
                      Unit
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-4 font-bold text-gray-900 text-center w-24 print:hidden"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {products.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-8 text-center text-gray-400 italic border-b border-gray-200 print:hidden"
                      >
                        No products have been added to the list yet.
                      </td>
                    </tr>
                  ) : (
                    products.map((product, index) => (
                      <tr
                        key={product.id}
                        className="border-b border-gray-200 hover:bg-gray-50 print:hover:bg-transparent transition-colors"
                      >
                        <td className="py-3 px-4 text-center text-gray-700">
                          {index + 1}
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-900">
                          {product.name}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-gray-900">
                          {product.qty}
                        </td>
                        <td className="py-3 px-4 text-center text-gray-600">
                          {product.unit}
                        </td>
                        <td className="py-3 px-4 text-center print:hidden">
                          <button
                            onClick={() => handleRemoveProduct(product.id)}
                            className="text-red-500 hover:text-red-700 p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                            aria-label={`Remove ${product.name}`}
                          >
                            <MdDeleteOutline size={20} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Signature Section */}
            <div className="flex justify-between items-end mt-16 pt-8">
              <div className="text-center w-48">
                <div className="border-t-2 border-gray-400 pt-2 text-sm">
                  <p className="font-bold text-gray-800">Supplier / Receiver</p>
                  <p className="text-gray-500 mt-1">(Sign & Seal)</p>
                </div>
              </div>

              <div className="text-center w-56">
                <div className="border-t-2 border-gray-800 pt-2 text-sm">
                  <p className="font-bold text-gray-900">
                    Authorized Signature
                  </p>
                  {officerName ? (
                    <p className="text-[#611F69] font-semibold mt-1 uppercase">
                      {officerName}
                    </p>
                  ) : (
                    <p className="text-gray-400 italic mt-1 print:hidden">
                      Officer Name
                    </p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    Purchasing Officer
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button (Hidden on Print) */}
          <div className="p-4 bg-gray-50 border-t border-gray-200 print:hidden">
            <button
              onClick={handlePrint}
              disabled={products.length === 0}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#611F69] text-white font-bold rounded-lg shadow hover:bg-[#4a1752] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#611F69]/50 transition-all text-lg"
              aria-label="Print or Save Memo as PDF"
            >
              <MdPrint size={24} aria-hidden="true" />
              Generate & Print Memo
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
