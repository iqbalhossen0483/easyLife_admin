<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN: Engineering Guidelines & Working Role Specification -->

## 1. Core Working Principles

This document defines the strict development standards, architectural boundaries, and component structure rules for the **EasyLife Admin** platform.

### 1.1 Pre-Execution Inspection (Zero Assumptions)

- **Always read before editing**: Never assume code structure, exports, props, or imports from memory. Always inspect the relevant files before modifying or adding code.
- **Respect current patterns**: Adhere to established project patterns (such as Base UI primitives, Next.js App Router rules, and RTK Query conventions).

### 1.2 Component Directory Placement (No Co-location)

- **All components live under the root `components/` folder**:
  - Never create `_components/` directories inside the `app/` folder.
  - The `app/` directory is strictly reserved for routing files (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`).
- **Feature-based component organization**:
  - Components are grouped by domain inside `components/<domain>/`.

```
components/
├── ui/                   # Pure shadcn / Base UI primitives (button, dialog, table, etc.)
├── shared/               # Global shell & layout components (AppSidebar, DashboardHeader)
│   ├── AppSidebar.tsx
│   ├── AppSidebarHeader.tsx
│   ├── AppSidebarContent.tsx
│   ├── AppSidebarFooter.tsx
│   └── DashboardHeader.tsx
├── auth/                 # Authentication components (LoginForm, LoginBanner)
├── stock/                # Stock & Inventory components (ProductTable, ProductMetrics, ProductCreateDialog)
├── finance/              # Cash & Finance components (TransferDialog, TransactionTable, ExpenseApprovalList)
├── sales/                # Orders & Customers components (OrderPipeline, CustomerLedger)
└── employees/            # Staff & Targets components (StaffDirectoryTable, TargetProgressCard)

app/                      # Routing only — imports components from @/components/<domain>/
├── dashboard/
│   ├── layout.tsx
│   ├── page.tsx
│   └── stock/
│       └── products/
│           └── page.tsx  # Pure page orchestrator, imports from @/components/stock/*
```

---

## 2. Component Design & Modularity

### 2.1 Single Responsibility Principle (SRP)

- Every file must have **one single responsibility**:
  - **Page files (`page.tsx`)**: Act strictly as data orchestrators. They execute RTK Query hooks, handle search params, and render domain components.
  - **Presentational components**: Receive typed props and render specific UI blocks.
  - **Dialogs & Drawers**: Self-contained modals with their own form validation and mutation calls.
  - **Config files (`config/*.ts`)**: Pure static configurations and schemas (e.g. `nav.ts`). No runtime JSX.

### 2.2 Hard Limit: Strictly Under 500 Lines Per File

- **No single component file may exceed 500 lines**.
- As soon as a component nears ~250–300 lines, proactively split it into modular subcomponents inside `components/<domain>/`.
- Example breakdown for a feature:
  - `ProductMetrics.tsx` (~80 lines)
  - `ProductTable.tsx` (~200 lines)
  - `ProductCreateDialog.tsx` (~180 lines)
  - `ProductTrashTable.tsx` (~120 lines)

---

## 3. UI Theming & Base UI Standards

### 3.1 Base UI Component Guidelines

- **Group Context**: In `@base-ui/react`, all menu items (`DropdownMenuItem`) and menu labels (`DropdownMenuLabel`) must be wrapped inside a `<DropdownMenuGroup>` to ensure `MenuGroupContext` is always available:
  ```tsx
  <DropdownMenuGroup>
    <DropdownMenuLabel>Account</DropdownMenuLabel>
    <DropdownMenuItem>Settings</DropdownMenuItem>
  </DropdownMenuGroup>
  ```
- **Custom Triggers**: Use the `render` prop on triggers (e.g., `<DropdownMenuTrigger render={<SidebarMenuButton />} />`) rather than Radix's `asChild`.

### 3.2 Design System & Color Tokens

- **Theme**: Base-Vega style with `mist` base tone and custom OKLCH forest emerald primary accent.
- **Strictly Semantic Classes**: Use semantic Tailwind classes:
  - Backgrounds: `bg-background`, `bg-card`, `bg-muted/40`
  - Foregrounds: `text-foreground`, `text-muted-foreground`
  - Accents: `bg-primary`, `text-primary`, `text-primary-foreground`
  - Borders: `border-border`, `border-primary/20`
- **Never use hardcoded arbitrary colors** (e.g., avoid `bg-[#10b981]`).
- **Standardized Status Badges**:
  - **Success / Completed / Active**: `bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`
  - **Pending / Running / In-Review**: `bg-amber-500/10 text-amber-400 border border-amber-500/20`
  - **Danger / Failed / Rejected**: `bg-rose-500/10 text-rose-400 border border-rose-500/20`

---

## 4. State Management & API Standards

### 4.1 RTK Query Architecture

- All API slices are maintained in `store/feature/<name>Api.ts` and inject endpoints into `baseApi`.
- Always declare and handle cache tags (`providesTags` and `invalidatesTags`) for automatic UI synchronization:
  - Supported tags: `"User"`, `"Product"`, `"Supplier"`, `"Purchase"`, `"Order"`, `"Customer"`, `"Expense"`, `"Transaction"`, `"Target"`, `"Dashboard"`.
- Requests automatically forward the `x-tenant-id` header via `baseApi.ts`.

### 4.2 Form Handling & Validation

- Use **React Hook Form** paired with **Zod** schemas defined in `schema/<name>Schema.ts`.
- Use the project's shadcn accessible form primitives (`FieldGroup`, `Field`, `FieldLabel`, `Input`, `FieldError`).

---

## 5. TypeScript & Code Readability Rules

1. **Strict Type Safety**: Never use `any`. Define explicit TypeScript interfaces for all component props, API responses, and form values inside `types/<domain>.ts`.
2. **Early Returns**: Keep component bodies flat. Use early returns for loading, error, or unauthorized states instead of deeply nested ternaries.
3. **Readable Formats**: Format currency consistently using `formatCurrency(amount)` from `@/lib/utils` (BDT `৳` symbol).
4. **Clean Exports**: Default export for main components; named exports for utility functions and types.

<!-- END: Engineering Guidelines & Working Role Specification -->
