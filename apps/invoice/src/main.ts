import { NestFactory } from "@nestjs/core";
import { Transport, type MicroserviceOptions } from "@nestjs/microservices";
import * as path from "node:path";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /*   app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ["localhost:9092"],
      },
      consumer: {
        groupId: "invoice",
      },
    },
  }); */

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: "0.0.0.0:44000",
      package: "invoice",
      protoPath: path.join(__dirname, "invoice.proto"),
      loader: {
        keepCase: true,
        longs: Number,
        enums: String,
        defaults: false,
        arrays: true,
        objects: true,
        includeDirs: [path.join(__dirname)],
      },
    },
  });

  await app.startAllMicroservices();

  await app.listen(4002, "0.0.0.0");
}

bootstrap();
