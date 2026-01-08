import ContactPage from "@/components/public/contact";
import { PublicFooter } from "@/components/public/footer";
import { PublicHeader } from "@/components/public/header";
import React from "react";

const page = () => {
  return (
    <div>
      <PublicHeader />
      <ContactPage />
      <PublicFooter />
    </div>
  );
};

export default page;
