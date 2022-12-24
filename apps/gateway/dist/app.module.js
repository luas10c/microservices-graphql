"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const throttler_1 = require("@nestjs/throttler");
const microservices_1 = require("@nestjs/microservices");
const path = require("node:path");
const app_filter_1 = require("./app.filter");
const app_guard_1 = require("./app.guard");
const app_resolver_1 = require("./app.resolver");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            throttler_1.ThrottlerModule.forRoot(),
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                cors: {
                    origin: "*",
                },
                autoSchemaFile: true,
                installSubscriptionHandlers: true,
                subscriptions: {
                    "graphql-ws": true,
                    "subscriptions-transport-ws": true,
                },
            }),
            microservices_1.ClientsModule.register([
                {
                    name: "USER_SERVICE",
                    transport: microservices_1.Transport.KAFKA,
                    options: {
                        client: {
                            clientId: "user",
                            brokers: ["localhost:9092"],
                        },
                        consumer: {
                            groupId: "user-consumer",
                        },
                    },
                },
            ]),
            microservices_1.ClientsModule.register([
                {
                    name: "INVOICE_PACKAGE",
                    transport: microservices_1.Transport.GRPC,
                    options: {
                        url: "0.0.0.0:44000",
                        package: "invoice",
                        protoPath: path.join(__dirname, "invoice.proto"),
                    },
                },
            ]),
        ],
        providers: [
            app_resolver_1.AppResolver,
            {
                provide: core_1.APP_FILTER,
                useClass: app_filter_1.AppFilter,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: app_guard_1.GqlThrottlerGuard,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map