import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { GraphQLError } from "graphql";

@Catch(RpcException)
export class AppFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    throw new GraphQLError(exception.message, {
      extensions: { code: exception.code, http: { status: 500 } },
    });
  }
}
