import AdminFakeNewsPage from "@/components/admin/admin-fake-news";
import { AdminLayout } from "@/components/admin/admin-layout";
import React from "react";

const page = () => {
  return (
    <AdminLayout>
      <AdminFakeNewsPage />
    </AdminLayout>
  );
};

export default page;
