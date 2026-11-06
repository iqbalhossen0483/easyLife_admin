# Product Requirements Document (PRD)
## EasyLife Admin: Unified Stock, Cash & Employee Management Platform

---

## 1. Executive Summary

### 1.1 Overview
**EasyLife Admin** is a multi-tenant enterprise resource planning (ERP) platform designed for small-to-large dealerships, distributors, and manufacturing businesses. The platform unifies three core operational pillars:
1. **Stock Management**: Catalog, supplier procurement, light production, and inventory distribution.
2. **Cash Management**: Multi-tier internal cash settlements, customer due collections, expense governance, and cash flow reporting.
3. **Employee Management**: Field sales force tracking, dynamic sales/collection targets, automated commission approvals, and role-based performance analytics.

### 1.2 Core Objectives
- **Eliminate Cash Leakage**: Track every penny from order creation and customer collection to peer-to-peer balance transfer and central vault deposit.
- **Real-Time Inventory Precision**: Provide live stock visibility across warehouses, tracking purchases, production assembly, deliveries, and returns.
- **Sales Rep Accountability**: Align employee incentives with business outcomes via real-time target tracking and automated commission approval workflows.
- **Multi-Tenant Scalability**: Support independent tenants with isolated database routing via the `x-tenant-id` header.

---

## 2. Technology Stack & Foundation

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.4.5 (App Router, Turbopack) | React 19.3.0, React Server Components (RSC) |
| **Routing & Auth Gate** | `proxy.ts` | Cookie-based route redirection (`/auth/login` $\leftrightarrow$ `/dashboard`) |
| **Styling & Design System** | Tailwind CSS v4 (`@import "tailwindcss"`) | `@shadcn/tailwind.css`, `tw-animate-css` |
| **Theming** | Base-Vega style (`mist` base color) | Custom OKLCH palette with emerald primary accent (`oklch(0.527 0.154 150.069)`) |
| **State Management** | Redux Toolkit & RTK Query | Normalized API caching with automated `x-tenant-id` injection in `baseApi.ts` |
| **Form Management** | React Hook Form & Zod | Strict schema validation with accessible `Field` and `FieldError` UI |
| **Icons & Feedback** | Lucide React & Sonner | High-density enterprise UI with inline toast notifications |

---

## 3. System Roles & Access Control Matrix

The platform enforces strict role-based access control (RBAC):

| Feature / Area | `super_admin` | `admin` | `store_manager` | `sales_man` |
| :--- | :---: | :---: | :---: | :---: |
| **Tenant Settings** | Full Access | View Only | No Access | No Access |
| **User & Staff Management** | Full Access | Full Access | View Only | No Access |
| **Target & Commission Setup** | Full Access | Full Access | View Only | View Own |
| **Commission Approval / Reject**| Full Access | Full Access | No Access | No Access |
| **Products & Catalog Management**| Full Access | Full Access | Full Access | View Only |
| **Suppliers & Purchase Orders** | Full Access | Full Access | Full Access | No Access |
| **Production Records** | Full Access | Full Access | Full Access | No Access |
| **Order Booking** | Full Access | Full Access | Full Access | Create & View Own |
| **Order Delivery Confirmation** | Full Access | Full Access | Full Access | Token Auth |
| **Cash Transfer (Initiate)** | Token Auth | Token Auth | Token Auth | Token Auth |
| **Cash Transfer (Accept/Decline)**| Full Access | Full Access | Full Access | Restricted |
| **Expense Filing** | Token Auth | Token Auth | Token Auth | Token Auth |
| **Expense Approval / Reject** | Full Access | Full Access | Restricted | No Access |
| **Financial & Cash Reports** | Full Access | Full Access | Operational Only| No Access |

---

## 4. The Triad Operational Flow

```
                      ┌────────────────────────┐
                      │    Supplier / Vendor   │
                      └───────────┬────────────┘
                                  │ (Purchase PO / Payment)
                                  ▼
┌──────────────────────────────────────────────────────────────────┐
│                     1. STOCK MANAGEMENT                          │
│  [Raw Materials] ──> [Production] ──> [Inventory Warehouse]      │
│                                                │                 │
│                                                │ (Order Dispatch)│
│                                                ▼                 │
│                                      [Customer Shop / Dealer]    │
└─────────────────────────────────┬────────────────────────────────┘
                                  │
                                  │ (Order Billing / Invoicing)
                                  ▼
┌──────────────────────────────────────────────────────────────────┐
│                     2. CASH MANAGEMENT                           │
│  [Total Sales] ──> [Due Receivables] ──> [Due Collection]        │
│                                                │                 │
│                                                ▼                 │
│                         [Cash In Hand (have_money)]              │
│                                                │                 │
│   ┌────────────────────────────────────────────┴─────────────┐   │
│   │ Balance Transfer Request (/api/user/transaction/transfer)│   │
│   │ Manager / Admin Approval (/receive/{id} or /decline/{id})│   │
│   └────────────────────────────────────────────┬─────────────┘   │
│                                                ▼                 │
│                         [Central Vault & Bank Ledger]            │
│                                                │                 │
│                                                ▼                 │
│                         [Approved Business Expenses]             │
└─────────────────────────────────┬────────────────────────────────┘
                                  │
                                  │ (Performance Attribution)
                                  ▼
┌──────────────────────────────────────────────────────────────────┐
│                     3. EMPLOYEE MANAGEMENT                       │
│  [Sales & Collections] ──> [Target Progress Tracking]            │
│                                                │                 │
│                                                ▼                 │
│                            [Commission Generated]                │
│                                                │                 │
│                                                ▼                 │
│                            [Admin Review & Approval]             │
│                                                │                 │
│                                                ▼                 │
│                            [Salary & Incentive Payout]           │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Functional Module Specifications

### 5.1 Stock & Inventory Management

#### 5.1.1 Product Catalog (`/api/product/*`)
- **SKU Attributes**: Product name, short name, type/category, selling price, unit cost, serial number (`sl`), initial stock (`init_stock`), current stock.
- **Stock Indicators**: Dynamic badge levels:
  - In Stock: `> 10 units` (Normal)
  - Low Stock: `1 - 10 units` (Warning)
  - Out of Stock: `0 units` (Destructive alert)
- **Trash & Soft Deletion**: Full safety retention with soft deletion (`DELETE /api/product/delete/{id}`) and restoration (`PUT /api/product/restore/{id}`).

#### 5.1.2 Suppliers & Purchasing (`/api/supplier/*`, `/api/purchase/*`)
- **Supplier Ledger**: Track supplier name, address, phone, total supplied value, total paid, and outstanding payable balances.
- **Purchase Orders**: Multi-item purchase order generation (`PurchaseProductItemDto`), recording discount, immediate payment, payment info, and remaining balance.
- **Supplier Payments**: Direct balance settlements (`PUT /api/purchase/pay/{id}`).

#### 5.1.3 Production Assembly (`/api/production/*`)
- **Record Conversion**: Log the conversion of component parts / raw inventory into packaged finished goods.
- **Stock Depletion & Injection**: Automatically decrement raw components and increment finished product stock.

#### 5.1.4 Order Processing & Dispatch (`/api/order/*`)
- **Pipeline Workflow**: `Pending Approval` $\rightarrow$ `Approved` $\rightarrow$ `Delivered` $\rightarrow$ `Paid / Due`.
- **Delivery Confirmation**: One-click action to mark an order as physically delivered (`PUT /api/order/deliver/{id}`).
- **Stock Deduction**: Trigger inventory deduction upon approved delivery.

---

### 5.2 Cash & Financial Governance

#### 5.2.1 Real-Time Balance Transfer (`/api/user/transaction/*`)
- **Field Settlement Protocol**: Field sales agents hold cash collected from dealer shops (`user.have_money`).
- **Transfer Request**: Rep selects recipient (Store Manager or Admin), inputs amount, and adds optional notes.
- **Verification Gate**: Recipient reviews pending transfers (`GET /api/user/transaction/pending`) and can either:
  - **Accept** (`POST /api/user/transaction/receive/{id}`): Transfers amount from sender's `have_money` to recipient's `have_money`.
  - **Decline** (`DELETE /api/user/transaction/decline/{id}`): Reverts transaction and logs rejection reason.
- **Audit History**: Complete transaction log with timestamp, sender, receiver, status, and verification trail.

#### 5.2.2 Accounts Receivable & Collections (`/api/order/collect/{id}`)
- **Due Tracking**: Customer ledger tracks cumulative sales vs. collections (`user.due_sale` and `user.due_collection`).
- **Collection Entry**: Sales rep logs cash/check collected against pending customer dues.
- **My Collections View**: Filtered endpoint for reps to view their historical and daily collections (`GET /api/order/my-collections`).

#### 5.2.3 Business Expense Management (`/api/expense/*`)
- **Categories**: Dynamic category management (`/api/expense/get-all-expense-categories`).
- **Expense Submission**: Staff submits expense with title, amount, category, and receipt attachment.
- **Approval Queue**: Admins review pending claims with one-click **Approve** (`POST /approve/{id}`) or **Reject** (`PUT /reject/{id}`).

#### 5.2.4 Analytics & Cash Reports (`/api/dashboard/*`)
- **Cash Flow Summary**: Visual breakdown of total income, collections, expense outflows, and net operating cash.
- **Time-Series Charts**: Income vs. expense trends over selectable date ranges (weekly, monthly, yearly).
- **Category Pie Charts**: Expenditure breakdown by category.

---

### 5.3 Employee & Sales Force Management

#### 5.3.1 User Management (`/api/user/*`)
- **Staff Profiles**: Name, phone, address, designation (`super_admin`, `admin`, `store_manager`, `sales_man`), profile image upload (`multipart/form-data`).
- **Financial Balances per Employee**:
  - `delivered_order`: Count of successful deliveries.
  - `total_sale`: Aggregate revenue generated.
  - `due_sale`: Uncollected receivables associated with their accounts.
  - `due_collection`: Total dues recovered.
  - `have_money`: Current physical cash in hand awaiting handover.
  - `debt`: Personal liability / advance account balance.
  - `get_salary`: Total salary received.
  - `incentive`: Total commission earned.

#### 5.3.2 Sales Targets & Quota Management (`/api/user/target/*`)
- **Target Creation**: Target value (amount or units), period (start/end date), target user.
- **Status Progression**: Automated lifecycle: `pending` $\rightarrow$ `running` $\rightarrow$ `achieved` $\rightarrow$ `failed`.
- **Commission Workflow**:
  1. Once a target reaches `achieved`, the system queues a commission record (`GET /api/user/target/commission/pending`).
  2. Admin verifies performance and clicks **Approve** (`POST /commission/approve/{id}`) or **Reject** (`DELETE /commission/reject/{id}`).
  3. Approved commission is credited to employee's `incentive` balance.

#### 5.3.3 Internal Notes & Notifications (`/api/user/note/*`, `/api/notification/send`)
- **Internal Notes**: Personal sticky notes for tasks, dealer follow-ups, and customer promises.
- **Push Notifications & Broadcasts**: Admin-initiated push notifications to all users, specific roles, or individual staff members.

---

## 6. Information Architecture & Navigation

```
app/
├── auth/
│   ├── layout.tsx                 # Split screen with marketing banner
│   └── login/
│       └── page.tsx               # Phone & password authentication
│
├── dashboard/
│   ├── layout.tsx                 # Global shell: AppSidebar + Inset Header
│   ├── page.tsx                   # Executive Overview (KPIs, Cash & Stock summary)
│   │
│   ├── stock/                     # PILLAR 1: Stock Management
│   │   ├── products/              # Catalog table, Add/Edit modal, Trash sheet
│   │   ├── suppliers/             # Vendor list, payable ledgers, new supplier modal
│   │   ├── purchases/             # Purchase order list & PO creation drawer
│   │   ├── production/            # Assembly & manufacturing conversion logs
│   │   └── inventory/             # Stock health report, low stock alerts
│   │
│   ├── finance/                   # PILLAR 2: Cash Management
│   │   ├── transactions/          # Field balance transfers (Pending / History)
│   │   ├── collections/           # Customer due collections & rep logs
│   │   ├── expenses/              # Expense claim list, receipt preview, approval queue
│   │   └── cash-report/           # Consolidated cash flow statement & charts
│   │
│   ├── sales/                     # Bridge between Stock & Cash
│   │   ├── orders/                # Order list, status tabs, delivery triggers
│   │   ├── new-order/             # Fast POS-style order booking drawer
│   │   └── customers/             # Customer / shop directory & credit ledgers
│   │
│   ├── employees/                 # PILLAR 3: Employee Management
│   │   ├── directory/             # Staff directory, role management, user creation
│   │   ├── targets/               # Active targets, progress indicators
│   │   ├── commissions/           # Pending commission approval queue
│   │   └── performance/           # Sales rep leaderboards & drilldowns
│   │
│   └── settings/                  # System & Tenant
│       ├── tenant/                # Database quota, tenant profile, limits
│       └── notifications/         # System broadcasts & alerts
```

---

## 7. UI/UX Design System Specifications

### 7.1 Visual Tokens & Color Palette
- **Base Style**: `base-vega` with `mist` base tone.
- **Primary Accent**: OKLCH Forest Emerald
  - Light mode: `oklch(0.527 0.154 150.069)`
  - Dark mode: `oklch(0.448 0.119 151.328)`
- **Background & Card Surfaces**:
  - Dark background: `oklch(0.148 0.004 228.8)`
  - Dark card: `oklch(0.218 0.008 223.9)`
  - Dark border: `oklch(0.925 0.005 214.3 / 10%)`
- **Typography**:
  - Body & UI: `Inter` (`--font-sans`)
  - Headings & KPI values: `Nunito Sans` (`--font-heading`)

### 7.2 Component Design Standards

#### 1. Data Tables
- Sticky headers with horizontal scroll support for dense columns.
- Server-side pagination (`page`, `limit`) and debounced search (`search`).
- Column visibility toggles and active filter count badges.

#### 2. Slide-Over Drawers (Sheets)
- Used for high-frequency operations without navigating away from data tables:
  - *Create Order* (with real-time price & subtotal calculation)
  - *Initiate Balance Transfer*
  - *Quick Expense Claim*

#### 3. Semantic Status Pills
- **Success / Achieved / Approved / Delivered**:
  `bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`
- **Pending / Running / In-Review**:
  `bg-amber-500/10 text-amber-400 border border-amber-500/20`
- **Destructive / Failed / Declined / Rejected**:
  `bg-rose-500/10 text-rose-400 border border-rose-500/20`
- **Neutral / Informational**:
  `bg-muted text-muted-foreground border border-border`

#### 4. Quick Action Command Menu (`Cmd + K`)
- Instant keyboard search across:
  - Products & SKUs
  - Dealers & Customers
  - Staff members
  - Shortcut routes (e.g., `New Purchase`, `Transfer Cash`)

---

## 8. Implementation Roadmap

### Phase 1: Shell & Navigation Polish (Immediate)
- Update `AppSidebar.tsx` with unified navigation groups matching the PRD.
- Add header controls:
  - Tenant / Organization title badge
  - Notifications bell (`/api/dashboard/notifications`)
  - User avatar dropdown with direct "Cash In Hand" indicator and logout action.

### Phase 2: Stock & Inventory Pillar
- Build `productApi.ts` and `supplierApi.ts`.
- Build `/dashboard/stock/products` (Catalog data table, Add Product modal with photo upload, low stock badges, trash view).
- Build `/dashboard/stock/purchases` & `/dashboard/stock/suppliers`.

### Phase 3: Cash & Finance Pillar
- Build `transactionApi.ts` and `expenseApi.ts`.
- Build `/dashboard/finance/transactions` (Initiate balance transfer modal, pending transfer review card, transfer history).
- Build `/dashboard/finance/expenses` (Category selector, receipt upload, admin approval buttons).

### Phase 4: Employee & Target Pillar
- Build `userApi.ts` and `targetApi.ts`.
- Build `/dashboard/employees/directory` (Staff table with financial balances: `have_money`, `due_sale`, etc.).
- Build `/dashboard/employees/targets` & commission approval queue.

### Phase 5: Sales Bridge & Executive Dashboard
- Build `orderApi.ts` and `customerApi.ts`.
- Implement Order creation drawer and delivery status toggle.
- Build Executive Dashboard charts (`/api/dashboard/chart`, `/api/dashboard/cash-report`).
