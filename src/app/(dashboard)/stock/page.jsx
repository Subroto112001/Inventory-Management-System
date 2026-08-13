"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  MdDownload,
  MdAdd,
  MdTrendingUp,
  MdWarning,
  MdSearch,
  MdFilterList,
  MdArrowDropDown,
  MdMemory,
  MdEdit,
  MdShoppingCartCheckout,
  MdPrecisionManufacturing,
  MdBuildCircle,
  MdReceiptLong,
  MdCable,
  MdChevronLeft,
  MdChevronRight,
  MdClose,
  MdComputer,
  MdMouse,
  MdKeyboard,
  MdRouter,
  MdHeadset,
  MdCamera,
  MdStorage,
  MdPower,
  MdDns,
} from "react-icons/md";

// Expanded Demo Stock Data (54 Items Total)
const INITIAL_STOCK_DATA = [
  // Original 4 items
  {
    id: "SNS-A-1024",
    name: "Precision Sensor Alpha",
    location: "WH-East (Aisle 4)",
    minStock: 150,
    currentStock: 45,
    icon: MdMemory,
  },
  {
    id: "ACT-HD-99",
    name: "Heavy Duty Actuator",
    location: "WH-Main (Zone B)",
    minStock: 50,
    currentStock: 210,
    icon: MdPrecisionManufacturing,
  },
  {
    id: "SRV-M-001",
    name: "Industrial Servo Motor",
    location: "WH-South (Dock 2)",
    minStock: 20,
    currentStock: 0,
    icon: MdBuildCircle,
  },
  {
    id: "CBL-CU-50",
    name: "Shielded Copper Cable 50m",
    location: "WH-Main (Rack 12)",
    minStock: 100,
    currentStock: 845,
    icon: MdCable,
  },

  // 50 New IT & Hardware Items
  {
    id: "NET-CAT6-100",
    name: "Cat6 Ethernet Cable 100m",
    location: "WH-East (Rack 1)",
    minStock: 20,
    currentStock: 85,
    icon: MdCable,
  },
  {
    id: "NET-FBR-05",
    name: "Fiber Optic Patch Cord 5m",
    location: "WH-East (Rack 2)",
    minStock: 50,
    currentStock: 120,
    icon: MdCable,
  },
  {
    id: "RTR-CS-2900",
    name: "Cisco Router 2900 Series",
    location: "WH-North (Zone A)",
    minStock: 5,
    currentStock: 12,
    icon: MdRouter,
  },
  {
    id: "SWT-24G-POE",
    name: "24-Port Gigabit PoE Switch",
    location: "WH-North (Zone A)",
    minStock: 10,
    currentStock: 8,
    icon: MdDns,
  },
  {
    id: "STO-NVME-1T",
    name: "NVMe SSD 1TB Gen4",
    location: "WH-Main (Aisle 2)",
    minStock: 30,
    currentStock: 145,
    icon: MdStorage,
  },
  {
    id: "MEM-DDR4-16",
    name: "DDR4 RAM 16GB 3200MHz",
    location: "WH-Main (Aisle 2)",
    minStock: 50,
    currentStock: 320,
    icon: MdMemory,
  },
  {
    id: "CPU-INT-I7",
    name: "Intel Core i7-13700K",
    location: "WH-Main (Secure Vault)",
    minStock: 15,
    currentStock: 42,
    icon: MdMemory,
  },
  {
    id: "CPU-AMD-R7",
    name: "AMD Ryzen 7 7800X3D",
    location: "WH-Main (Secure Vault)",
    minStock: 15,
    currentStock: 28,
    icon: MdMemory,
  },
  {
    id: "MB-ATX-Z790",
    name: "ATX Motherboard Z790",
    location: "WH-West (Aisle 5)",
    minStock: 20,
    currentStock: 18,
    icon: MdBuildCircle,
  },
  {
    id: "PSU-750W-G",
    name: "750W 80+ Gold Power Supply",
    location: "WH-West (Aisle 5)",
    minStock: 25,
    currentStock: 60,
    icon: MdPower,
  },
  {
    id: "RCK-42U-SRV",
    name: "Server Rack 42U",
    location: "WH-South (Dock 1)",
    minStock: 2,
    currentStock: 5,
    icon: MdDns,
  },
  {
    id: "UPS-1000VA",
    name: "UPS 1000VA Line-Interactive",
    location: "WH-South (Dock 1)",
    minStock: 10,
    currentStock: 22,
    icon: MdPower,
  },
  {
    id: "MON-4K-27",
    name: "4K Dell Monitor 27 inch",
    location: "WH-East (Aisle 3)",
    minStock: 15,
    currentStock: 8,
    icon: MdComputer,
  },
  {
    id: "KBD-MECH-BL",
    name: "Mechanical Keyboard (Blue)",
    location: "WH-East (Aisle 3)",
    minStock: 40,
    currentStock: 110,
    icon: MdKeyboard,
  },
  {
    id: "MUS-WL-ERG",
    name: "Wireless Ergonomic Mouse",
    location: "WH-East (Aisle 3)",
    minStock: 50,
    currentStock: 95,
    icon: MdMouse,
  },
  {
    id: "AUD-ANC-HDS",
    name: "Noise Cancelling Headset",
    location: "WH-West (Aisle 1)",
    minStock: 30,
    currentStock: 75,
    icon: MdHeadset,
  },
  {
    id: "CAM-WEB-108",
    name: "Web Camera 1080p HD",
    location: "WH-West (Aisle 1)",
    minStock: 40,
    currentStock: 20,
    icon: MdCamera,
  },
  {
    id: "CBL-HDMI-5M",
    name: "HDMI Cable 5m v2.1",
    location: "WH-East (Rack 1)",
    minStock: 100,
    currentStock: 420,
    icon: MdCable,
  },
  {
    id: "CBL-DP-2M",
    name: "DisplayPort Cable 2m",
    location: "WH-East (Rack 1)",
    minStock: 80,
    currentStock: 150,
    icon: MdCable,
  },
  {
    id: "DOK-USBC-01",
    name: "USB-C Docking Station",
    location: "WH-Main (Aisle 4)",
    minStock: 25,
    currentStock: 0,
    icon: MdComputer,
  },
  {
    id: "STO-NAS-4B",
    name: "NAS Storage Enclosure 4-Bay",
    location: "WH-North (Zone B)",
    minStock: 5,
    currentStock: 9,
    icon: MdStorage,
  },
  {
    id: "STO-HDD-8T",
    name: "8TB Enterprise HDD 7200RPM",
    location: "WH-North (Zone B)",
    minStock: 20,
    currentStock: 45,
    icon: MdStorage,
  },
  {
    id: "SBC-RPI-4B",
    name: "Raspberry Pi 4 Model B",
    location: "WH-Main (Aisle 2)",
    minStock: 50,
    currentStock: 18,
    icon: MdMemory,
  },
  {
    id: "MCU-ARD-R3",
    name: "Arduino Uno R3",
    location: "WH-Main (Aisle 2)",
    minStock: 100,
    currentStock: 310,
    icon: MdMemory,
  },
  {
    id: "MCU-ESP-32",
    name: "ESP32 Microcontroller",
    location: "WH-Main (Aisle 2)",
    minStock: 150,
    currentStock: 500,
    icon: MdMemory,
  },
  {
    id: "ACC-THM-10G",
    name: "Thermal Paste (10g Syringe)",
    location: "WH-West (Aisle 2)",
    minStock: 80,
    currentStock: 215,
    icon: MdBuildCircle,
  },
  {
    id: "FAN-CAS-120",
    name: "Case Fan 120mm PWM",
    location: "WH-West (Aisle 2)",
    minStock: 100,
    currentStock: 80,
    icon: MdBuildCircle,
  },
  {
    id: "CLR-AIO-240",
    name: "CPU Liquid Cooler 240mm",
    location: "WH-West (Aisle 2)",
    minStock: 15,
    currentStock: 32,
    icon: MdBuildCircle,
  },
  {
    id: "NET-RJ45-1C",
    name: "RJ45 Connectors (Pack of 100)",
    location: "WH-East (Rack 2)",
    minStock: 50,
    currentStock: 120,
    icon: MdCable,
  },
  {
    id: "ACC-TIE-500",
    name: "Cable Ties (Pack of 500)",
    location: "WH-East (Rack 2)",
    minStock: 40,
    currentStock: 90,
    icon: MdCable,
  },
  {
    id: "WIF-AX-AP",
    name: "Wi-Fi 6 Access Point",
    location: "WH-North (Zone A)",
    minStock: 10,
    currentStock: 24,
    icon: MdRouter,
  },
  {
    id: "NET-POE-INJ",
    name: "PoE Injector 802.3af",
    location: "WH-North (Zone A)",
    minStock: 30,
    currentStock: 12,
    icon: MdPower,
  },
  {
    id: "RCK-FAN-SRV",
    name: "Server Cabinet Fan Unit",
    location: "WH-South (Dock 1)",
    minStock: 10,
    currentStock: 15,
    icon: MdBuildCircle,
  },
  {
    id: "NET-KVM-4P",
    name: "KVM Switch 4-Port",
    location: "WH-North (Zone C)",
    minStock: 8,
    currentStock: 3,
    icon: MdDns,
  },
  {
    id: "NET-PNL-24P",
    name: "Network Patch Panel 24-Port",
    location: "WH-North (Zone C)",
    minStock: 15,
    currentStock: 26,
    icon: MdDns,
  },
  {
    id: "RCK-PDU-8",
    name: "Rackmount PDU 8-Outlet",
    location: "WH-South (Dock 1)",
    minStock: 20,
    currentStock: 40,
    icon: MdPower,
  },
  {
    id: "MEM-ECC-32",
    name: "Server RAM 32GB ECC",
    location: "WH-Main (Secure Vault)",
    minStock: 30,
    currentStock: 0,
    icon: MdMemory,
  },
  {
    id: "STO-SAS-2T",
    name: "SAS Hard Drive 2.4TB 10K",
    location: "WH-North (Zone B)",
    minStock: 20,
    currentStock: 35,
    icon: MdStorage,
  },
  {
    id: "NET-SFP-10G",
    name: "SFP+ Transceiver Module 10G",
    location: "WH-North (Zone C)",
    minStock: 40,
    currentStock: 110,
    icon: MdRouter,
  },
  {
    id: "RCK-NUT-100",
    name: "Rack Screws & Cage Nuts (100)",
    location: "WH-South (Dock 1)",
    minStock: 50,
    currentStock: 85,
    icon: MdPrecisionManufacturing,
  },
  {
    id: "NET-NIC-10G",
    name: "10G Network Interface Card",
    location: "WH-Main (Aisle 4)",
    minStock: 15,
    currentStock: 22,
    icon: MdComputer,
  },
  {
    id: "SEC-FW-APP",
    name: "Firewall Security Appliance",
    location: "WH-North (Secure Vault)",
    minStock: 5,
    currentStock: 7,
    icon: MdDns,
  },
  {
    id: "ACC-BT-USB",
    name: "Bluetooth 5.0 USB Adapter",
    location: "WH-East (Aisle 3)",
    minStock: 100,
    currentStock: 280,
    icon: MdComputer,
  },
  {
    id: "STO-USB-128",
    name: "USB 3.0 Flash Drive 128GB",
    location: "WH-East (Aisle 3)",
    minStock: 100,
    currentStock: 54,
    icon: MdStorage,
  },
  {
    id: "FUR-CHR-ERG",
    name: "Ergonomic Office Chair (IT Room)",
    location: "WH-South (Zone C)",
    minStock: 5,
    currentStock: 12,
    icon: MdBuildCircle,
  },
  {
    id: "TLS-STP-ANT",
    name: "Anti-Static Wrist Strap",
    location: "WH-West (Tool Rack)",
    minStock: 30,
    currentStock: 45,
    icon: MdBuildCircle,
  },
  {
    id: "TLS-SD-SET",
    name: "Precision Screwdriver Set",
    location: "WH-West (Tool Rack)",
    minStock: 15,
    currentStock: 8,
    icon: MdBuildCircle,
  },
  {
    id: "TLS-MM-DGT",
    name: "Digital Multimeter",
    location: "WH-West (Tool Rack)",
    minStock: 10,
    currentStock: 14,
    icon: MdPrecisionManufacturing,
  },
  {
    id: "TLS-CBL-TST",
    name: "Network Cable Tester",
    location: "WH-West (Tool Rack)",
    minStock: 10,
    currentStock: 0,
    icon: MdPrecisionManufacturing,
  },
  {
    id: "UPS-3000VA",
    name: "Uninterruptible Power Supply 3000VA",
    location: "WH-South (Dock 1)",
    minStock: 3,
    currentStock: 4,
    icon: MdPower,
  },
];

export default function StockManagement() {
  const [stockItems, setStockItems] = useState(INITIAL_STOCK_DATA);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [updateAmount, setUpdateAmount] = useState("");


 const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      const data = await res.json();

      if (res.ok) {
        setProducts(data.products || []);
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
  
console.log(products);


  // স্ট্যাটাস ডায়নামিকভাবে ক্যালকুলেট করার ফাংশন
  const getStatus = (current, min) => {
    if (current === 0) return "Out of Stock";
    if (current <= min) return "Low Stock";
    return "In Stock";
  };

  // সার্চ কোয়েরি অনুযায়ী স্টক ফিল্টার করার লজিক
  const filteredStock = useMemo(() => {
    if (!searchQuery) return stockItems;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return stockItems.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerCaseQuery) ||
        item.id.toLowerCase().includes(lowerCaseQuery) ||
        item.location.toLowerCase().includes(lowerCaseQuery) ||
        getStatus(item.currentStock, item.minStock)
          .toLowerCase()
          .includes(lowerCaseQuery),
    );
  }, [searchQuery, stockItems]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredStock.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStock.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // নিজস্ব কোডে পিডিএফ/প্রিন্ট কল করার ফাংশন
  const generatePDF = () => {
    if (filteredStock.length === 0) {
      alert("No data available to print.");
      return;
    }
    window.print();
  };

  // স্টক আপডেট হ্যান্ডলার
  const openUpdateModal = (item) => {
    setSelectedItem(item);
    setUpdateAmount(item.currentStock.toString());
    setIsModalOpen(true);
  };

  const saveStockUpdate = (e) => {
    e.preventDefault();
    const newStock = parseInt(updateAmount, 10);

    if (isNaN(newStock) || newStock < 0) {
      alert("Please enter a valid stock amount (0 or more).");
      return;
    }

    setStockItems((prevItems) =>
      prevItems.map((item) =>
        item.id === selectedItem.id
          ? { ...item, currentStock: newStock }
          : item,
      ),
    );

    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // স্ট্যাটাস অনুযায়ী ব্যাজ এবং ব্যাকগ্রাউন্ডের স্টাইল
  const getStatusStyle = (status) => {
    switch (status) {
      case "Low Stock":
        return { badge: "bg-yellow-100 text-yellow-800", row: "" };
      case "In Stock":
        return { badge: "bg-[#611F69]/10 text-[#611F69]", row: "" };
      case "Out of Stock":
        return {
          badge: "bg-red-100 text-red-700 border border-red-200",
          row: "bg-red-50/50",
        };
      default:
        return { badge: "bg-gray-200 text-gray-800", row: "" };
    }
  };

  // KPI ক্যালকুলেশন
  const outOfStockCount = stockItems.filter(
    (item) => item.currentStock === 0,
  ).length;
  const lowStockCount = stockItems.filter(
    (item) => item.currentStock > 0 && item.currentStock <= item.minStock,
  ).length;

  return (
    <main className="p-5 min-h-screen bg-gray-50 print:bg-white print:p-0">
      {/* শুধু প্রিন্টের সময় দেখানোর জন্য রিপোর্ট হেডার */}
      <div className="hidden print:block mb-8 border-b border-gray-300 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Stock Inventory Report
        </h1>
        <p className="text-gray-600">
          Generated on: {new Date().toLocaleDateString()}
        </p>
        {searchQuery && (
          <p className="text-gray-500 text-sm mt-1">
            Filtered by: "{searchQuery}"
          </p>
        )}
      </div>

      {/* Header - প্রিন্টের সময় লুকানো থাকবে */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Stock Management
          </h1>
          <p className="text-gray-500 text-sm">
            Monitor inventory levels and manage restocking across all locations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={generatePDF}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#611F69]/30"
          >
            <MdDownload className="text-[18px]" aria-hidden="true" />
            Export to PDF
          </button>
          
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 print:hidden">
        {/* Total Value Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">
              Total Stock Value
            </h3>
            <div className="flex items-end gap-3">
              <span className="text-2xl font-bold text-gray-900">
                $1,245,890
              </span>
              <span className="flex items-center text-[#611F69] bg-[#611F69]/10 px-2 py-0.5 rounded text-xs font-semibold mb-1">
                <MdTrendingUp className="text-[14px] mr-1" aria-hidden="true" />{" "}
                4.2%
              </span>
            </div>
          </div>
        </div>

        {/* Restock Items Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-100 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
          <div className="relative z-10">
            <h3 className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">
              Items to Restock (Low)
            </h3>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-gray-900">
                {lowStockCount}
              </span>
              <MdWarning
                className="text-yellow-600 text-[32px]"
                aria-hidden="true"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Requires attention soon
            </p>
          </div>
        </div>

        {/* Out of Stock Card */}
        <div className="bg-white rounded-lg border border-red-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs text-red-500 uppercase tracking-wider font-semibold mb-2">
              Out of Stock Items
            </h3>
            <span className="text-2xl font-bold text-red-600">
              {outOfStockCount}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">Needs immediate action</p>
          </div>
        </div>
      </div>

      {/* Main Data Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm print:border-none print:shadow-none">
        {/* Toolbar - প্রিন্টের সময় লুকানো থাকবে */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
          <div className="relative w-full sm:w-72">
            <label htmlFor="search-stock" className="sr-only">
              Search product or SKU
            </label>
            <MdSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]"
              aria-hidden="true"
            />
            <input
              id="search-stock"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#611F69] transition-all"
              placeholder="Search product, SKU..."
              type="search"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium flex items-center gap-1 focus:outline-none">
              <MdFilterList className="text-[16px]" aria-hidden="true" />
              Category
            </button>
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium flex items-center gap-1 focus:outline-none">
              Location
              <MdArrowDropDown className="text-[16px]" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse print:border print:border-gray-300">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 print:bg-gray-100">
                <th
                  scope="col"
                  className="px-6 py-4 text-xs text-gray-500 uppercase tracking-wider font-semibold print:border-b print:border-gray-400"
                >
                  Product Details
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-xs text-gray-500 uppercase tracking-wider font-semibold print:border-b print:border-gray-400"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-xs text-gray-500 uppercase tracking-wider font-semibold text-right print:border-b print:border-gray-400"
                >
                  Min. Stock
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-xs text-gray-500 uppercase tracking-wider font-semibold text-right print:border-b print:border-gray-400"
                >
                  Current
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-xs text-gray-500 uppercase tracking-wider font-semibold text-center print:border-b print:border-gray-400"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-xs text-gray-500 uppercase tracking-wider font-semibold text-right print:hidden"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {currentItems.length > 0 ? (
                currentItems.map((item) => {
                  const IconComponent = item.icon;
                  const currentStatus = getStatus(
                    item.currentStock,
                    item.minStock,
                  );
                  const style = getStatusStyle(currentStatus);

                  return (
                    <tr
                      key={item.id}
                      className={`border-b border-gray-200 hover:bg-gray-50 transition-colors group ${style.row} print:border-b print:border-gray-300`}
                    >
                      <td className="px-6 py-4 print:py-2">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded flex flex-shrink-0 items-center justify-center border print:hidden ${
                              currentStatus === "Out of Stock"
                                ? "bg-red-50 border-red-200"
                                : "bg-gray-100 border-gray-200"
                            }`}
                          >
                            <IconComponent
                              className={
                                currentStatus === "Out of Stock"
                                  ? "text-red-500 text-[20px]"
                                  : "text-gray-500 text-[20px]"
                              }
                              aria-hidden="true"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {item.name}
                            </div>
                            <div className="text-xs text-gray-500 font-mono mt-0.5">
                              SKU: {item.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 print:text-gray-900 print:py-2">
                        {item.location}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-500 print:text-gray-900 print:py-2">
                        {item.minStock}
                      </td>
                      <td
                        className={`px-6 py-4 text-right font-semibold print:text-gray-900 print:py-2 ${
                          currentStatus === "Out of Stock"
                            ? "text-red-600"
                            : "text-gray-900"
                        }`}
                      >
                        {item.currentStock}
                      </td>
                      <td className="px-6 py-4 text-center print:py-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold print:border print:border-gray-400 print:text-gray-900 print:bg-white ${style.badge}`}
                        >
                          {currentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right print:hidden">
                        <div className="flex justify-end gap-2">
                          {currentStatus === "Out of Stock" ? (
                            <button
                              onClick={() => openUpdateModal(item)}
                              className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-xs font-semibold transition-colors flex items-center gap-1 focus:outline-none"
                            >
                              <MdReceiptLong
                                className="text-[16px]"
                                aria-hidden="true"
                              />
                              Restock Now
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => openUpdateModal(item)}
                                className="p-1.5 text-[#611F69] hover:bg-[#611F69]/10 rounded focus:outline-none transition-colors"
                                title="Update Stock"
                                aria-label={`Update stock for ${item.name}`}
                              >
                                <MdEdit
                                  className="text-[20px]"
                                  aria-hidden="true"
                                />
                              </button>
                              {currentStatus === "Low Stock" && (
                                <button
                                  className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded focus:outline-none transition-colors"
                                  title="Purchase Order"
                                  aria-label={`Create purchase order for ${item.name}`}
                                >
                                  <MdShoppingCartCheckout
                                    className="text-[20px]"
                                    aria-hidden="true"
                                  />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <p className="text-lg font-medium text-gray-900">
                      No products found
                    </p>
                    <p className="text-sm mt-1">
                      We couldn't find any stock items matching "{searchQuery}"
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer - প্রিন্টের সময় লুকানো থাকবে */}
        <nav
          className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 print:hidden"
          aria-label="Pagination Navigation"
        >
          <span className="text-sm text-gray-600" aria-live="polite">
            Showing {filteredStock.length > 0 ? indexOfFirstItem + 1 : 0} to{" "}
            {Math.min(indexOfLastItem, filteredStock.length)} of{" "}
            {filteredStock.length} entries
          </span>

          {totalPages > 1 && (
            <div className="flex gap-1">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-1 border border-gray-300 bg-white rounded hover:bg-gray-100 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#611F69]"
                aria-label="Previous page"
              >
                <MdChevronLeft
                  className="text-gray-600 text-[20px]"
                  aria-hidden="true"
                />
              </button>

              {/* Dynamic Page Buttons */}
              {[...Array(totalPages)].map((_, i) => {
                const pageNumber = i + 1;
                // Show first, last, and current/adjacent pages
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 &&
                    pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageClick(pageNumber)}
                      className={`px-3 py-1 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#611F69] ${
                        currentPage === pageNumber
                          ? "bg-[#611F69] text-white"
                          : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                      aria-current={
                        currentPage === pageNumber ? "page" : undefined
                      }
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return (
                    <span
                      key={pageNumber}
                      className="px-2 py-1 text-gray-500"
                      aria-hidden="true"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-1 border border-gray-300 bg-white rounded hover:bg-gray-100 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#611F69]"
                aria-label="Next page"
              >
                <MdChevronRight
                  className="text-gray-600 text-[20px]"
                  aria-hidden="true"
                />
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Update Stock Modal */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm print:hidden">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-3">
              <h2 className="text-xl font-bold text-gray-900">Update Stock</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <MdClose className="text-[24px]" aria-hidden="true" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Product</p>
              <p className="font-semibold text-gray-900">{selectedItem.name}</p>
              <p className="text-xs text-gray-500 font-mono">
                SKU: {selectedItem.id}
              </p>
            </div>

            <form onSubmit={saveStockUpdate}>
              <div className="mb-6">
                <label
                  htmlFor="stockAmount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  New Current Stock
                </label>
                <input
                  id="stockAmount"
                  type="number"
                  min="0"
                  value={updateAmount}
                  onChange={(e) => setUpdateAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#611F69] focus:border-transparent text-gray-900"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  Minimum required stock level is{" "}
                  <strong>{selectedItem.minStock}</strong>.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#611F69] text-white rounded-md hover:bg-[#4a1752] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#611F69]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
