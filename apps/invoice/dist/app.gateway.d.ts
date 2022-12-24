import { Socket, Server } from "socket.io";
export declare class AppGateway {
    server: Server;
    handleEvent(client: Socket, data: string): string;
    hello(): void;
}
