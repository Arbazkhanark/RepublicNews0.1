import { AdminLayout } from "@/components/admin/admin-layout";
import NewsletterPage from "@/components/admin/newsletter";
import React from "react";

const page = () => {
  return (
    <AdminLayout>
      <NewsletterPage />
    </AdminLayout>
  );
};

export default page;
