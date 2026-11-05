import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { LineChart, Network, Package, Users } from "lucide-react";
import React from "react";

export default function LoginBanner() {
  const features = [
    {
      title: "Stock Management",
      description: "Real-time inventory tracking across all warehouses.",
      icon: Package,
    },
    {
      title: "Financial Clarity",
      description: "Precise cash flow and expense monitoring.",
      icon: LineChart,
    },
    {
      title: "Employee Growth",
      description: "Track performance and incentives effectively.",
      icon: Users,
    },
    {
      title: "Dealer Networks",
      description: "Manage complex supplier and dealer relations.",
      icon: Network,
    },
  ];

  return (
    <div className="hidden lg:flex flex-col justify-center items-start p-12 text-foreground bg-muted/20 h-full w-full">
      <div className="max-w-lg space-y-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
            Manage your business <br />
            <span className="text-primary">with ease and precision.</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            The all-in-one platform for dealerships, manufacturers, and
            product-based companies to scale their operations.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="shadow-sm">
                <CardContent className="p-4 flex flex-col gap-2">
                  <div className="p-2 w-fit rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-7" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
