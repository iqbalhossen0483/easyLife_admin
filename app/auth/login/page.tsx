import LoginBanner from "@/components/auth/LoginBanner";
import LoginForm from "@/components/auth/LoginForm";

export const instant = false;

export default async function LoginPage() {
  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      <div className="hidden lg:block lg:w-1/2">
        <LoginBanner />
      </div>

      <div className="flex flex-1 items-center justify-center p-4 bg-background">
        <LoginForm />
      </div>
    </div>
  );
}
