import { AdminLayout } from "@/components/admin/admin-layout";
import CategoriesPage from "@/components/admin/categories";
import React from "react";

const page = () => {
  return (
    <AdminLayout>
      <CategoriesPage />
    </AdminLayout>
  );
};

export default page;
