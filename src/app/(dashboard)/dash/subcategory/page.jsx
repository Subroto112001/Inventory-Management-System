"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MdAdd, MdCategory, MdDeleteOutline, MdEdit, MdSearch } from "react-icons/md";
import ConfirmationModal from "@/Component/Modal/ConfirmationModal";
import ToastNotification from "@/Component/ToastNotification";

export default function SubcategoryManagementPage() {
  const [subcategories, setSubcategories] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const loadSubcategories = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/subcategory", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Unable to load subcategories.");
      setSubcategories(data.subcategories || []);
    } catch (loadError) {
      setError(loadError.message || "Unable to load subcategories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { Promise.resolve().then(loadSubcategories); }, [loadSubcategories]);

  const visibleSubcategories = useMemo(() => {
    const term = search.trim().toLowerCase();
    return subcategories.filter((subcategory) => {
      const text = [subcategory.categoryName, subcategory.categoryCode, subcategory.parentCategoryName].join(" ").toLowerCase();
      const matchesSearch = !term || text.includes(term);
      const matchesStatus = status === "All" || (status === "Active" ? subcategory.isActive !== false : subcategory.isActive === false);
      return matchesSearch && matchesStatus;
    });
  }, [search, status, subcategories]);
  const pageCount = Math.max(1, Math.ceil(visibleSubcategories.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRows = visibleSubcategories.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDelete = async () => {
    const subcategory = pendingDelete;
    if (!subcategory) return;
    setDeleting(subcategory.id);
    setToast(null);
    try {
      const response = await fetch(`/api/subcategory/${subcategory.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Unable to delete subcategory.");
      setPendingDelete(null);
      setToast({ type: "success", message: data.message || "Subcategory deleted." });
      setSubcategories((items) => items.filter((item) => item.id !== subcategory.id));
    } catch (deleteError) {
      setToast({ type: "error", message: deleteError.message || "Unable to delete subcategory." });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1440px] p-4 sm:p-6">
      <ToastNotification toast={toast} onClose={() => setToast(null)} />
      <ConfirmationModal
        open={Boolean(pendingDelete)}
        title={`Delete ${pendingDelete?.categoryName || "subcategory"}?`}
        description={`Products will remain in Category ${pendingDelete?.parentCategoryName || ""} and lose only their subcategory assignment.`}
        confirmLabel="Delete subcategory"
        loadingLabel="Deleting..."
        loading={Boolean(deleting)}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--theme-primary)]/10 text-[var(--theme-primary)]"><MdCategory size={24} /></span>
          <div><h1 className="text-2xl font-bold tracking-tight text-gray-900">Subcategory Management</h1><p className="mt-1 text-sm text-gray-500">Manage subcategories and the Category each one belongs to.</p></div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dash/category" className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Manage Categories</Link>
          <Link href="/dash/subcategory/create" className="inline-flex items-center gap-2 rounded-lg bg-[var(--theme-primary)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--theme-primary-hover)]"><MdAdd size={19} /> Add Subcategory</Link>
        </div>
      </header>

      {error && <div role="alert" className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"><span>{error}</span><button type="button" onClick={loadSubcategories} className="font-semibold underline">Retry</button></div>}

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-4 sm:p-5">
          <div><h2 className="font-semibold text-gray-900">Subcategories</h2><p className="mt-1 text-sm text-gray-500">{visibleSubcategories.length} shown of {subcategories.length}</p></div>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto">
            <label className="relative min-w-[220px] flex-1 sm:flex-none"><span className="sr-only">Search subcategories</span><MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search name, code, Category" className="h-10 w-full rounded-lg border border-gray-200 pl-9 pr-3 text-sm outline-none focus:border-[var(--theme-primary)]" /></label>
            <select aria-label="Filter subcategories by status" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm"><option>All</option><option>Active</option><option>Inactive</option></select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-4 py-3">Subcategory</th><th className="px-4 py-3">Category</th><th className="px-4 py-3 text-center">Products</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-500">Loading subcategories…</td></tr> : pageRows.map((subcategory) => <tr key={subcategory.id} className="hover:bg-gray-50/70">
                <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">{subcategory.image ? <img src={subcategory.image} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center text-gray-400"><MdCategory /></span>}</div><div><p className="font-medium text-gray-900">{subcategory.categoryName}</p><p className="text-xs text-gray-500">{subcategory.categoryCode}</p></div></div></td>
                <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="h-8 w-8 overflow-hidden rounded-md bg-gray-100">{subcategory.parentCategoryImage && <img src={subcategory.parentCategoryImage} alt="" className="h-full w-full object-cover" />}</div><span className="font-medium text-gray-700">{subcategory.parentCategoryName || "Category unavailable"}</span></div></td>
                <td className="px-4 py-3 text-center">{subcategory.productCount || 0}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${subcategory.isActive === false ? "bg-gray-100 text-gray-600" : "bg-green-50 text-green-700"}`}>{subcategory.isActive === false ? "Inactive" : "Active"}</span></td>
                <td className="px-4 py-3"><div className="flex justify-end gap-2"><Link aria-label={`Edit ${subcategory.categoryName}`} href={`/dash/subcategory/${subcategory.id}/edit`} className="rounded-md p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-700"><MdEdit size={18} /></Link><button type="button" aria-label={`Delete ${subcategory.categoryName}`} disabled={Boolean(deleting)} onClick={() => setPendingDelete(subcategory)} className="rounded-md p-2 text-gray-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"><MdDeleteOutline size={18} /></button></div></td>
              </tr>)}
              {!loading && !error && visibleSubcategories.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-gray-500">{subcategories.length ? "No subcategories match these filters." : <>No subcategories yet. <Link href="/dash/subcategory/create" className="font-semibold text-[var(--theme-primary)] hover:underline">Create one</Link> after adding a Category.</>}</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-sm text-gray-600">
          <span>Page {currentPage} of {pageCount}</span>
          <div className="flex gap-2"><button type="button" disabled={currentPage <= 1} onClick={() => setPage(Math.max(1, currentPage - 1))} className="rounded-md border border-gray-200 px-3 py-1.5 disabled:opacity-40">Previous</button><button type="button" disabled={currentPage >= pageCount} onClick={() => setPage(Math.min(pageCount, currentPage + 1))} className="rounded-md border border-gray-200 px-3 py-1.5 disabled:opacity-40">Next</button></div>
        </div>
      </section>
    </div>
  );
}
