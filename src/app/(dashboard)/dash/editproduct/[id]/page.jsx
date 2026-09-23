"use client";

import ColorButton from "@/Component/Button/ColorButton";
import TransparentButton from "@/Component/Button/TransparentButton";
import { IconProvider } from "@/Provider/IconProvider";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MdQrCodeScanner,
  MdAutoFixHigh,
  MdCameraAlt,
  MdClose,
} from "react-icons/md";

// ==========================================
// Camera Scanner Modal Component
// (identical to AddNewProduct — consider moving this to a shared
// Component/Scanner/CameraScannerModal.jsx and importing it in both
// pages instead of duplicating it)
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
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
            Scan Barcode / QR
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
          Hold the barcode steady{" "}
          <span className="text-[#611F69] font-bold">4-6 inches</span> away from
          the camera.
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Edit Product Page
// Route: app/editproduct/[id]/page.jsx
// ==========================================
const defaultFormState = {
  productName: "",
  productSKU: "",
  price: "",
  brandName: "",
  unit: "",
  quantity: "",
  description: "",
  wholesalePrice: "",
  discount: "",
  initialStock: "",
  lowStockAlert: "",
};

const EditProductPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState(defaultFormState);
  const [currentStock, setCurrentStock] = useState(0); // read-only, not part of PUT payload

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [publishError, setPublishError] = useState("");

  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Fetch the existing product and pre-fill the form
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoadingProduct(true);
      setLoadError("");
      try {
        const res = await fetch(`/api/product/${id}`, { cache: "no-store" });
        const data = await res.json();

        if (!res.ok) {
          setLoadError(data.message || "Product not found");
          return;
        }

        const product = data.product;

        setFormData({
          productName: product.productName ?? "",
          productSKU: product.productSKU ?? "",
          price: product.price ?? "",
          brandName: product.brandName ?? "",
          unit: product.unit ?? "",
          quantity: product.quantity ?? "",
          description: product.description ?? "",
          wholesalePrice: product.wholesalePrice ?? "",
          discount: product.discount ?? "",
          initialStock: product.initialStock ?? "",
          lowStockAlert: product.lowStockAlert ?? "",
        });
        setCurrentStock(product.currentStock ?? 0);
      } catch (err) {
        console.error("Fetch product error:", err);
        setLoadError("সার্ভার থেকে প্রোডাক্ট লোড করা যায়নি");
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGenerateSKU = () => {
    const randomSKU = `PRD-${Math.floor(100000000 + Math.random() * 900000000)}`;
    setFormData((prevData) => ({
      ...prevData,
      productSKU: randomSKU,
    }));
  };

  const handleScanSuccess = (decodedText) => {
    setFormData((prevData) => ({
      ...prevData,
      productSKU: decodedText,
    }));
    setIsScannerOpen(false);
  };

  const input_fields = [
    { label: "Product Name", name: "productName", type: "text" },
    { label: "Product SKU", name: "productSKU", type: "text" },
    { label: "Price", name: "price", type: "number" },
    { label: "Brand Name", name: "brandName", type: "text" },
    { label: "Unit", name: "unit", type: "text" },
    { label: "Quantity", name: "quantity", type: "number" },
    { label: "Wholesale Price", name: "wholesalePrice", type: "number" },
    { label: "Discount", name: "discount", type: "number" },
    { label: "Initial Stock", name: "initialStock", type: "number" },
    { label: "Low Stock Alert", name: "lowStockAlert", type: "number" },
  ];

  // Update product → PUT /api/product/[id]
  const handleUpdate = async () => {
    setPublishError("");

    if (!formData.productName || !formData.productSKU) {
      setPublishError("Please fill in the required fields (Name & SKU).");
      return;
    }
    if (!formData.price) {
      setPublishError("Price is required.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/product/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message || "কিছু একটা সমস্যা হয়েছে");
        return;
      }

      alert("Product updated successfully!");
      router.push("/products");
    } catch (err) {
      console.error("Update Product Error:", err);
      setPublishError("সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProduct) {
    return (
      <main className="p-5" id="main-content">
        <p className="text-gray-500 text-sm text-center py-10">
          Loading product...
        </p>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="p-5" id="main-content">
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2 max-w-md">
          {loadError}
        </div>
        <Link
          href="/products"
          className="inline-block mt-4 text-[#611F69] font-medium"
        >
          ← Back To Products
        </Link>
      </main>
    );
  }

  return (
    <main className="p-5" id="main-content">
      <CameraScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />

      <div>
        <Link
          href="/products"
          className="inline-flex gap-2 items-center text-gray-700 hover:text-[#611F69] focus:outline-none focus:ring-2 focus:ring-[#611F69] rounded-md transition-colors"
          aria-label="Go back to products page"
        >
          <span className="text-2xl text-[#611F69]" aria-hidden="true">
            {IconProvider?.leftIcon || "←"}
          </span>
          <span className="text-[16px] font-medium">Back To Products</span>
        </Link>

        <header className="mt-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-[24px] font-semibold text-gray-900 m-0">
              Edit Product
            </h1>
            <p className="text-gray-600 m-0 text-sm">
              Update the details of{" "}
              <span className="font-medium text-gray-800">
                {formData.productName}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3" aria-label="Product actions">
            <span
              className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                currentStock > 10
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
              title="Current stock is managed via the stock adjustment API, not this form"
            >
              Current Stock: {currentStock}
            </span>
            <TransparentButton value="Cancel" />
          </div>
        </header>
      </div>

      <section
        className="flex flex-col border border-gray-200 rounded-md p-5 mt-6 bg-white shadow-sm"
        aria-labelledby="product-info-heading"
      >
        <h2
          id="product-info-heading"
          className="text-[18px] font-medium mt-2 mb-4 text-gray-800 border-b border-gray-100 pb-2"
        >
          Product Information
        </h2>

        {publishError && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {publishError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {input_fields.map((item, index) => {
            if (item.name === "productSKU") {
              return (
                <div
                  key={index}
                  className="flex flex-col gap-1 md:col-span-2 lg:col-span-1"
                >
                  <label
                    htmlFor={item.name}
                    className="text-gray-700 font-medium text-sm"
                  >
                    {item.label} (Scan or Generate)
                  </label>
                  <div className="flex flex-wrap sm:flex-nowrap gap-2">
                    <div className="relative flex-1 w-full">
                      <MdQrCodeScanner
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]"
                        aria-hidden="true"
                      />
                      <input
                        id={item.name}
                        name={item.name}
                        type="text"
                        value={formData[item.name]}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#611F69] focus:border-transparent transition-all bg-gray-50"
                        placeholder="Type, scan or generate..."
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsScannerOpen(true)}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#611F69]"
                      aria-label="Open camera to scan barcode"
                      title="Use Camera to Scan"
                    >
                      <MdCameraAlt className="text-[18px]" aria-hidden="true" />
                      <span className="hidden sm:inline">Camera</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleGenerateSKU}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-[#611F69]/10 text-[#611F69] border border-[#611F69]/20 rounded-md hover:bg-[#611F69]/20 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#611F69]"
                      aria-label="Auto Generate SKU"
                      title="Auto Generate SKU"
                    >
                      <MdAutoFixHigh
                        className="text-[18px]"
                        aria-hidden="true"
                      />
                      <span className="hidden sm:inline">Generate</span>
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div key={index} className="flex flex-col gap-1">
                <label
                  htmlFor={item.name}
                  className="text-gray-700 font-medium text-sm"
                >
                  {item.label}
                </label>
                <input
                  id={item.name}
                  name={item.name}
                  type={item.type}
                  value={formData[item.name]}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#611F69] focus:border-transparent transition-all"
                  placeholder={`Enter ${item.label.toLowerCase()}`}
                />
              </div>
            );
          })}

          <div className="flex flex-col gap-1 md:col-span-2 lg:col-span-3">
            <label
              htmlFor="description"
              className="text-gray-700 font-medium text-sm"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#611F69] focus:border-transparent transition-all resize-y"
              placeholder="Enter comprehensive product description..."
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <ColorButton
            value={submitting ? "Updating..." : "Update Product"}
            onClick={handleUpdate}
            disabled={submitting}
            aria-label="Save changes to this product"
          />
        </div>
      </section>
    </main>
  );
};

export default EditProductPage;
