import { Controller, Get } from "@nestjs/common";
import { PlatformStore } from "../platform.store";

@Controller("clients")
export class UsersController {
  constructor(private readonly store: PlatformStore) {}

  @Get()
  list() {
    return this.store.users
      .filter((user) => user.role === "client")
      .map(({ password, ...safeUser }) => safeUser);
  }
}
