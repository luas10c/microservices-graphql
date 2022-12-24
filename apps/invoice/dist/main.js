"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const path = require("node:path");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.connectMicroservice({
        transport: microservices_1.Transport.GRPC,
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
//# sourceMappingURL=main.js.map