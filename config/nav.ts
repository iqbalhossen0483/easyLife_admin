import {
  ArrowLeftRight,
  Banknote,
  Factory,
  LayoutDashboard,
  LucideIcon,
  Package,
  Receipt,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Store,
  Target,
  Truck,
  Users,
} from "lucide-react";

export type UserRole = "super_admin" | "admin" | "store_manager" | "sales_man";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles?: UserRole[];
  badge?: string;
}

export interface NavGroup {
  group: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    group: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        roles: ["super_admin", "admin", "store_manager", "sales_man"],
      },
    ],
  },
  {
    group: "Stock & Inventory",
    items: [
      {
        title: "Products & Stock",
        href: "/dashboard/stock/products",
        icon: Package,
        roles: ["super_admin", "admin", "store_manager", "sales_man"],
      },
      {
        title: "Suppliers",
        href: "/dashboard/stock/suppliers",
        icon: Truck,
        roles: ["super_admin", "admin", "store_manager"],
      },
      {
        title: "Purchases",
        href: "/dashboard/stock/purchases",
        icon: ShoppingCart,
        roles: ["super_admin", "admin", "store_manager"],
      },
      {
        title: "Production",
        href: "/dashboard/stock/production",
        icon: Factory,
        roles: ["super_admin", "admin", "store_manager"],
      },
    ],
  },
  {
    group: "Cash & Finance",
    items: [
      {
        title: "Balance Transfers",
        href: "/dashboard/finance/transactions",
        icon: ArrowLeftRight,
        roles: ["super_admin", "admin", "store_manager", "sales_man"],
      },
      {
        title: "Due Collections",
        href: "/dashboard/finance/collections",
        icon: Banknote,
        roles: ["super_admin", "admin", "store_manager", "sales_man"],
      },
      {
        title: "Expenses",
        href: "/dashboard/finance/expenses",
        icon: Receipt,
        roles: ["super_admin", "admin", "store_manager", "sales_man"],
      },
    ],
  },
  {
    group: "Sales & Orders",
    items: [
      {
        title: "Orders & Delivery",
        href: "/dashboard/sales/orders",
        icon: ShoppingBag,
        roles: ["super_admin", "admin", "store_manager", "sales_man"],
      },
      {
        title: "Dealers & Customers",
        href: "/dashboard/sales/customers",
        icon: Store,
        roles: ["super_admin", "admin", "store_manager", "sales_man"],
      },
    ],
  },
  {
    group: "Employees & Team",
    items: [
      {
        title: "Staff Directory",
        href: "/dashboard/employees/directory",
        icon: Users,
        roles: ["super_admin", "admin", "store_manager"],
      },
      {
        title: "Targets & Incentives",
        href: "/dashboard/employees/targets",
        icon: Target,
        roles: ["super_admin", "admin", "store_manager", "sales_man"],
      },
    ],
  },
  {
    group: "System",
    items: [
      {
        title: "Tenant Settings",
        href: "/dashboard/settings/tenant",
        icon: Settings,
        roles: ["super_admin", "admin"],
      },
    ],
  },
];
