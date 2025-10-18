import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import { LightRays } from "@/components/ui/light-rays";

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Full-page LightRays background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <LightRays />
      </div>

      {/* Optional: subtle overlay to ensure text contrast on top of rays */}
      {/* <div className="absolute inset-0 -z-10 bg-background/40" /> */}

      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        {/* LEFT: welcome + illustration */}
        <div className="px-4 pb-10 pt-12 md:px-8 md:pt-20">
          <div className="flex flex-col items-center justify-center space-y-4">
            <h2 className="text-center text-xl font-bold md:text-4xl">
              Welcome To{" "}
              <span className="bg-gradient-to-br from-indigo-700 via-blue-400 to-blue-500 bg-clip-text text-transparent">
                Trial Task
              </span>
            </h2>
            <p className="text-center text-sm text-muted-foreground">
              Continue to sign in to access your account.
            </p>
          </div>

          <div className="mt-6">
            <Image
              src="/Images/SignUp.png"
              width={700}
              height={1000}
              alt="Sign in illustration"
              className="h-auto w-full"
              priority
            />
          </div>
        </div>

        {/* RIGHT: Clerk SignIn */}
        <div className="order-first flex h-screen items-center justify-center md:order-last">
          <SignUp />
        </div>
      </div>
    </div>
  );
}
