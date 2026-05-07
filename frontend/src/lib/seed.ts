import biofert from "@/assets/product-biofertilizer.png";
import grass from "@/assets/product-grass-seed.png";
import mulch from "@/assets/product-mulch.png";
import hydroseeding from "@/assets/service-hydroseeding.svg";
import irrigationInstall from "@/assets/service-irrigation-install.svg";
import landscaping from "@/assets/service-landscaping.svg";
import offlineIrrigation from "@/assets/service-offline-irrigation.svg";
import smartIrrigation from "@/assets/service-smart-irrigation.svg";
import soilStabilization from "@/assets/service-soil-stabilization.svg";
import type { SeedData } from "@/lib/types";

export const serviceImagesById: Record<string, string> = {
  "service-hydroseeding": hydroseeding,
  "service-irrigation-install": irrigationInstall,
  "service-smart-irrigation": smartIrrigation,
  "service-offline-irrigation": offlineIrrigation,
  "service-landscaping": landscaping,
  "service-soil-stabilization": soilStabilization,
};

export const seedData: SeedData = {
  users: [
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
  ],
  products: [
    {
      id: "product-grass-seed",
      name: "Premium Grass Seed",
      description: "Dense turf mix adapted to the Algerian climate.",
      features: ["Dense lawn coverage", "Fast germination", "Climate-adapted"],
      price: 2900,
      image: grass,
      active: true,
    },
    {
      id: "product-mulch",
      name: "Hydroseeding Mulch Fiber",
      description:
        "Biodegradable mulch that protects germination and soil moisture.",
      features: ["Retains humidity", "Reduces erosion", "100% biodegradable"],
      price: 3500,
      image: mulch,
      active: true,
    },
    {
      id: "product-biofert",
      name: "Hayatgrow Biofertilizer",
      description:
        "Beneficial bacterial strains for stronger, healthier soils.",
      features: [
        "Improves fertility",
        "Supports roots",
        "Natural soil biology",
      ],
      price: 1800,
      image: biofert,
      active: true,
    },
  ],
  services: [
    {
      id: "service-hydroseeding",
      name: "Hydroseeding",
      description:
        "Rapid vegetation cover for slopes, parks, and reclamation zones.",
      image: hydroseeding,
      active: true,
    },
    {
      id: "service-irrigation-install",
      name: "Irrigation Installation",
      description: "Custom drip and sprinkler systems with on-site setup.",
      image: irrigationInstall,
      active: true,
    },
    {
      id: "service-smart-irrigation",
      name: "Smart Irrigation Systems",
      description: "IoT-connected control systems with automation and alerts.",
      image: smartIrrigation,
      active: true,
    },
    {
      id: "service-offline-irrigation",
      name: "Offline Irrigation Systems",
      description:
        "Reliable mechanical irrigation for remote land without connectivity.",
      image: offlineIrrigation,
      active: true,
    },
    {
      id: "service-landscaping",
      name: "Landscaping & Green Spaces",
      description:
        "Garden, park, and green-space design for residential and corporate sites.",
      image: landscaping,
      active: true,
    },
    {
      id: "service-soil-stabilization",
      name: "Soil Stabilization",
      description: "Bio-engineered anti-erosion and soil restoration work.",
      image: soilStabilization,
      active: true,
    },
  ],
  orders: [
    {
      id: "order-001",
      orderNumber: "HS-2026-0001",
      accessCode: "LAND-2718",
      customerName: "Amine Benaissa",
      customerEmail: "client@hayatseed.dz",
      customerPhone: "+213555001122",
      location: "Staoueli, Algiers",
      kind: "service",
      itemId: "service-smart-irrigation",
      itemLabel: "Smart Irrigation Systems",
      message:
        "Need a quote for a three-zone smart irrigation setup for a villa garden.",
      preferredContact: "phone",
      channel: "platform",
      status: "quoted",
      createdAt: "2026-05-01T09:30:00.000Z",
      userId: "user-client",
      timeline: [
        {
          id: "event-001c",
          actor: "admin",
          type: "status",
          message: "Order moved to quoted.",
          status: "quoted",
          createdAt: "2026-05-02T08:10:00.000Z",
        },
        {
          id: "event-001b",
          actor: "admin",
          type: "note",
          message:
            "Initial device scope reviewed. Three-zone setup looks feasible.",
          createdAt: "2026-05-01T16:20:00.000Z",
        },
        {
          id: "event-001a",
          actor: "system",
          type: "created",
          message: "Order submitted for Smart Irrigation Systems.",
          status: "new",
          createdAt: "2026-05-01T09:30:00.000Z",
        },
      ],
    },
    {
      id: "order-002",
      orderNumber: "HS-2026-0002",
      accessCode: "SEED-9321",
      customerName: "Sara Haddad",
      customerEmail: "sara@example.com",
      customerPhone: "+213661220011",
      location: "Blida",
      kind: "product",
      itemId: "product-grass-seed",
      itemLabel: "Premium Grass Seed",
      message: "Looking for 10 bags for a landscaping project.",
      preferredContact: "whatsapp",
      channel: "platform",
      status: "new",
      createdAt: "2026-05-03T15:20:00.000Z",
      timeline: [
        {
          id: "event-002a",
          actor: "system",
          type: "created",
          message: "Order submitted for Premium Grass Seed.",
          status: "new",
          createdAt: "2026-05-03T15:20:00.000Z",
        },
      ],
    },
  ],
  notifications: [
    {
      id: "notif-001",
      userId: "user-client",
      title: "Quote ready",
      body: "Your smart irrigation request is now quoted and ready for review.",
      read: false,
      createdAt: "2026-05-02T08:15:00.000Z",
    },
    {
      id: "notif-002",
      userId: "user-client",
      title: "Simulation mode active",
      body: "Smart Control is running in simulation mode until a field device is installed.",
      read: true,
      createdAt: "2026-05-01T11:00:00.000Z",
    },
  ],
};
