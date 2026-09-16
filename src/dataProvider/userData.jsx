
"use client";

import { useEffect, useState } from "react";

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
const [error, setError] = useState("")
  const fetchUsers = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/adduser", {
        cache: "no-store",
      });

      const data = await res.json();

      if (res.ok) {
        setUsers(data.users || []);
      } else {
        setError(data.message || "Failed to load users");
        console.error(
          "Failed to load users:",
          data.message
        );
        return res.status(500).json({ message: "Failed to load users" });
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    error,
    loading,
    fetchUsers,
  };
};


export default useUsers;

