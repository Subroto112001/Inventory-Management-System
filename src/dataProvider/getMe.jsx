
"use client";

import { useEffect, useState } from "react";

const useCurrentUser = () => {
  const [mydata, setMydata] = useState(null);

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    role: "",
    department: "",
    assignedStore: "",
    status: "",
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    role: "",
    department: "",
    assignedStore: "",
    status: "",
  });

  const [loading, setLoading] = useState(true);

  const getCurrentUser = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/adduser/me", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Failed to get current user:",
          data?.message || "Unauthorized"
        );

        setMydata(null);
        return null;
      }

      if (!data?.user) {
        console.error(
          "User data not found in API response."
        );

        setMydata(null);
        return null;
      }

      const user = data.user;

      setMydata(user);

      // Format API data for profile
      const formattedProfileData = {
        fullName: `${user.firstName || ""} ${
          user.lastName || ""
        }`.trim(),

        email: user.email || "",

        phone: user.phoneNumber || "",

        location: user.district
          ? `${user.district}${
              user.country
                ? `, ${user.country}`
                : ""
            }`
          : user.country || "Not Available",

        role: user.role || "",

        department: user.department || "",

        assignedStore:
          user.assignedWarehouse || "Not Assigned",

        status: user.accountStatus || "",
      };

      setProfileData(formattedProfileData);
      setFormData(formattedProfileData);

      return user;
    } catch (error) {
      console.error(
        "Get current user error:",
        error
      );

      setMydata(null);

      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return {
    mydata,
    profileData,
    setProfileData,
    formData,
    setFormData,
    loading,
    getCurrentUser,
  };
};

export default useCurrentUser;
