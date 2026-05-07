import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { PlatformStore } from "../platform.store";

@Controller("products")
export class ProductsController {
  constructor(private readonly store: PlatformStore) {}

  @Get()
  list() {
    return this.store.products;
  }

  @Post()
  create(
    @Body()
    body: {
      name: string;
      description: string;
      features?: string[];
      price: number;
      active?: boolean;
    },
  ) {
    const product = {
      id: `product-${Date.now()}`,
      name: body.name,
      description: body.description,
      features: body.features ?? [],
      price: body.price,
      active: body.active ?? true,
    };
    this.store.products.unshift(product);
    return product;
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    this.store.products = this.store.products.map((product) =>
      product.id === id ? { ...product, ...body } : product,
    );
    return this.store.products.find((product) => product.id === id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    this.store.products = this.store.products.filter(
      (product) => product.id !== id,
    );
    return { ok: true };
  }
}
