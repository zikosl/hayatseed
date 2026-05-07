import { Controller, Get, Query } from "@nestjs/common";
import { PlatformStore } from "../platform.store";

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly store: PlatformStore) {}

  @Get()
  list(@Query("userId") userId?: string) {
    if (!userId) return this.store.notifications;
    return this.store.notifications.filter((notification) => notification.userId === userId);
  }
}
