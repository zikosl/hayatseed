import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { PlatformStore } from "../platform.store";

@Controller("auth")
export class AuthController {
  constructor(private readonly store: PlatformStore) {}

  @Post("login")
  login(@Body() body: { email: string; password: string }) {
    const user = this.store.users.find((entry) => entry.email === body.email);
    if (!user || user.password !== body.password) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const { password, ...safeUser } = user;
    return { user: safeUser };
  }
}
