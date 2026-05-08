import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = process.env.FRONTEND_ORIGIN?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors(
    allowedOrigins?.length
      ? {
          origin: allowedOrigins,
          credentials: true,
        }
      : true,
  );
  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 4000, "0.0.0.0");
}

bootstrap();
