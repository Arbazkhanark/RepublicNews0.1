import ArticlesPage from "@/components/admin/admin-articles";
import { AdminLayout } from "@/components/admin/admin-layout";
import EditFakeNewsPage from "@/components/admin/edit-fake-news";
import React from "react";

const page = () => {
  return (
    <AdminLayout>
      <EditFakeNewsPage />
    </AdminLayout>
  );
};

export default page;
