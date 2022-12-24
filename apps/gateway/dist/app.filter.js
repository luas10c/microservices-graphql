"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppFilter = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const graphql_1 = require("graphql");
let AppFilter = class AppFilter {
    catch(exception, host) {
        throw new graphql_1.GraphQLError(exception.message, {
            extensions: { code: exception.code, http: { status: 500 } },
        });
    }
};
AppFilter = __decorate([
    (0, common_1.Catch)(microservices_1.RpcException)
], AppFilter);
exports.AppFilter = AppFilter;
//# sourceMappingURL=app.filter.js.map