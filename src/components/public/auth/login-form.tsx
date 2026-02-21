// "use client";

// import type React from "react";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { useAuth } from "@/lib/hooks/use-auth";

// export function LoginForm() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   // Use the auth hook
//   const { login, loading } = useAuth();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     // Use the login function from useAuth hook
//     const result = await login(email, password, "user");

//     if (result.success) {
//       router.push("/");
//     } else {
//       setError(result.error || "Login failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-white to-red-200 px-4">
//       <Card className="w-full max-w-md backdrop-blur-md shadow-lg border border-red-300">
//         <CardHeader className="text-center space-y-1">
//           <CardTitle className="text-3xl font-extrabold text-red-600">
//             Republic Mirror
//           </CardTitle>
//           <CardDescription className="text-gray-600">
//             Login to access your dashboard
//           </CardDescription>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {error && (
//               <Alert variant="destructive">
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}

//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <div className="text-right">
//                 <button
//                   type="button"
//                   onClick={() => router.push("/forgot-password")}
//                   className="text-sm text-red-500 hover:underline"
//                 >
//                   Forgot Password?
//                 </button>
//               </div>
//             </div>

//             <Button
//               type="submit"
//               className="w-full bg-red-600 hover:bg-red-700 transition-all"
//               disabled={loading}
//             >
//               {loading ? "Signing in..." : "Sign In"}
//             </Button>
//           </form>

//           <div className="text-center mt-6 text-sm text-gray-600">
//             Don&apos;t have an account?{" "}
//             <button
//               type="button"
//               onClick={() => router.push("/register")}
//               className="text-red-600 font-medium hover:underline"
//             >
//               Create Account
//             </button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }









"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/hooks/use-auth";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Use the auth hook
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Use the login function from useAuth hook
    const result = await login(email, password, "user");

    if (result.success) {
      router.push("/");
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-white to-red-200 px-4">
      <Card className="w-full max-w-md backdrop-blur-md shadow-lg border border-red-300">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-3xl font-extrabold text-red-600">
            Republic Mirror
          </CardTitle>
          <CardDescription className="text-gray-600">
            Login to access your dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => router.push("/forgot-password")}
                  className="text-sm text-red-500 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 transition-all"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center mt-6 text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="text-red-600 font-medium hover:underline"
            >
              Create Account
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}