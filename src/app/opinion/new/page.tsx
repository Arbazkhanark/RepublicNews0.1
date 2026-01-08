// import NewOpinionPage from '@/components/admin/admin-opinion-create'
import NewOpinionPage from "@/components/public/create-new-opinion";
import { PublicFooter } from "@/components/public/footer";
import { PublicHeader } from "@/components/public/header";
import React from "react";

const page = () => {
  return (
    <div>
      <PublicHeader />
      {/* <NewOpinionPage /> */}
      <NewOpinionPage />
      <PublicFooter />
    </div>
  );
};

export default page;
