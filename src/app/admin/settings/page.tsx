import { AdminLayout } from "@/components/admin/admin-layout";
import SettingsPage from "@/components/admin/admin-setting";
import React from "react";

const page = () => {
  return (
    <AdminLayout>
      <SettingsPage />
    </AdminLayout>
  );
};

export default page;
