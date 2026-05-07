export type UserRole = "admin" | "client";
export type OrderStatus =
  | "new"
  | "contacted"
  | "quoted"
  | "approved"
  | "in_progress"
  | "completed"
  | "cancelled";
export type OrderType = "product" | "service";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  password: string;
};

export type ProductRecord = {
  id: string;
  name: string;
  description: string;
  features?: string[];
  price: number;
  active: boolean;
};

export type ServiceRecord = {
  id: string;
  name: string;
  description: string;
  image?: string;
  active: boolean;
};

export type OrderRecord = {
  id: string;
  orderNumber: string;
  accessCode: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  location: string;
  type: OrderType;
  itemId: string;
  itemLabel: string;
  message: string;
  preferredContact: string;
  status: OrderStatus;
  userId?: string;
};

export type NotificationRecord = {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
};
