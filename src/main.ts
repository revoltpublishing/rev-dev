import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { GlobalInterceptor } from "./common/interceptors/global.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.enableCors();
  app.useGlobalInterceptors(new GlobalInterceptor());
  await app.listen(process.env.API_PORT);
}
bootstrap();
