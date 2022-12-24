import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { ThrottlerGuard } from "@nestjs/throttler";
import { GraphQLError } from "graphql";

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard implements CanActivate {
  getRequestResponse(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    return { req: ctx.req, res: ctx.req.res };
  }

  async handleRequest(context: ExecutionContext, limit: number, ttl: number) {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    const key = this.generateKey(context, ctx.req.ip);
    await this.storageService.addRecord(key, ttl);
    const ttls = await this.storageService.getRecord(key);

    if (ttls.length >= limit) {
      throw new GraphQLError("Too Many Requests", {
        extensions: { http: { status: 404, code: "TOO_MANY_REQUESTS" } },
      });
    }

    return true;
  }
}
