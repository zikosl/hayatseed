export type UserRole = "visitor" | "client" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Exclude<UserRole, "visitor">;
  password: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  features?: string[];
  price: number;
  image?: string;
  active: boolean;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  image?: string;
  active: boolean;
};

export type OrderStatus =
  | "new"
  | "contacted"
  | "quoted"
  | "approved"
  | "in_progress"
  | "completed"
  | "cancelled";

export type OrderKind = "product" | "service";
export type OrderChannel = "platform" | "whatsapp";
export type OrderActor = "system" | "admin" | "client";

export type OrderEvent = {
  id: string;
  actor: OrderActor;
  type: "status" | "note" | "created";
  message: string;
  createdAt: string;
  status?: OrderStatus;
};

export type Order = {
  id: string;
  orderNumber: string;
  accessCode: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  location: string;
  kind: OrderKind;
  itemId: string;
  itemLabel: string;
  message: string;
  preferredContact: "whatsapp" | "phone" | "email";
  channel: OrderChannel;
  status: OrderStatus;
  createdAt: string;
  userId?: string;
  timeline: OrderEvent[];
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

export type SeedData = {
  users: User[];
  products: Product[];
  services: Service[];
  orders: Order[];
  notifications: Notification[];
};

export type ClientDraft = {
  name: string;
  email: string;
  phone?: string;
  password: string;
};
