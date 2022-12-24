import { ClientGrpc, ClientKafka } from "@nestjs/microservices";
export declare class Queue {
    topicName: string;
    partition: number;
    errorCode: number;
    baseOffset: string;
    logAppendTime: string;
    logStartOffset: string;
}
declare class Welcome {
    id: string;
    name: string;
    price: number;
}
export declare class Invoice {
    invoice: Welcome;
}
export declare class AppResolver {
    private readonly client;
    private readonly invoice;
    private invoiceService;
    constructor(client: ClientKafka, invoice: ClientGrpc);
    onModuleInit(): void;
    welcome(ctx: any): Promise<Invoice>;
    hello(): Promise<any>;
    create(): Promise<any>;
    userBanned(): string;
    createInvoice(): Promise<any>;
    welcomeWatch(): Promise<AsyncIterator<unknown, any, undefined>>;
    createUser(): Promise<AsyncIterator<unknown, any, undefined>>;
    userBannedSubscription(): Promise<AsyncIterator<unknown, any, undefined>>;
}
export {};
