import { Metadata } from "@grpc/grpc-js";
export declare class AppController {
    getInvoiceById(): Promise<{
        id: string;
        name: string;
        price: number;
    }>;
    getById(data: any, metadata: Metadata): Promise<{
        invoice: {
            id: string;
            name: string;
            price: number;
        };
    }>;
    create(data: any): Promise<void>;
}
