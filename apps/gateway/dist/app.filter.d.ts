import { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
export declare class AppFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): void;
}
