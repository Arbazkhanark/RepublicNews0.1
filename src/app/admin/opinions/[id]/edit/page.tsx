// app/admin/opinions/[id]/edit/page.tsx
import { AdminLayout } from "@/components/admin/admin-layout";
import EditOpinionPage from "@/components/admin/edit-view-opinion";
import React from "react";

const page = () => {
  return (
    <AdminLayout>
      <EditOpinionPage />
    </AdminLayout>
  );
};

export default page;


