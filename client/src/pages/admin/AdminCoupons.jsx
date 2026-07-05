// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Tag,
  X,
  Percent,
  IndianRupee,
} from "lucide-react";
import {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  clearCouponError,
  clearCouponSuccess,
} from "@/store/order/couponSlice";
import Loader from "../../extras/Loader";

const EMPTY_FORM = {
  code: "",
  description: "",
  discountType: "PERCENTAGE",
  discountValue: "",
  minOrderAmount: "",
  maxDiscount: "",
  expiresAt: "",
  usageLimit: "",
  isActive: true,
};

// Derive a human status from the coupon's own fields.
const statusOf = (c) => {
  if (!c.isActive) return { label: "Inactive", cls: "bg-gray-100 text-gray-600" };
  if (c.expiresAt && new Date(c.expiresAt).getTime() < Date.now()) {
    return { label: "Expired", cls: "bg-red-100 text-red-700" };
  }
  if (c.usageLimit > 0 && c.usedCount >= c.usageLimit) {
    return { label: "Used up", cls: "bg-amber-100 text-amber-700" };
  }
  return { label: "Active", cls: "bg-emerald-100 text-emerald-700" };
};

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "No expiry";

const AdminCoupons = () => {
  const dispatch = useDispatch();
  const { coupons, loading, error, success } = useSelector((s) => s.coupon);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    dispatch(getAllCoupons());
  }, [dispatch]);

  // Close the modal once a create/update succeeds.
  useEffect(() => {
    if (success) {
      setShowModal(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      setConfirmDelete(null);
      dispatch(clearCouponSuccess());
    }
  }, [success, dispatch]);

  // Auto-clear any server error after a few seconds.
  useEffect(() => {
    if (error) {
      const t = setTimeout(() => dispatch(clearCouponError()), 4000);
      return () => clearTimeout(t);
    }
  }, [error, dispatch]);

  const stats = useMemo(() => {
    const active = coupons.filter((c) => statusOf(c).label === "Active").length;
    const totalRedemptions = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0);
    return { total: coupons.length, active, totalRedemptions };
  }, [coupons]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditingId(c._id);
    setForm({
      code: c.code || "",
      description: c.description || "",
      discountType: c.discountType || "PERCENTAGE",
      discountValue: c.discountValue ?? "",
      minOrderAmount: c.minOrderAmount ?? "",
      maxDiscount: c.maxDiscount ?? "",
      expiresAt: c.expiresAt ? new Date(c.expiresAt).toISOString().slice(0, 10) : "",
      usageLimit: c.usageLimit ?? "",
      isActive: c.isActive ?? true,
    });
    setFormError("");
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = () => {
    setFormError("");
    setFieldErrors({});
    const code = form.code.trim().toUpperCase();
    const fe = {};
    if (!code) fe.code = "Coupon code is required";

    const discountValue = Number(form.discountValue);
    if (Number.isNaN(discountValue) || discountValue < 0) {
      fe.discountValue = "Discount value must be a non-negative number";
    }
    if (form.discountType === "PERCENTAGE" && discountValue > 100) {
      fe.discountValue = "A percentage discount cannot exceed 100";
    }
    if (Object.keys(fe).length > 0) {
      setFieldErrors(fe);
      return;
    }

    const payload = {
      code,
      description: form.description.trim(),
      discountType: form.discountType,
      discountValue,
      minOrderAmount: form.minOrderAmount === "" ? 0 : Number(form.minOrderAmount),
      maxDiscount: form.maxDiscount === "" ? 0 : Number(form.maxDiscount),
      expiresAt: form.expiresAt || null,
      usageLimit: form.usageLimit === "" ? 0 : Number(form.usageLimit),
      isActive: form.isActive,
    };

    if (editingId) {
      dispatch(updateCoupon({ id: editingId, payload }));
    } else {
      dispatch(createCoupon(payload));
    }
  };

  if (loading && coupons.length === 0) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-28 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500 p-3 rounded-2xl">
              <Tag className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Coupons & Promotions</h1>
              <p className="text-gray-600">
                Create and manage discount coupons for checkout
              </p>
            </div>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl transition"
          >
            <Plus className="w-4 h-4" /> New Coupon
          </button>
        </motion.div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3">
            {error}
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Coupons", value: stats.total, color: "bg-indigo-500" },
            { label: "Active", value: stats.active, color: "bg-emerald-500" },
            {
              label: "Total Redemptions",
              value: stats.totalRedemptions,
              color: "bg-blue-500",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow border border-white/20 p-5"
            >
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Coupon list */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow border border-white/20 overflow-hidden">
          {coupons.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Tag className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              No coupons yet. Create your first promotional coupon.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 text-left">
                  <tr>
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Discount</th>
                    <th className="px-4 py-3">Min Order</th>
                    <th className="px-4 py-3">Validity</th>
                    <th className="px-4 py-3">Usage</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {coupons.map((c) => {
                    const st = statusOf(c);
                    return (
                      <tr key={c._id} className="hover:bg-gray-50/60">
                        <td className="px-4 py-3">
                          <span className="font-mono font-semibold text-gray-900">
                            {c.code}
                          </span>
                          {c.description && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {c.description}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {c.discountType === "PERCENTAGE"
                            ? `${c.discountValue}%`
                            : `₹${c.discountValue}`}
                          {c.discountType === "PERCENTAGE" &&
                            c.maxDiscount > 0 && (
                              <span className="text-xs text-gray-400">
                                {" "}
                                (max ₹{c.maxDiscount})
                              </span>
                            )}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {c.minOrderAmount > 0 ? `₹${c.minOrderAmount}` : "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {formatDate(c.expiresAt)}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {c.usedCount}
                          {c.usageLimit > 0 ? ` / ${c.usageLimit}` : " / ∞"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${st.cls}`}
                          >
                            {st.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEdit(c)}
                              className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setConfirmDelete(c)}
                              className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? "Edit Coupon" : "New Coupon"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {formError && (
                <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coupon Code
                </label>
                <input
                  name="code"
                  value={form.code}
                  onChange={(e) => { handleChange(e); setFieldErrors((prev) => ({ ...prev, code: "" })); }}
                  placeholder="e.g. SAVE20"
                  className={`w-full rounded-lg border px-3 py-2 uppercase focus:ring-2 focus:ring-indigo-400 outline-none ${fieldErrors.code ? "border-red-400" : "border-gray-300"}`}
                />
                {fieldErrors.code && <p className="mt-1 text-xs text-red-500">{fieldErrors.code}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <input
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="e.g. 20% off for new customers"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="discountType"
                    value={form.discountType}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {form.discountType === "PERCENTAGE" ? (
                      <span className="inline-flex items-center gap-1">
                        <Percent className="w-3.5 h-3.5" /> Value
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <IndianRupee className="w-3.5 h-3.5" /> Value
                      </span>
                    )}
                  </label>
                  <input
                    name="discountValue"
                    type="number"
                    min="0"
                    value={form.discountValue}
                    onChange={(e) => { handleChange(e); setFieldErrors((prev) => ({ ...prev, discountValue: "" })); }}
                    className={`w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none ${fieldErrors.discountValue ? "border-red-400" : "border-gray-300"}`}
                  />
                  {fieldErrors.discountValue && <p className="mt-1 text-xs text-red-500">{fieldErrors.discountValue}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Order (₹)
                  </label>
                  <input
                    name="minOrderAmount"
                    type="number"
                    min="0"
                    value={form.minOrderAmount}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
                {form.discountType === "PERCENTAGE" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Discount (₹)
                    </label>
                    <input
                      name="maxDiscount"
                      type="number"
                      min="0"
                      value={form.maxDiscount}
                      onChange={handleChange}
                      placeholder="0 = no cap"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    name="expiresAt"
                    type="date"
                    value={form.expiresAt}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usage Limit
                  </label>
                  <input
                    name="usageLimit"
                    type="number"
                    min="0"
                    value={form.usageLimit}
                    onChange={handleChange}
                    placeholder="0 = unlimited"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  name="isActive"
                  type="checkbox"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 rounded"
                />
                Active (available for customers to use)
              </label>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold disabled:opacity-60"
              >
                {editingId ? "Save Changes" : "Create Coupon"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete coupon?</h3>
            <p className="text-gray-600 mb-6">
              This will permanently delete{" "}
              <span className="font-mono font-semibold">{confirmDelete.code}</span>.
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => dispatch(deleteCoupon(confirmDelete._id))}
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
