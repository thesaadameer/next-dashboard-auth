// Sidebar.jsx
"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import {
  MdDashboard,
  MdPerson,
  MdSchool,
  MdAttachMoney,
  MdExitToApp,
} from "react-icons/md";

export default function Sidebar() {
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const getDashboardLink = () => {
    switch (userRole) {
      case "admin":
        return "/dashboard/admin";
      case "instructor":
        return "/dashboard/instructor";
      case "student":
        return "/dashboard/student";
      default:
        return "/dashboard";
    }
  };

  return (
    <div className="w-64 h-screen shadow-md bg-white p-4">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <MdDashboard size={24} />
          <Link href={getDashboardLink()} legacyBehavior>
            <a>Dashboard</a>
          </Link>
        </div>

        {/* Links shown based on role */}
        {userRole === "admin" && (
          <>
            <div className="flex items-center gap-2">
              <MdPerson size={24} />
              <Link href="/dashboard/admin/manage-instructors" legacyBehavior>
                <a>Manage Instructors</a>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <MdSchool size={24} />
              <Link href="/dashboard/admin/manage-students" legacyBehavior>
                <a>Manage Students</a>
              </Link>
            </div>
          </>
        )}

        {userRole === "instructor" && (
          <>
            <div className="flex items-center gap-2">
              <MdPerson size={24} />
              <Link href="/dashboard/instructor/manage-students" legacyBehavior>
                <a>Manage Students</a>
              </Link>
            </div>
          </>
        )}

        {/* Log Out Button */}
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 bg-red-500 text-white font-bold px-6 py-2 mt-3"
        >
          <MdExitToApp size={24} /> Log Out
        </button>
      </div>
    </div>
  );
}
