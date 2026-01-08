import { AdminLayout } from "@/components/admin/admin-layout";
import UsersPage from "@/components/admin/all-users";
import React from "react";

const page = () => {
  return (
    <AdminLayout>
      <UsersPage />
    </AdminLayout>
  );
};

export default page;
