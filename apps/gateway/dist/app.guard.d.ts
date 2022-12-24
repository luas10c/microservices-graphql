import { CanActivate, ExecutionContext } from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";
export declare class GqlThrottlerGuard extends ThrottlerGuard implements CanActivate {
    getRequestResponse(context: ExecutionContext): {
        req: any;
        res: any;
    };
    handleRequest(context: ExecutionContext, limit: number, ttl: number): Promise<boolean>;
}
