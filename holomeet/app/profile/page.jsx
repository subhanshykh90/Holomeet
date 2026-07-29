"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function ProfilePage() {
  const { data: session, status } = useSession(); // ← also grab "status"
  const router = useRouter();

  const [formData, setFormData] = useState({
    Firstname: "",
    Secondname: "",
    Email: "",
    DOB: "",
    Department: "",
    Phonenumber: "",
    Usertype: "Student",
    createdAt: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Wait until NextAuth has finished checking the session
    if (status === "loading") return;

    // If not logged in at all, redirect to login
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    // status === "authenticated" — safe to fetch profile
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/profile`, {
          params: { email: session.user.email },
        });

        if (res.data) {
          const formattedDOB = res.data.DOB
            ? new Date(res.data.DOB).toISOString().split("T")[0]
            : "";

          setFormData({
            Firstname:   res.data.Firstname   || "",
            Secondname:  res.data.Secondname  || "",
            Email:       res.data.Email       || session.user.email,
            DOB:         formattedDOB,
            Department:  res.data.Department  || "",
            Phonenumber: res.data.Phonenumber || "",
            Usertype:    res.data.Usertype    || "Student",
            createdAt:   res.data.createdAt   || "",
          });
        }
      } catch (error) {
        if (error.response?.status === 404) {
          // User exists in auth but not yet in Registration collection
          setFormData((prev) => ({ ...prev, Email: session.user.email }));
        } else {
          console.error("Profile fetch error:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session, status]); // ← depend on status too

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`http://localhost:5000/api/profile`, formData);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Error updating profile");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const formatMemberSince = (dateString) => {
    if (!dateString) return "New Member";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const getInitials = () => {
    const first = formData.Firstname
      ? formData.Firstname.charAt(0).toUpperCase()
      : session?.user?.name?.charAt(0) || "U";
    const last = formData.Secondname
      ? formData.Secondname.charAt(0).toUpperCase()
      : "";
    return `${first}${last}`;
  };

  // Show spinner while NextAuth is resolving OR while fetching profile
  if (status === "loading" || loading) {
    return (
      <div className="text-white p-10 bg-[#0f172a] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white bg-[#0f172a] font-sans p-6 md:p-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-blue-400 mb-2">User Profile</h1>
        <p className="text-slate-300 text-sm">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <div className="bg-[#1e293b] p-8 rounded-xl shadow-xl border border-slate-700/50 flex flex-col items-center">
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-4xl font-bold text-white mb-4 shadow-lg shadow-blue-500/20 overflow-hidden border-2 border-slate-600">
              {getInitials()}
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              {formData.Firstname || session?.user?.name} {formData.Secondname}
            </h3>
            <p className="text-sm text-slate-400 mb-6 capitalize">
              {formData.Usertype}
            </p>
            <div className="flex gap-2 w-full justify-center">
              <span className="px-3 py-1.5 bg-slate-700/40 rounded-lg text-xs text-blue-300 border border-slate-600/50 flex items-center">
                @uog.edu.pk
              </span>
            </div>
          </div>

          <div className="bg-[#1e293b] p-6 rounded-xl shadow-xl border border-slate-700/50">
            <h2 className="text-lg font-semibold text-blue-400 mb-4">
              Quick Info
            </h2>
            <hr className="border-slate-700/50 mb-6" />
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="text-blue-400">📧</div>
                <div>
                  <h3 className="text-xs font-bold text-slate-200">
                    Email Address
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {formData.Email}
                  </p>
                </div>
              </div>
              <hr className="border-slate-700/30" />
              <div className="flex items-start gap-4">
                <div className="text-blue-400">📅</div>
                <div>
                  <h3 className="text-xs font-bold text-slate-200">
                    Member Since
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {formatMemberSince(formData.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="bg-[#1e293b] p-8 rounded-xl shadow-xl border border-slate-700/50">
            <h2 className="text-lg font-semibold text-blue-400 mb-4">
              Personal Information
            </h2>
            <hr className="border-slate-700/50 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <label className="block text-xs text-slate-200 mb-2 font-medium">
                  First Name
                </label>
                <input
                  name="Firstname"
                  value={formData.Firstname}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg bg-[#27354f] border border-slate-600/50 outline-none text-sm text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-200 mb-2 font-medium">
                  Last Name
                </label>
                <input
                  name="Secondname"
                  value={formData.Secondname}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg bg-[#27354f] border border-slate-600/50 outline-none text-sm text-slate-100"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-slate-200 mb-2 font-medium">
                  Email
                </label>
                {/* Email is read-only — identifier used to find the user */}
                <input
                  name="Email"
                  value={formData.Email}
                  readOnly
                  className="w-full p-2.5 rounded-lg bg-[#27354f] border border-slate-600/50 text-sm text-slate-400 opacity-80 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-200 mb-2 font-medium">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="DOB"
                  value={formData.DOB}
                  onChange={handleChange}
                  style={{
                    colorScheme: "dark",
                    backgroundColor: "#27354f",
                    appearance: "none",
                    WebkitAppearance: "none",
                  }}
                  className="w-full p-2.5 rounded-lg border border-slate-600/50 text-sm text-slate-100 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-200 mb-2 font-medium">
                  Department
                </label>
                <input
                  name="Department"
                  value={formData.Department}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg bg-[#27354f] border border-slate-600/50 text-sm text-slate-100 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-200 mb-2 font-medium">
                  Phone Number
                </label>
                <input
                  name="Phonenumber"
                  value={formData.Phonenumber}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg bg-[#27354f] border border-slate-600/50 text-sm text-slate-100 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2 rounded-lg border border-slate-600/80 text-xs text-white hover:bg-slate-700/40 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-white font-semibold text-xs disabled:opacity-50 transition-colors"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
