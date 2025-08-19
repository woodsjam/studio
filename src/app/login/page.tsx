"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    // In a real app, this would trigger the Firebase Google Auth flow.
    // For this scaffold, we'll just navigate to the interviews page.
    router.push("/app/interviews");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              CertifyAI
            </h1>
            <CardDescription className="pt-2">
              Certifying oral interviews with confidence.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <Button onClick={handleLogin} className="w-full" size="lg">
                <GoogleIcon className="mr-2 h-5 w-5" />
                Sign in with Google
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
