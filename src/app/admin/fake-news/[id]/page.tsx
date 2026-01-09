import FakeNewsDetailPage from "@/components/admin/admin-detailed-report";
import { AdminLayout } from "@/components/admin/admin-layout";
import React from "react";

const page = () => {
  return (
    <AdminLayout>
      <FakeNewsDetailPage />
    </AdminLayout>
  );
};

export default page;
