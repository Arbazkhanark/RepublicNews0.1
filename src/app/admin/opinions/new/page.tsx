import { AdminLayout } from "@/components/admin/admin-layout";
import NewOpinionPage from "@/components/admin/admin-opinion-create";

import React from "react";

const page = () => {
  return (
    <AdminLayout>
      <NewOpinionPage />
    </AdminLayout>
  );
};

export default page;
