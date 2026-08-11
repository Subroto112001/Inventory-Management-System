"use client";

import { IconProvider } from "@/Provider/IconProvider";
import Link from "next/link";
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  MdQrCodeScanner,
  MdCameraAlt,
  MdClose,
  MdMoney,
  MdCreditCard,
  MdPhoneIphone,
  MdAccountBalanceWallet,
  MdLocationOn,
  MdStorefront,
  MdDirectionsBike,
} from "react-icons/md";
import { Html5QrcodeScanner } from "html5-qrcode";

// ==========================================
// Camera Scanner Modal Component
// ==========================================
const CameraScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  const [isClient, setIsClient] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const scannerRef = useRef(null);
  const isScanningComplete = useRef(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isOpen || !isClient) return;

    setCameraError("");
    isScanningComplete.current = false;

    import("html5-qrcode").then(({ Html5Qrcode }) => {
      const html5QrCode = new Html5Qrcode("camera-reader");
      scannerRef.current = html5QrCode;

      html5QrCode
        .start(
          { facingMode: "environment" },
          {
            fps: 15,
            qrbox: (viewfinderWidth, viewfinderHeight) => {
              const minEdgePercentage = 0.7;
              const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
              const qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
              return { width: qrboxSize, height: qrboxSize };
            },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            if (!isScanningComplete.current) {
              isScanningComplete.current = true;
              if (navigator.vibrate) navigator.vibrate(200);

              onScanSuccess(decodedText);

              html5QrCode.stop().catch(console.error);
            }
          },
          (errorMessage) => {
            // Ignore background scan errors
          },
        )
        .catch((err) => {
          console.error("Camera start error:", err);
          setCameraError(
            "Camera blocked or not found. Please allow camera access.",
          );
        });
    });

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current
            .stop()
            .then(() => {
              scannerRef.current.clear();
            })
            .catch(() => {});
        } catch (e) {}
      }
    };
  }, [isOpen, isClient, onScanSuccess]);

  if (!isOpen || !isClient) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 print:hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="scanner-dialog-title"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-white">
          <h2
            id="scanner-dialog-title"
            className="text-lg font-bold text-gray-900 flex items-center gap-2"
          >
            <MdCameraAlt
              className="text-[#611F69] text-xl"
              aria-hidden="true"
            />
            Scan Product Barcode
          </h2>
          <button
            onClick={() => {
              isScanningComplete.current = true;
              if (scannerRef.current) {
                try {
                  scannerRef.current.stop().catch(() => {});
                } catch (e) {}
              }
              onClose();
            }}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Close scanner"
          >
            <MdClose className="text-2xl" aria-hidden="true" />
          </button>
        </div>

        <div className="p-4 bg-black relative min-h-[300px] flex items-center justify-center">
          {cameraError ? (
            <div className="text-red-500 text-center text-sm p-4 bg-red-50 rounded-lg font-medium">
              {cameraError}
            </div>
          ) : (
            <div
              id="camera-reader"
              className="w-full rounded-lg overflow-hidden border-2 border-[#611F69]/50"
            ></div>
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 text-sm text-gray-700 text-center font-medium">
          Scan a product to automatically add it to the order.
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Main POS / Create Order Component
// ==========================================


export default function CreateOrderPage() {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      const data = await res?.json();
      console.log(data?.products);
      if (res.ok) {
        setProducts(data?.products || []);
      } else {
        console.error("Failed to load products:", data.message);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Order & Delivery States
  const [orderType, setOrderType] = useState("Take Away"); // "Take Away" or "Home Delivery"
  const [deliveryPaymentType, setDeliveryPaymentType] = useState("COD"); // "COD" or "Pre-paid"

  // Payment States
  const [paymentMethod, setPaymentMethod] = useState("Cash"); // Default to Cash
  const [amountReceived, setAmountReceived] = useState("");
  const [mobileBankingProvider, setMobileBankingProvider] = useState("bKash");
  const [transactionId, setTransactionId] = useState("");
  const [cardType, setCardType] = useState("Visa");
  const [cardLast4, setCardLast4] = useState("");

  const { subtotal, tax, deliveryCharge, grandTotal } = useMemo(() => {
    const sub = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    const calculatedTax = sub * 0.1;
    const delivery = orderType === "Home Delivery" ? 60 : 0; // Default 60 BDT for Home Delivery

    return {
      subtotal: sub,
      tax: calculatedTax,
      deliveryCharge: delivery,
      grandTotal: sub + calculatedTax + delivery,
    };
  }, [cart, orderType]);

  // Calculate change for cash payments
  const changeAmount = useMemo(() => {
    if (orderType === "Home Delivery" && deliveryPaymentType === "COD")
      return 0;
    const received = parseFloat(amountReceived) || 0;
    return received > grandTotal ? received - grandTotal : 0;
  }, [amountReceived, grandTotal, orderType, deliveryPaymentType]);

const filteredProducts = useMemo(() => {
  if (!searchQuery) return products;
  const lowerCaseQuery = searchQuery.toLowerCase();
  return products.filter(
    (product) =>
      product?.productName?.toLowerCase().includes(lowerCaseQuery) ||
      product?.productSKU?.toLowerCase().includes(lowerCaseQuery),
  );
}, [searchQuery, products]);

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

  const handleScanSuccess = (scannedCode) => {
    const foundProduct = products.find(
      (p) => p.productSKU.toLowerCase() === scannedCode.toLowerCase(),
    );

    if (foundProduct) {
      addToOrder(foundProduct);
    } else {
      alert(`Product not found for Barcode/SKU: ${scannedCode}`);
    }
    setIsScannerOpen(false);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      const foundProduct = products.find(
        (p) => p.productSKU.toLowerCase() === searchQuery.trim().toLowerCase(),
      );

      if (foundProduct) {
        addToOrder(foundProduct);
        setSearchQuery("");
      } else {
        alert("Product not found! Please check the SKU or Barcode.");
      }
    }
  };

  const generateMemo = () => {
    if (cart.length === 0) {
      alert("Please add products to the order before generating a memo.");
      return;
    }

    if (orderType === "Home Delivery" && !customerAddress.trim()) {
      alert("Please provide the Customer Address for Home Delivery.");
      return;
    }

    // Validation for partial payment on Take Away or Prepaid
    const requiresImmediatePayment =
      orderType === "Take Away" ||
      (orderType === "Home Delivery" && deliveryPaymentType === "Pre-paid");
    if (
      requiresImmediatePayment &&
      paymentMethod === "Cash" &&
      (parseFloat(amountReceived) || 0) < grandTotal
    ) {
      const confirmMsg = window.confirm(
        "Amount received is less than grand total. Proceed anyway as Due/Partial Payment?",
      );
      if (!confirmMsg) return;
    }
    window.print();
  };

  // Determine if we should show the full payment forms
  const showPaymentForms =
    orderType === "Take Away" ||
    (orderType === "Home Delivery" && deliveryPaymentType === "Pre-paid");

  return (
    <main className="p-5 mx-auto min-h-screen bg-gray-50">
      <CameraScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />

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
          <span className="text-lg font-medium text-[#611F69] bg-[#611F69]/10 px-4 py-1.5 border border-[#611F69]/30 rounded-md shadow-sm">
            Order No: <strong>#001</strong>
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Customer & Products */}
        <div className="xl:col-span-7 flex flex-col gap-6 print:hidden">
          {/* Customer Information Section */}
          <section className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#611F69]/10 flex items-center justify-center text-[#611F69]">
                1
              </span>
              Customer Information
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex items-center gap-2 p-2.5 border border-gray-300 bg-gray-50 rounded-lg focus-within:ring-2 focus-within:ring-[#611F69] focus-within:border-transparent transition-all">
                  <span className="text-gray-500 pl-2" aria-hidden="true">
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
                    className="bg-transparent border-none focus:outline-none w-full text-gray-900 placeholder-gray-500 text-sm"
                  />
                </div>

                <div className="flex-1 flex items-center gap-2 p-2.5 border border-gray-300 bg-gray-50 rounded-lg focus-within:ring-2 focus-within:ring-[#611F69] focus-within:border-transparent transition-all">
                  <span className="text-gray-500 pl-2" aria-hidden="true">
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
                    className="bg-transparent border-none focus:outline-none w-full text-gray-900 placeholder-gray-500 text-sm"
                  />
                </div>
              </div>

              {/* Conditionally style address to highlight if Home Delivery is selected */}
              <div
                className={`flex items-start gap-2 p-2.5 border rounded-lg focus-within:ring-2 focus-within:ring-[#611F69] focus-within:border-transparent transition-all ${orderType === "Home Delivery" ? "border-[#611F69]/40 bg-[#611F69]/5" : "border-gray-300 bg-gray-50"}`}
              >
                <MdLocationOn
                  className={`mt-1 pl-2 text-xl ${orderType === "Home Delivery" ? "text-[#611F69]" : "text-gray-500"}`}
                  aria-hidden="true"
                />
                <label htmlFor="customerAddress" className="sr-only">
                  Customer Address
                </label>
                <textarea
                  id="customerAddress"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder={
                    orderType === "Home Delivery"
                      ? "Enter Delivery Address (Required)*"
                      : "Enter Address (Optional)"
                  }
                  rows="2"
                  className="bg-transparent border-none focus:outline-none w-full text-gray-900 placeholder-gray-500 text-sm resize-none"
                />
              </div>
            </div>
          </section>

          {/* Add Products Section */}
          <section className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm flex-1">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#611F69]/10 flex items-center justify-center text-[#611F69]">
                2
              </span>
              Add Products
            </h2>

            <div className="mb-6 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-2 p-3 border border-gray-300 bg-gray-50 rounded-lg focus-within:ring-2 focus-within:ring-[#611F69] focus-within:border-transparent transition-all">
                <MdQrCodeScanner
                  className="text-gray-500 text-xl ml-1"
                  aria-hidden="true"
                />
                <label htmlFor="productSearch" className="sr-only">
                  Search or Scan Products
                </label>
                <input
                  id="productSearch"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Scan barcode or type name/SKU..."
                  className="bg-transparent border-none focus:outline-none w-full text-gray-900 placeholder-gray-500 text-sm"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-900"
                aria-label="Use camera to scan product"
              >
                <MdCameraAlt className="text-lg" aria-hidden="true" />
                <span>Camera Scan</span>
              </button>
            </div>

            <div
              aria-live="polite"
              className="border border-gray-100 rounded-lg bg-gray-50 p-2"
            >
              {filteredProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-8 text-sm">
                  No products found matching "{searchQuery}".
                </p>
              ) : (
                <ul className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredProducts.map((product) => (
                    <li
                      key={product.id}
                      className="p-4 bg-white border border-gray-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#611F69]/50 transition-colors shadow-sm"
                    >
                      <div className="flex flex-col">
                        <span className="text-base font-bold text-gray-900">
                          {product.productName}
                        </span>
                        <span className="text-xs text-gray-500 font-medium mt-1">
                          SKU: {product.productSKU}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="text-lg font-bold text-[#611F69]">
                          ৳{product.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => addToOrder(product)}
                          className="px-4 py-2 bg-[#611F69]/10 text-[#611F69] font-semibold rounded-md hover:bg-[#611F69] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#611F69] transition-all text-sm"
                          aria-label={`Add ${product.name} to order`}
                        >
                          Add
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary & Payment */}
        <aside className="xl:col-span-5 flex flex-col gap-6">
          <section className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col print:shadow-none print:border-none print:p-0 min-h-full">
            {/* --- Print Header (Visible only on print) --- */}
            <div className="hidden print:block mb-8 text-center border-b border-gray-300 pb-6">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                SKRIPTO SUPER SHOP
              </h1>
              <p className="text-gray-700">
                Order Invoice: <strong>#001</strong>
              </p>
              <p className="text-gray-700">
                Date: {new Date().toLocaleDateString()} | Time:{" "}
                {new Date().toLocaleTimeString()}
              </p>

              {(customerName || customerPhone || customerAddress) && (
                <div className="mt-6 text-left p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h2 className="font-bold text-gray-900 mb-1 border-b border-gray-200 pb-1 flex justify-between">
                    <span>Billed To:</span>
                    <span className="text-sm font-bold px-2 py-0.5 border border-black rounded uppercase">
                      {orderType}{" "}
                      {orderType === "Home Delivery" &&
                        `- ${deliveryPaymentType}`}
                    </span>
                  </h2>
                  {customerName && (
                    <p className="text-gray-800 font-medium">{customerName}</p>
                  )}
                  {customerPhone && (
                    <p className="text-gray-600">{customerPhone}</p>
                  )}
                  {customerAddress && (
                    <p className="text-gray-600 mt-1">{customerAddress}</p>
                  )}
                </div>
              )}
            </div>

            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 print:hidden">
              <span className="w-8 h-8 rounded-full bg-[#611F69]/10 flex items-center justify-center text-[#611F69]">
                3
              </span>
              Order Details
            </h2>

            {/* --- Cart Items --- */}
            <div
              className="flex-1 overflow-hidden flex flex-col mb-6"
              aria-live="polite"
            >
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 border-2 border-dashed border-gray-200 rounded-lg print:hidden">
                  <MdAccountBalanceWallet
                    size={48}
                    className="mb-3 opacity-50"
                  />
                  <p className="font-medium">Cart is empty</p>
                </div>
              ) : (
                <div className="flex-1 border border-gray-100 rounded-lg bg-gray-50 p-3 print:border-none print:bg-white print:p-0">
                  <ul className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-2 print:max-h-none print:overflow-visible custom-scrollbar">
                    {cart.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between bg-white p-3 rounded shadow-sm border border-gray-100 print:shadow-none print:border-b print:border-x-0 print:border-t-0 print:rounded-none"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">
                            {item.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            ৳{item.price.toFixed(2)} x {item.quantity}
                          </span>
                        </div>

                        {/* Print Only Total per item */}
                        <div className="hidden print:block font-bold text-gray-900 text-sm">
                          ৳{(item.price * item.quantity).toFixed(2)}
                        </div>

                        {/* Web Controls */}
                        <div className="flex items-center gap-2 print:hidden bg-gray-100 rounded-md p-1">
                          <button
                            onClick={() => removeFromOrder(item.id)}
                            className="w-7 h-7 flex items-center justify-center bg-white text-gray-800 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#611F69]"
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            -
                          </button>
                          <span className="font-bold text-gray-900 w-6 text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => addToOrder(item)}
                            className="w-7 h-7 flex items-center justify-center bg-white text-gray-800 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#611F69]"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            +
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* --- Payment & Delivery System Section --- */}
            <div className="border-t border-gray-200 pt-5 print:border-t-2 print:border-gray-800">
              {/* Order Type Toggle (Hidden on Print) */}
              <div className="mb-5 print:hidden">
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Order Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setOrderType("Take Away")}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border-2 transition-all ${orderType === "Take Away" ? "border-[#611F69] bg-[#611F69]/5 text-[#611F69]" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                  >
                    <MdStorefront size={20} />
                    <span className="text-sm font-semibold">Take Away</span>
                  </button>
                  <button
                    onClick={() => setOrderType("Home Delivery")}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border-2 transition-all ${orderType === "Home Delivery" ? "border-[#611F69] bg-[#611F69]/5 text-[#611F69]" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                  >
                    <MdDirectionsBike size={20} />
                    <span className="text-sm font-semibold">Home Delivery</span>
                  </button>
                </div>
              </div>

              {/* Delivery Payment Option if Home Delivery is selected */}
              {orderType === "Home Delivery" && (
                <div className="mb-5 print:hidden bg-blue-50 border border-blue-100 p-3 rounded-lg">
                  <label className="block text-xs font-bold text-blue-900 mb-2 uppercase tracking-wide">
                    Delivery Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setDeliveryPaymentType("COD")}
                      className={`py-1.5 rounded-md text-sm font-medium transition-all ${deliveryPaymentType === "COD" ? "bg-blue-600 text-white shadow-sm" : "bg-white text-blue-700 border border-blue-200 hover:bg-blue-100"}`}
                    >
                      Cash On Delivery
                    </button>
                    <button
                      onClick={() => setDeliveryPaymentType("Pre-paid")}
                      className={`py-1.5 rounded-md text-sm font-medium transition-all ${deliveryPaymentType === "Pre-paid" ? "bg-blue-600 text-white shadow-sm" : "bg-white text-blue-700 border border-blue-200 hover:bg-blue-100"}`}
                    >
                      Pre-paid (Pay Now)
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Methods Tabs (Show if Take Away OR Pre-paid Delivery) */}
              {showPaymentForms && (
                <div className="mb-5 print:hidden">
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Select Gateway
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setPaymentMethod("Cash")}
                      className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg border-2 transition-all ${paymentMethod === "Cash" ? "border-[#611F69] bg-[#611F69]/5 text-[#611F69]" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                    >
                      <MdMoney size={20} />
                      <span className="text-xs font-semibold">Cash</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod("Mobile Banking")}
                      className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg border-2 transition-all ${paymentMethod === "Mobile Banking" ? "border-[#611F69] bg-[#611F69]/5 text-[#611F69]" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                    >
                      <MdPhoneIphone size={20} />
                      <span className="text-xs font-semibold">M-Banking</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod("Card")}
                      className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg border-2 transition-all ${paymentMethod === "Card" ? "border-[#611F69] bg-[#611F69]/5 text-[#611F69]" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                    >
                      <MdCreditCard size={20} />
                      <span className="text-xs font-semibold">Card</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Dynamic Payment Fields (Hidden on Print) */}
              {showPaymentForms && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 print:hidden">
                  {paymentMethod === "Cash" && (
                    <div>
                      <label
                        htmlFor="amountReceived"
                        className="block text-sm font-semibold text-gray-700 mb-1"
                      >
                        Amount Received (৳)
                      </label>
                      <input
                        id="amountReceived"
                        type="number"
                        min="0"
                        value={amountReceived}
                        onChange={(e) => setAmountReceived(e.target.value)}
                        placeholder="e.g. 1500"
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#611F69] text-lg font-bold"
                      />
                    </div>
                  )}

                  {paymentMethod === "Mobile Banking" && (
                    <div className="space-y-3">
                      <div>
                        <label
                          htmlFor="mbProvider"
                          className="block text-sm font-semibold text-gray-700 mb-1"
                        >
                          Provider
                        </label>
                        <select
                          id="mbProvider"
                          value={mobileBankingProvider}
                          onChange={(e) =>
                            setMobileBankingProvider(e.target.value)
                          }
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#611F69] text-sm"
                        >
                          <option value="bKash">bKash</option>
                          <option value="Nagad">Nagad</option>
                          <option value="Rocket">Rocket</option>
                          <option value="Upay">Upay</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="trxId"
                          className="block text-sm font-semibold text-gray-700 mb-1"
                        >
                          Transaction ID
                        </label>
                        <input
                          id="trxId"
                          type="text"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          placeholder="e.g. 9J2A8XN..."
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#611F69] text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === "Card" && (
                    <div className="space-y-3">
                      <div>
                        <label
                          htmlFor="cardType"
                          className="block text-sm font-semibold text-gray-700 mb-1"
                        >
                          Card Type
                        </label>
                        <select
                          id="cardType"
                          value={cardType}
                          onChange={(e) => setCardType(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#611F69] text-sm"
                        >
                          <option value="Visa">Visa</option>
                          <option value="Mastercard">Mastercard</option>
                          <option value="Amex">Amex</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="cardLast4"
                          className="block text-sm font-semibold text-gray-700 mb-1"
                        >
                          Card Last 4 Digits
                        </label>
                        <input
                          id="cardLast4"
                          type="text"
                          maxLength="4"
                          value={cardLast4}
                          onChange={(e) =>
                            setCardLast4(e.target.value.replace(/\D/g, ""))
                          }
                          placeholder="e.g. 4242"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#611F69] text-sm tracking-widest"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Message for COD Orders */}
              {orderType === "Home Delivery" &&
                deliveryPaymentType === "COD" && (
                  <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200 print:hidden text-center">
                    <p className="text-amber-800 font-semibold text-sm">
                      📦 Payment will be collected by the delivery agent.
                    </p>
                  </div>
                )}

              {/* --- Financial Summary --- */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Subtotal</span>
                  <span className="font-medium">৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Estimated Tax (10%)</span>
                  <span className="font-medium">৳{tax.toFixed(2)}</span>
                </div>
                {orderType === "Home Delivery" && (
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Delivery Charge</span>
                    <span className="font-medium">
                      ৳{deliveryCharge.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-2xl font-extrabold text-[#611F69] py-2 border-t border-gray-100 mt-2">
                  <span>Total Due</span>
                  <span>৳{grandTotal.toFixed(2)}</span>
                </div>

                {/* Visual Feedback for Payment Details */}
                <div className="bg-[#611F69]/5 p-3 rounded-lg border border-[#611F69]/20 print:border-none print:bg-white print:p-0 mt-4">
                  <div className="flex justify-between text-gray-800 text-sm mb-1 font-semibold">
                    <span>Payment Status:</span>
                    <span className="uppercase text-[#611F69]">
                      {orderType === "Home Delivery" &&
                      deliveryPaymentType === "COD"
                        ? "Cash On Delivery"
                        : `${paymentMethod} ${paymentMethod === "Mobile Banking" ? `(${mobileBankingProvider})` : ""}`}
                    </span>
                  </div>

                  {showPaymentForms && paymentMethod === "Cash" && (
                    <>
                      <div className="flex justify-between text-gray-700 text-sm mb-1 print:hidden">
                        <span>Amount Given:</span>
                        <span>
                          ৳{parseFloat(amountReceived || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-900 font-bold border-t border-gray-200 pt-1 mt-1 print:hidden">
                        <span>Change Return:</span>
                        <span
                          className={changeAmount > 0 ? "text-green-600" : ""}
                        >
                          ৳{changeAmount.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}

                  {showPaymentForms &&
                    paymentMethod === "Mobile Banking" &&
                    transactionId && (
                      <div className="flex justify-between text-gray-600 text-xs mt-2 border-t border-gray-200 pt-2">
                        <span>TrxID:</span>
                        <span className="font-mono">{transactionId}</span>
                      </div>
                    )}

                  {showPaymentForms &&
                    paymentMethod === "Card" &&
                    cardLast4 && (
                      <div className="flex justify-between text-gray-600 text-xs mt-2 border-t border-gray-200 pt-2">
                        <span>Card:</span>
                        <span className="font-mono">
                          {cardType} ending in **{cardLast4}
                        </span>
                      </div>
                    )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={generateMemo}
                disabled={cart.length === 0}
                className="w-full py-3.5 bg-[#611F69] text-white font-bold rounded-lg shadow-lg hover:bg-[#4a1752] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#611F69]/50 transition-all print:hidden flex items-center justify-center gap-2"
                aria-label="Process Payment and Print Memo"
              >
                <span>Process Order & Print</span>
              </button>

              {/* Footer text for print */}
              <div className="hidden print:block text-center mt-12 pt-4 border-t border-gray-300 text-sm text-gray-600">
                Thank you for shopping with us! <br />
                Software powered by Skripto IT
              </div>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
