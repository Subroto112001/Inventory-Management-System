"use client";
import { useState, useCallback } from "react";

const useMeta = () => {
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(true);

  const fetchMeta = useCallback(async () => {
    try {
      setLoadingMeta(true);
      const res = await fetch("/api/role");
      const data = await res.json();
      setRoles(data.roles || []);
      setDepartments(data.departments || []);
      setStatuses(data.statuses || []);
    } catch (err) {
      console.error("Failed to load meta data", err);
    } finally {
      setLoadingMeta(false);
    }
  }, []);

  return { roles, departments, statuses, loadingMeta, fetchMeta };
};

export default useMeta;
