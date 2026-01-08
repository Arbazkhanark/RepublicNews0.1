import { AdminLayout } from "@/components/admin/admin-layout";
import OpinionAdmin from "@/components/admin/admin-opinion";
import React from "react";

const page = () => {
  return (
    <AdminLayout>
      <OpinionAdmin />
    </AdminLayout>
  );
};

export default page;
