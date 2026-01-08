import { PublicFooter } from "@/components/public/footer";
import { PublicHeader } from "@/components/public/header";
import SingleOpinionPage from "@/components/public/single-opinion";
import React from "react";

const page = () => {
  return (
    <>
      <PublicHeader />
      <SingleOpinionPage />
      <PublicFooter />
    </>
  );
};

export default page;
