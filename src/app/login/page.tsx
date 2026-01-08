import { LoginForm } from "@/components/public/auth/login-form";
import { PublicHeader } from "@/components/public/header";

export default function LoginPage() {
  return (
    <div>
      {/* // <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"> */}
      <PublicHeader />
      {/* <div className="mt-20">
      </div> */}
      <LoginForm />
    </div>
  );
}
