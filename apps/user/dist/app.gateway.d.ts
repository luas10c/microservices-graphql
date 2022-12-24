import { Server } from "socket.io";
export declare class AppGateway {
    server: Server;
    identity(data: number): Promise<number>;
    welcome(): void;
}
