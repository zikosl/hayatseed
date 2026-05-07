import { Injectable } from "@nestjs/common";
import type {
  NotificationRecord,
  OrderRecord,
  ProductRecord,
  ServiceRecord,
  UserRecord,
} from "./platform.types";

@Injectable()
export class PlatformStore {
  users: UserRecord[] = [
    {
      id: "user-admin",
      name: "Hayatseed Admin",
      email: "admin@hayatseed.dz",
      phone: "+213540990219",
      role: "admin",
      password: "admin123",
    },
    {
      id: "user-client",
      name: "Amine Benaissa",
      email: "client@hayatseed.dz",
      phone: "+213555001122",
      role: "client",
      password: "client123",
    },
  ];

  products: ProductRecord[] = [
    {
      id: "product-grass-seed",
      name: "Premium Grass Seed",
      description: "Dense turf mix adapted to the Algerian climate.",
      features: ["Dense lawn coverage", "Fast germination", "Climate-adapted"],
      price: 2900,
      active: true,
    },
    {
      id: "product-mulch",
      name: "Hydroseeding Mulch Fiber",
      description:
        "Biodegradable mulch that protects germination and soil moisture.",
      features: ["Retains humidity", "Reduces erosion", "100% biodegradable"],
      price: 3500,
      active: true,
    },
  ];

  services: ServiceRecord[] = [
    {
      id: "service-smart-irrigation",
      name: "Smart Irrigation Systems",
      description: "IoT-connected control systems with automation and alerts.",
      image: "/assets/service-smart-irrigation.svg",
      active: true,
    },
    {
      id: "service-hydroseeding",
      name: "Hydroseeding",
      description: "Rapid vegetation cover for slopes and reclamation zones.",
      image: "/assets/service-hydroseeding.svg",
      active: true,
    },
  ];

  orders: OrderRecord[] = [
    {
      id: "order-001",
      orderNumber: "HS-2026-0001",
      accessCode: "LAND-2718",
      customerName: "Amine Benaissa",
      customerEmail: "client@hayatseed.dz",
      customerPhone: "+213555001122",
      location: "Staoueli, Algiers",
      type: "service",
      itemId: "service-smart-irrigation",
      itemLabel: "Smart Irrigation Systems",
      message: "Need a quote for a three-zone smart irrigation setup.",
      preferredContact: "phone",
      status: "quoted",
      userId: "user-client",
    },
  ];

  notifications: NotificationRecord[] = [
    {
      id: "notif-001",
      userId: "user-client",
      title: "Quote ready",
      message: "Your irrigation request is quoted and waiting for approval.",
      read: false,
    },
  ];
}
