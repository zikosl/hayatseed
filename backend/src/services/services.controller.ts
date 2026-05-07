import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { PlatformStore } from "../platform.store";

@Controller("services")
export class ServicesController {
  constructor(private readonly store: PlatformStore) {}

  @Get()
  list() {
    return this.store.services;
  }

  @Post()
  create(@Body() body: { name: string; description: string; image?: string; active?: boolean }) {
    const service = {
      id: `service-${Date.now()}`,
      name: body.name,
      description: body.description,
      image: body.image,
      active: body.active ?? true,
    };
    this.store.services.unshift(service);
    return service;
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    this.store.services = this.store.services.map((service) =>
      service.id === id ? { ...service, ...body } : service,
    );
    return this.store.services.find((service) => service.id === id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    this.store.services = this.store.services.filter((service) => service.id !== id);
    return { ok: true };
  }
}
