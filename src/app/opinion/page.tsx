import { PublicFooter } from "@/components/public/footer";
import { PublicHeader } from "@/components/public/header";
import OpinionPage from "@/components/public/Opinion";
import React from "react";

const page = () => {
  return (
    <div>
      <PublicHeader />
      <OpinionPage />
      <PublicFooter />
    </div>
  );
};

export default page;
