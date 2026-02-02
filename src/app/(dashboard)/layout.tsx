export const dynamic = "force-dynamic";

import { getRoles } from "@/src/services/role";
import { Navbar } from "./_components/DashboardNavbar";
import { Sidebar } from "./_components/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminUsers = await getRoles([]);
  // console.log("see admin data==>", adminUsers);
  // console.log("see admin data==>", adminUsers?.daa);

  // Extract role data from API response
  const roleData = adminUsers?.data?.[0];
  
  // Extract admin user from the nested structure
  const adminUserFromApi = roleData?.adminUser?.[0];

  // Construct adminData using actual API response
  const adminData = adminUserFromApi ? {
    // Admin user fields
    id: adminUserFromApi.id,
    fullName: adminUserFromApi.fullName,
    email: adminUserFromApi.email,
    password: adminUserFromApi.password,
    profilePhoto: adminUserFromApi.profilePhoto,
    coverPhoto: adminUserFromApi.coverPhoto || null,
    status: roleData.status,
    isDeleted: roleData.isDeleted,
    roleId: roleData.id,
    createdAt: roleData.createdAt,
    updatedAt: roleData.updatedAt,
    
    // Role information
    role: {
      id: roleData.id,
      name: roleData.name,
      status: roleData.status,
      roleFeature: roleData.roleFeature || [],
    },
  } : {
    // Fallback demo data if API fails
    id: "admin-001",
    fullName: "John Doe",
    email: "john.doe@example.com",
    password: "hashed_password_here",
    profilePhoto: null,
    coverPhoto: null,
    status: "ACTIVE",
    isDeleted: false,
    roleId: "role-001",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    role: {
      id: "role-001",
      name: "Super Admin",
      status: "ACTIVE",
      roleFeature: [],
    },
  };

  return (
    <section className="flex min-h-screen flex-col">
      <Navbar adminData={adminData} />
      <div className="flex flex-1">
        <Sidebar adminData={adminData} />
        <main className="flex-1 overflow-auto ml-0 md:ml-56 pt-0 mt-0">
          {children}
        </main>
      </div>
    </section>
  );
}