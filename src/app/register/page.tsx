import { RegisterForm } from "@/components/public/auth/register-form";
import { PublicFooter } from "@/components/public/footer";
import { PublicHeader } from "@/components/public/header";

export default function RegisterPage() {
  return (
    <div>
      <PublicHeader />
      <RegisterForm />
      <PublicFooter />
    </div>
  );
}
