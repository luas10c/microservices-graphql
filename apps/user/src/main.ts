import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: "user",
        brokers: ["localhost:9092"],
      },
      consumer: {
        groupId: "user-consumer",
      },
    },
  });

  await app.startAllMicroservices();

  await app.listen(4001, "0.0.0.0");
}

bootstrap();
