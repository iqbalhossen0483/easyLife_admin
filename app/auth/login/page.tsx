import LoginBanner from "@/components/auth/LoginBanner";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      {/* Left Side: Banner (Hidden on mobile) */}
      <div className="hidden lg:block lg:w-1/2">
        <LoginBanner />
      </div>

      {/* Right Side: Login Form */}
      <div className="flex flex-1 items-center justify-center p-4 bg-background">
        <LoginForm />
      </div>
    </div>
  );
}
