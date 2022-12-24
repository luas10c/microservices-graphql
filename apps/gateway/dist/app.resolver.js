"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppResolver = exports.Invoice = exports.Queue = void 0;
const graphql_1 = require("@nestjs/graphql");
const microservices_1 = require("@nestjs/microservices");
const grpc_js_1 = require("@grpc/grpc-js");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const rxjs_1 = require("rxjs");
let Queue = class Queue {
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Queue.prototype, "topicName", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], Queue.prototype, "partition", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], Queue.prototype, "errorCode", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Queue.prototype, "baseOffset", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Queue.prototype, "logAppendTime", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Queue.prototype, "logStartOffset", void 0);
Queue = __decorate([
    (0, graphql_1.ObjectType)()
], Queue);
exports.Queue = Queue;
let Welcome = class Welcome {
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Welcome.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Welcome.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], Welcome.prototype, "price", void 0);
Welcome = __decorate([
    (0, graphql_1.ObjectType)()
], Welcome);
let Invoice = class Invoice {
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Welcome)
], Invoice.prototype, "invoice", void 0);
Invoice = __decorate([
    (0, graphql_1.ObjectType)()
], Invoice);
exports.Invoice = Invoice;
const pubSub = new graphql_subscriptions_1.PubSub();
let AppResolver = class AppResolver {
    constructor(client, invoice) {
        this.client = client;
        this.invoice = invoice;
    }
    onModuleInit() {
        this.invoiceService =
            this.invoice.getService("InvoiceService");
    }
    async welcome(ctx) {
        const { authorization } = ctx.req.headers;
        try {
            const metadata = new grpc_js_1.Metadata();
            metadata.set("authorization", authorization);
            const source = this.invoiceService.getById({ id: "1000" }, metadata);
            const data = await (0, rxjs_1.firstValueFrom)(source);
            console.log(data);
            pubSub.publish("welcome", data.invoice.name);
            return data;
        }
        catch (error) {
            throw new microservices_1.RpcException({ code: error.code, message: error.message });
        }
    }
    async hello() {
        const response = await fetch("http://192.168.31.124:4002/invoice");
        const data = await response.json();
        return data;
    }
    async create() {
        const source = this.client.emit("user.create", JSON.stringify({ id: "1", name: "John", email: "example@email.com" }));
        const data = await (0, rxjs_1.firstValueFrom)(source);
        return data;
    }
    userBanned() {
        this.client.emit("user.banned", JSON.stringify({ id: "1", name: "John", email: "example@email.com" }));
        pubSub.publish("userBanned", "Hello");
        return "Banned";
    }
    async createInvoice() {
        const source = this.client.emit("invoice.create", JSON.stringify({ id: "1000", userId: "1", name: "Computador" }));
        const data = await (0, rxjs_1.firstValueFrom)(source);
        return data;
    }
    async welcomeWatch() {
        return pubSub.asyncIterator("welcome");
    }
    async createUser() {
        return pubSub.asyncIterator("createUser");
    }
    async userBannedSubscription() {
        return pubSub.asyncIterator("userBanned");
    }
};
__decorate([
    (0, graphql_1.Query)(() => Invoice, { name: "welcome" }),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppResolver.prototype, "welcome", null);
__decorate([
    (0, graphql_1.Query)(() => Welcome, { nullable: true, name: "hello" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppResolver.prototype, "hello", null);
__decorate([
    (0, throttler_1.Throttle)(10, 60),
    (0, graphql_1.Mutation)(() => [Queue], { name: "createUser" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppResolver.prototype, "create", null);
__decorate([
    (0, graphql_1.Mutation)(() => String, { name: "userBanned" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppResolver.prototype, "userBanned", null);
__decorate([
    (0, graphql_1.Mutation)(() => [Queue], { name: "createInvoice" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppResolver.prototype, "createInvoice", null);
__decorate([
    (0, throttler_1.SkipThrottle)(),
    (0, graphql_1.Subscription)(() => String, {
        resolve(value) {
            return value;
        },
        name: "welcomeWatch",
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppResolver.prototype, "welcomeWatch", null);
__decorate([
    (0, throttler_1.SkipThrottle)(),
    (0, graphql_1.Subscription)(() => String, {
        resolve(value) {
            return value;
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppResolver.prototype, "createUser", null);
__decorate([
    (0, throttler_1.SkipThrottle)(),
    (0, graphql_1.Subscription)(() => String, {
        resolve(value) {
            return value;
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppResolver.prototype, "userBannedSubscription", null);
AppResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __param(0, (0, common_1.Inject)("USER_SERVICE")),
    __param(1, (0, common_1.Inject)("INVOICE_PACKAGE")),
    __metadata("design:paramtypes", [microservices_1.ClientKafka, Object])
], AppResolver);
exports.AppResolver = AppResolver;
//# sourceMappingURL=app.resolver.js.map