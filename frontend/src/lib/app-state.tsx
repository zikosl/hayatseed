import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { seedData, serviceImagesById } from "@/lib/seed";
import type {
  ClientDraft,
  Notification,
  Order,
  OrderActor,
  OrderChannel,
  OrderKind,
  OrderStatus,
  Product,
  Service,
  User,
} from "@/lib/types";

type OrderDraft = {
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  location: string;
  kind: OrderKind;
  itemId: string;
  message: string;
  preferredContact: "whatsapp" | "phone" | "email";
  channel: OrderChannel;
  userId?: string;
};

type AppStateContextValue = {
  users: User[];
  products: Product[];
  services: Service[];
  orders: Order[];
  notifications: Notification[];
  createOrder: (draft: OrderDraft) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addOrderNote: (
    orderId: string,
    actor: Extract<OrderActor, "admin" | "client">,
    message: string,
  ) => void;
  clientRespondToOrder: (
    orderId: string,
    action: "approve" | "request_callback" | "cancel",
  ) => void;
  deleteOrder: (orderId: string) => void;
  createProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (
    productId: string,
    updates: Partial<Omit<Product, "id">>,
  ) => void;
  deleteProduct: (productId: string) => void;
  createService: (service: Omit<Service, "id">) => void;
  updateService: (
    serviceId: string,
    updates: Partial<Omit<Service, "id">>,
  ) => void;
  deleteService: (serviceId: string) => void;
  createNotification: (
    draft: Pick<Notification, "userId" | "title" | "body">,
  ) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: (userId: string) => void;
  createClient: (draft: ClientDraft) => void;
  updateClient: (
    userId: string,
    updates: Partial<Pick<User, "name" | "email" | "phone">>,
  ) => void;
  deleteClient: (userId: string) => void;
};

const STORAGE_KEY = "hs_platform_store_v1";

const AppStateContext = createContext<AppStateContextValue | null>(null);

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function createOrderNumber(count: number) {
  return `HS-2026-${String(count + 1).padStart(4, "0")}`;
}

function createAccessCode() {
  return `${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function createNotificationItem(
  draft: Pick<Notification, "userId" | "title" | "body">,
): Notification {
  return {
    id: createId("notif"),
    userId: draft.userId,
    title: draft.title,
    body: draft.body,
    read: false,
    createdAt: new Date().toISOString(),
  };
}

function createTimelineEvent({
  actor,
  type,
  message,
  status,
}: {
  actor: OrderActor;
  type: "status" | "note" | "created";
  message: string;
  status?: OrderStatus;
}) {
  return {
    id: createId("event"),
    actor,
    type,
    message,
    status,
    createdAt: new Date().toISOString(),
  };
}

function normalizeOrder(order: Order): Order {
  if (Array.isArray(order.timeline)) return order;
  return {
    ...order,
    timeline: [
      {
        id: createId("event"),
        actor: "system",
        type: "created",
        message: `Order submitted for ${order.itemLabel}.`,
        status: order.status,
        createdAt: order.createdAt,
      },
    ],
  };
}

function defaultProductFeatures(product: Product) {
  const normalized = product.name.toLowerCase();
  if (normalized.includes("grass")) {
    return ["Dense lawn coverage", "Fast germination", "Climate-adapted"];
  }
  if (normalized.includes("mulch")) {
    return ["Retains humidity", "Reduces erosion", "100% biodegradable"];
  }
  if (normalized.includes("biofert") || normalized.includes("fertilizer")) {
    return ["Improves fertility", "Supports roots", "Natural soil biology"];
  }
  return ["Field-ready", "Admin managed", "Available for order"];
}

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    features: product.features?.length
      ? product.features
      : defaultProductFeatures(product),
  };
}

function defaultServiceImage(service: Service) {
  if (serviceImagesById[service.id]) return serviceImagesById[service.id];
  const normalized = service.name.toLowerCase();
  if (normalized.includes("hydroseeding"))
    return serviceImagesById["service-hydroseeding"];
  if (normalized.includes("smart"))
    return serviceImagesById["service-smart-irrigation"];
  if (normalized.includes("offline"))
    return serviceImagesById["service-offline-irrigation"];
  if (normalized.includes("landscaping") || normalized.includes("green")) {
    return serviceImagesById["service-landscaping"];
  }
  if (normalized.includes("soil") || normalized.includes("stabilization")) {
    return serviceImagesById["service-soil-stabilization"];
  }
  return serviceImagesById["service-irrigation-install"];
}

function normalizeService(service: Service): Service {
  return {
    ...service,
    image: service.image || defaultServiceImage(service),
  };
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState(seedData.users);
  const [products, setProducts] = useState(seedData.products);
  const [services, setServices] = useState(seedData.services);
  const [orders, setOrders] = useState(seedData.orders);
  const [notifications, setNotifications] = useState(seedData.notifications);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const data = JSON.parse(raw) as {
        users: User[];
        products: Product[];
        services: Service[];
        orders: Order[];
        notifications: Notification[];
      };
      setUsers(data.users);
      setProducts(data.products.map(normalizeProduct));
      setServices(data.services.map(normalizeService));
      setOrders(data.orders.map(normalizeOrder));
      setNotifications(data.notifications);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ users, products, services, orders, notifications }),
    );
  }, [notifications, orders, products, services, users]);

  const value = useMemo<AppStateContextValue>(
    () => ({
      users,
      products,
      services,
      orders,
      notifications,
      createOrder: (draft) => {
        const catalog =
          draft.kind === "product"
            ? products.find((item) => item.id === draft.itemId)?.name
            : services.find((item) => item.id === draft.itemId)?.name;
        const order: Order = {
          id: createId("order"),
          orderNumber: createOrderNumber(orders.length),
          accessCode: createAccessCode(),
          customerName: draft.customerName,
          customerEmail: draft.customerEmail,
          customerPhone: draft.customerPhone,
          location: draft.location,
          kind: draft.kind,
          itemId: draft.itemId,
          itemLabel: catalog ?? draft.itemId,
          message: draft.message,
          preferredContact: draft.preferredContact,
          channel: draft.channel,
          status: "new",
          createdAt: new Date().toISOString(),
          userId: draft.userId,
          timeline: [
            createTimelineEvent({
              actor: "system",
              type: "created",
              message: `Order submitted for ${catalog ?? draft.itemId}.`,
              status: "new",
            }),
          ],
        };
        setOrders((current) => [order, ...current]);
        if (draft.userId) {
          setNotifications((current) => [
            createNotificationItem({
              userId: draft.userId,
              title: "Order submitted",
              body: `Order ${order.orderNumber} is now in the admin queue.`,
            }),
            ...current,
          ]);
        }
        return order;
      },
      updateOrderStatus: (orderId, status) => {
        const order = orders.find((entry) => entry.id === orderId);
        setOrders((current) =>
          current.map((entry) =>
            entry.id === orderId
              ? {
                  ...entry,
                  status,
                  timeline: [
                    createTimelineEvent({
                      actor: "admin",
                      type: "status",
                      message: `Order moved to ${status.replace("_", " ")}.`,
                      status,
                    }),
                    ...(entry.timeline ?? []),
                  ],
                }
              : entry,
          ),
        );
        if (order?.userId) {
          const label = status.replace("_", " ");
          setNotifications((current) => [
            createNotificationItem({
              userId: order.userId,
              title: `Order ${label}`,
              body: `${order.orderNumber} is now marked as ${label}.`,
            }),
            ...current,
          ]);
        }
      },
      addOrderNote: (orderId, actor, message) => {
        const order = orders.find((entry) => entry.id === orderId);
        if (!message.trim()) return;
        setOrders((current) =>
          current.map((entry) =>
            entry.id === orderId
              ? {
                  ...entry,
                  timeline: [
                    createTimelineEvent({
                      actor,
                      type: "note",
                      message: message.trim(),
                    }),
                    ...(entry.timeline ?? []),
                  ],
                }
              : entry,
          ),
        );
        if (order?.userId && actor === "admin") {
          setNotifications((current) => [
            createNotificationItem({
              userId: order.userId,
              title: "Admin note added",
              body: `${order.orderNumber} has a new admin update.`,
            }),
            ...current,
          ]);
        }
      },
      clientRespondToOrder: (orderId, action) => {
        const actionMap = {
          approve: {
            status: "approved" as OrderStatus,
            message: "Client approved the current order proposal.",
            title: "Order approved",
          },
          request_callback: {
            status: "contacted" as OrderStatus,
            message: "Client requested a callback from the Hayatseed team.",
            title: "Callback requested",
          },
          cancel: {
            status: "cancelled" as OrderStatus,
            message: "Client cancelled this order request.",
            title: "Order cancelled",
          },
        };
        const next = actionMap[action];
        const order = orders.find((entry) => entry.id === orderId);
        setOrders((current) =>
          current.map((entry) =>
            entry.id === orderId
              ? {
                  ...entry,
                  status: next.status,
                  timeline: [
                    createTimelineEvent({
                      actor: "client",
                      type: "status",
                      message: next.message,
                      status: next.status,
                    }),
                    ...(entry.timeline ?? []),
                  ],
                }
              : entry,
          ),
        );
        if (order?.userId) {
          setNotifications((current) => [
            createNotificationItem({
              userId: order.userId,
              title: next.title,
              body: `${order.orderNumber} was updated from your client panel.`,
            }),
            ...current,
          ]);
        }
      },
      deleteOrder: (orderId) => {
        setOrders((current) => current.filter((order) => order.id !== orderId));
      },
      createProduct: (product) => {
        setProducts((current) => [
          { ...product, id: createId("product") },
          ...current,
        ]);
      },
      updateProduct: (productId, updates) => {
        setProducts((current) =>
          current.map((product) =>
            product.id === productId ? { ...product, ...updates } : product,
          ),
        );
      },
      deleteProduct: (productId) => {
        setProducts((current) =>
          current.filter((product) => product.id !== productId),
        );
      },
      createService: (service) => {
        setServices((current) => [
          { ...service, id: createId("service") },
          ...current,
        ]);
      },
      updateService: (serviceId, updates) => {
        setServices((current) =>
          current.map((service) =>
            service.id === serviceId ? { ...service, ...updates } : service,
          ),
        );
      },
      deleteService: (serviceId) => {
        setServices((current) =>
          current.filter((service) => service.id !== serviceId),
        );
      },
      createNotification: (draft) => {
        setNotifications((current) => [
          createNotificationItem(draft),
          ...current,
        ]);
      },
      markNotificationRead: (notificationId) => {
        setNotifications((current) =>
          current.map((notification) =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification,
          ),
        );
      },
      markAllNotificationsRead: (userId) => {
        setNotifications((current) =>
          current.map((notification) =>
            notification.userId === userId
              ? { ...notification, read: true }
              : notification,
          ),
        );
      },
      createClient: (draft) => {
        setUsers((current) => [
          {
            id: createId("user"),
            name: draft.name,
            email: draft.email.trim().toLowerCase(),
            phone: draft.phone,
            password: draft.password,
            role: "client",
          },
          ...current,
        ]);
      },
      updateClient: (userId, updates) => {
        setUsers((current) =>
          current.map((user) =>
            user.id === userId ? { ...user, ...updates } : user,
          ),
        );
      },
      deleteClient: (userId) => {
        setUsers((current) => current.filter((user) => user.id !== userId));
        setNotifications((current) =>
          current.filter((notification) => notification.userId !== userId),
        );
        setOrders((current) =>
          current.map((order) =>
            order.userId === userId ? { ...order, userId: undefined } : order,
          ),
        );
      },
    }),
    [notifications, orders, products, services, users],
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error("AppStateProvider missing");
  return context;
}
