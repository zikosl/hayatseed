import { Body, Controller, Get, Patch, Post } from "@nestjs/common";
import { PlatformStore } from "../platform.store";
import type { OrderStatus } from "../platform.types";

@Controller("orders")
export class OrdersController {
  constructor(private readonly store: PlatformStore) {}

  @Get()
  list() {
    return this.store.orders;
  }

  @Post()
  create(
    @Body()
    body: {
      customerName: string;
      customerEmail?: string;
      customerPhone: string;
      location: string;
      type: "product" | "service";
      itemId: string;
      itemLabel: string;
      message: string;
      preferredContact: string;
      userId?: string;
    },
  ) {
    const order = {
      id: `order-${Date.now()}`,
      orderNumber: `HS-2026-${String(this.store.orders.length + 1).padStart(4, "0")}`,
      accessCode: `HS-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      status: "new" as OrderStatus,
      ...body,
    };
    this.store.orders.unshift(order);
    return order;
  }

  @Post("lookup")
  lookup(@Body() body: { orderNumber: string; accessCode: string }) {
    return (
      this.store.orders.find(
        (order) =>
          order.orderNumber.toLowerCase() === body.orderNumber.toLowerCase() &&
          order.accessCode.toLowerCase() === body.accessCode.toLowerCase(),
      ) ?? null
    );
  }

  @Patch("status")
  updateStatus(@Body() body: { orderId: string; status: OrderStatus }) {
    this.store.orders = this.store.orders.map((order) =>
      order.id === body.orderId ? { ...order, status: body.status } : order,
    );
    return this.store.orders.find((order) => order.id === body.orderId);
  }
}
