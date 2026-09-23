"use client";

import React, { useMemo, useState } from "react";
import {
  MdAccessTime,
  MdAdd,
  MdCalendarToday,
  MdCheckCircle,
  MdClose,
  MdFilterList,
  MdMoreVert,
  MdPeople,
  MdRefresh,
  MdSearch,
  MdTrendingUp,
  MdWarning,
} from "react-icons/md";

const dummyAttendance = [
  {
    id: 1,
    employeeId: "EMP-001",
    name: "Arif Hossain",
    department: "Operations",
    role: "Operations Manager",
    checkIn: "08:54 AM",
    checkOut: "05:12 PM",
    workingHours: "8h 18m",
    status: "Present",
  },
  {
    id: 2,
    employeeId: "EMP-002",
    name: "Nusrat Jahan",
    department: "Sales",
    role: "Sales Executive",
    checkIn: "09:08 AM",
    checkOut: "05:05 PM",
    workingHours: "7h 57m",
    status: "Late",
  },
  {
    id: 3,
    employeeId: "EMP-003",
    name: "Tanvir Ahmed",
    department: "IT",
    role: "Full Stack Developer",
    checkIn: "08:47 AM",
    checkOut: "05:21 PM",
    workingHours: "8h 34m",
    status: "Present",
  },
  {
    id: 4,
    employeeId: "EMP-004",
    name: "Sadia Rahman",
    department: "HR",
    role: "HR Executive",
    checkIn: "09:01 AM",
    checkOut: "05:00 PM",
    workingHours: "7h 59m",
    status: "Present",
  },
  {
    id: 5,
    employeeId: "EMP-005",
    name: "Rakib Hasan",
    department: "Warehouse",
    role: "Warehouse Officer",
    checkIn: "—",
    checkOut: "—",
    workingHours: "—",
    status: "Absent",
  },
  {
    id: 6,
    employeeId: "EMP-006",
    name: "Mim Akter",
    department: "Finance",
    role: "Accountant",
    checkIn: "08:58 AM",
    checkOut: "05:08 PM",
    workingHours: "8h 10m",
    status: "Present",
  },
  {
    id: 7,
    employeeId: "EMP-007",
    name: "Sakib Khan",
    department: "Sales",
    role: "Sales Executive",
    checkIn: "09:17 AM",
    checkOut: "05:10 PM",
    workingHours: "7h 53m",
    status: "Late",
  },
  {
    id: 8,
    employeeId: "EMP-008",
    name: "Jannatul Ferdous",
    department: "Marketing",
    role: "Marketing Executive",
    checkIn: "08:49 AM",
    checkOut: "05:03 PM",
    workingHours: "8h 14m",
    status: "Present",
  },
  {
    id: 9,
    employeeId: "EMP-009",
    name: "Mehedi Hasan",
    department: "IT",
    role: "Frontend Developer",
    checkIn: "—",
    checkOut: "—",
    workingHours: "—",
    status: "Absent",
  },
  {
    id: 10,
    employeeId: "EMP-010",
    name: "Farzana Yasmin",
    department: "Operations",
    role: "Operations Executive",
    checkIn: "08:56 AM",
    checkOut: "05:14 PM",
    workingHours: "8h 18m",
    status: "Present",
  },
];

const departments = [
  "All Departments",
  "IT",
  "HR",
  "Sales",
  "Finance",
  "Operations",
  "Warehouse",
  "Marketing",
];

const statusOptions = ["All Status", "Present", "Late", "Absent"];

const getInitials = (name) => {
  return name
    .split(" ")
    .map((item) => item[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const getStatusClass = (status) => {
  switch (status) {
    case "Present":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "Late":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "Absent":
      return "bg-red-50 text-red-700 border-red-200";

    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const getStatusDot = (status) => {
  switch (status) {
    case "Present":
      return "bg-emerald-500";

    case "Late":
      return "bg-amber-500";

    case "Absent":
      return "bg-red-500";

    default:
      return "bg-gray-400";
  }
};

export default function AttendancePage() {
  const [attendance, setAttendance] = useState(dummyAttendance);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [status, setStatus] = useState("All Status");
  const [selectedDate, setSelectedDate] = useState("2026-09-22");

  const [showModal, setShowModal] = useState(false);

  const [newAttendance, setNewAttendance] = useState({
    employee: "",
    checkIn: "",
    checkOut: "",
    status: "Present",
  });

  const stats = useMemo(() => {
    const total = attendance.length;

    const present = attendance.filter(
      (item) => item.status === "Present",
    ).length;

    const late = attendance.filter((item) => item.status === "Late").length;

    const absent = attendance.filter((item) => item.status === "Absent").length;

    return {
      total,
      present,
      late,
      absent,
    };
  }, [attendance]);

  const filteredAttendance = useMemo(() => {
    return attendance.filter((employee) => {
      const searchMatch =
        employee.name.toLowerCase().includes(search.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(search.toLowerCase()) ||
        employee.role.toLowerCase().includes(search.toLowerCase());

      const departmentMatch =
        department === "All Departments" || employee.department === department;

      const statusMatch = status === "All Status" || employee.status === status;

      return searchMatch && departmentMatch && statusMatch;
    });
  }, [attendance, search, department, status]);

  const handleReset = () => {
    setSearch("");
    setDepartment("All Departments");
    setStatus("All Status");
  };

  const handleMarkAttendance = (e) => {
    e.preventDefault();

    if (!newAttendance.employee) return;

    const employee = attendance.find(
      (item) => item.id === Number(newAttendance.employee),
    );

    if (!employee) return;

    const updatedEmployee = {
      ...employee,
      checkIn: newAttendance.checkIn || employee.checkIn,
      checkOut: newAttendance.checkOut || employee.checkOut,
      status: newAttendance.status,
    };

    setAttendance((prev) =>
      prev.map((item) => (item.id === employee.id ? updatedEmployee : item)),
    );

    setNewAttendance({
      employee: "",
      checkIn: "",
      checkOut: "",
      status: "Present",
    });

    setShowModal(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f9fb] text-gray-900">
      <main className="w-full px-4 py-5 sm:px-6 lg:px-8">
        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}

        <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Attendance
              </h1>

              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                Today
              </span>
            </div>

            <p className="text-sm text-gray-500">
              Track employee attendance, working hours and daily presence.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              <MdRefresh size={19} />
              Reset
            </button>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-xl bg-[#611F69] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#501957]"
            >
              <MdAdd size={20} />
              Mark Attendance
            </button>
          </div>
        </header>

        {/* ===================================================== */}
        {/* DATE BAR */}
        {/* ===================================================== */}

        <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-[#611F69]">
                <MdCalendarToday size={21} />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Attendance Date
                </p>

                <p className="text-sm font-semibold text-gray-800">
                  Tuesday, September 22, 2026
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 outline-none transition focus:border-[#611F69] focus:ring-2 focus:ring-purple-100"
              />
            </div>
          </div>
        </section>

        {/* ===================================================== */}
        {/* KPI CARDS */}
        {/* ===================================================== */}

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Total Employees */}

          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Total Employees
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-[#611F69]">
                <MdPeople size={24} />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 font-semibold text-[#611F69]">
                <MdTrendingUp size={15} />
                Active
              </span>

              <span className="text-gray-400">employees</span>
            </div>
          </article>

          {/* Present */}

          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Present
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stats.present}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <MdCheckCircle size={24} />
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-gray-500">Attendance rate</span>

                <span className="font-semibold text-emerald-600">
                  {Math.round((stats.present / stats.total) * 100)}%
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{
                    width: `${(stats.present / stats.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          </article>

          {/* Late */}

          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Late Arrivals
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stats.late}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <MdAccessTime size={24} />
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              Employees arrived after 9:00 AM
            </div>
          </article>

          {/* Absent */}

          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Absent
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stats.absent}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <MdWarning size={24} />
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              Requires attendance review
            </div>
          </article>
        </section>

        {/* ===================================================== */}
        {/* FILTERS */}
        {/* ===================================================== */}

        <section className="mb-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <MdFilterList className="text-[#611F69]" size={20} />

            <h2 className="text-sm font-semibold text-gray-800">
              Attendance Records
            </h2>

            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
              {filteredAttendance.length}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {/* Search */}

            <div className="relative">
              <MdSearch
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search employee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#611F69] focus:bg-white focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Department */}

            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#611F69] focus:bg-white focus:ring-2 focus:ring-purple-100"
            >
              {departments.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {/* Status */}

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#611F69] focus:bg-white focus:ring-2 focus:ring-purple-100"
            >
              {statusOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {/* Result */}

            <div className="flex items-center justify-center rounded-xl bg-purple-50 px-4 py-2.5 text-sm font-medium text-[#611F69]">
              Showing {filteredAttendance.length} of {attendance.length}{" "}
              employees
            </div>
          </div>
        </section>

        {/* ===================================================== */}
        {/* TABLE */}
        {/* ===================================================== */}

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Employee
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Department
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Check In
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Check Out
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Working Hours
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredAttendance.length > 0 ? (
                  filteredAttendance.map((employee) => (
                    <tr
                      key={employee.id}
                      className="group transition hover:bg-gray-50/70"
                    >
                      {/* Employee */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#611F69]/10 text-sm font-bold text-[#611F69]">
                            {getInitials(employee.name)}
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {employee.name}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-400">
                              {employee.employeeId} • {employee.role}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Department */}

                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-gray-600">
                          {employee.department}
                        </span>
                      </td>

                      {/* Check In */}

                      <td className="px-5 py-4">
                        <span
                          className={`text-sm font-medium ${
                            employee.checkIn === "—"
                              ? "text-gray-300"
                              : employee.status === "Late"
                                ? "text-amber-600"
                                : "text-gray-700"
                          }`}
                        >
                          {employee.checkIn}
                        </span>
                      </td>

                      {/* Check Out */}

                      <td className="px-5 py-4">
                        <span
                          className={`text-sm font-medium ${
                            employee.checkOut === "—"
                              ? "text-gray-300"
                              : "text-gray-700"
                          }`}
                        >
                          {employee.checkOut}
                        </span>
                      </td>

                      {/* Working Hours */}

                      <td className="px-5 py-4">
                        <span
                          className={`text-sm font-semibold ${
                            employee.workingHours === "—"
                              ? "text-gray-300"
                              : "text-gray-700"
                          }`}
                        >
                          {employee.workingHours}
                        </span>
                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                            employee.status,
                          )}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                              employee.status,
                            )}`}
                          />

                          {employee.status}
                        </span>
                      </td>

                      {/* Action */}

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                        >
                          <MdMoreVert size={21} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                          <MdSearch size={27} />
                        </div>

                        <h3 className="text-sm font-semibold text-gray-800">
                          No attendance records found
                        </h3>

                        <p className="mt-1 text-xs text-gray-400">
                          Try changing your search or filter options.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}

          <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {filteredAttendance.length}
              </span>{" "}
              attendance records
            </p>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Present
              </span>

              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Late
              </span>

              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Absent
              </span>
            </div>
          </div>
        </section>

        {/* ===================================================== */}
        {/* SUMMARY */}
        {/* ===================================================== */}

        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                <MdCheckCircle size={22} />
              </div>

              <div>
                <p className="text-xs font-medium text-emerald-600">
                  Present Today
                </p>

                <p className="text-xl font-bold text-emerald-800">
                  {stats.present} Employees
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm">
                <MdAccessTime size={22} />
              </div>

              <div>
                <p className="text-xs font-medium text-amber-600">
                  Late Arrivals
                </p>

                <p className="text-xl font-bold text-amber-800">
                  {stats.late} Employees
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-red-100 bg-red-50/60 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm">
                <MdWarning size={22} />
              </div>

              <div>
                <p className="text-xs font-medium text-red-600">Absent Today</p>

                <p className="text-xl font-bold text-red-800">
                  {stats.absent} Employees
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ===================================================== */}
      {/* MARK ATTENDANCE MODAL */}
      {/* ===================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Mark Attendance
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Add or update today's attendance record.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <MdClose size={22} />
              </button>
            </div>

            {/* Modal Body */}

            <form onSubmit={handleMarkAttendance} className="space-y-5 p-6">
              {/* Employee */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Employee
                </label>

                <select
                  value={newAttendance.employee}
                  onChange={(e) =>
                    setNewAttendance({
                      ...newAttendance,
                      employee: e.target.value,
                    })
                  }
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#611F69] focus:bg-white focus:ring-2 focus:ring-purple-100"
                >
                  <option value="">Select employee</option>

                  {attendance.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} — {employee.employeeId}
                    </option>
                  ))}
                </select>
              </div>

              {/* Check In / Check Out */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Check In
                  </label>

                  <input
                    type="time"
                    value={newAttendance.checkIn}
                    onChange={(e) =>
                      setNewAttendance({
                        ...newAttendance,
                        checkIn: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#611F69] focus:bg-white focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Check Out
                  </label>

                  <input
                    type="time"
                    value={newAttendance.checkOut}
                    onChange={(e) =>
                      setNewAttendance({
                        ...newAttendance,
                        checkOut: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#611F69] focus:bg-white focus:ring-2 focus:ring-purple-100"
                  />
                </div>
              </div>

              {/* Status */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>

                <select
                  value={newAttendance.status}
                  onChange={(e) =>
                    setNewAttendance({
                      ...newAttendance,
                      status: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#611F69] focus:bg-white focus:ring-2 focus:ring-purple-100"
                >
                  <option value="Present">Present</option>

                  <option value="Late">Late</option>

                  <option value="Absent">Absent</option>
                </select>
              </div>

              {/* Actions */}

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-[#611F69] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#501957]"
                >
                  Save Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
