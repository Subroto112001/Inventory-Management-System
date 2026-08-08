"use client";

import React from "react";

const DeleteModal = ({ isOpen, onClose, onDelete, productName, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[420px] rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-gray-800">Delete Product</h2>

        <p className="mt-3 text-gray-600">
          Are you sure you want to delete
          <span className="font-semibold text-[#611F69]"> {productName}</span>?
          This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-md border border-gray-300 px-5 py-2 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            disabled={loading}
            className="rounded-md bg-red-600 px-5 py-2 text-white hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
