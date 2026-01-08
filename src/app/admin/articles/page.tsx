import ArticlesPage from "@/components/admin/admin-articles";
import { AdminLayout } from "@/components/admin/admin-layout";
import React from "react";

const page = () => {
  return (
    <AdminLayout>
      <ArticlesPage />
    </AdminLayout>
  );
};

export default page;
