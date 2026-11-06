"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/components/ui/input-password";
import { getErrorMessage } from "@/lib/error";
import { LoginInput, loginSchema } from "@/schema/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription } from "../ui/alert";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setIsLoading(true);
      setError(null);

      await signIn("credentials", {
        phone: data.phone,
        password: data.password,
        redirect: false,
      });

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
              <Input
                id="phone"
                {...register("phone")}
                placeholder="Enter your phone number"
                error={!!errors.phone}
              />
              <FieldError errors={[errors.phone]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <InputPassword
                id="password"
                {...register("password")}
                placeholder="Enter your password"
                error={!!errors.password}
              />
              <FieldError errors={[errors.password]} />
            </Field>
            <Button
              type="button"
              variant="link"
              className="text-muted-foreground ml-auto -my-1"
            >
              Forget password?
            </Button>
          </FieldGroup>

          {error && (
            <Alert variant="destructive" className="border-destructive/40">
              <CircleAlert />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button
            type="submit"
            className="w-full mt-5"
            size="lg"
            isLoading={isLoading}
          >
            Sign In
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
