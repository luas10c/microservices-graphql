import { Metadata } from "@grpc/grpc-js";
import { Controller, Get, HttpException, Post } from "@nestjs/common";
import {
  GrpcMethod,
  MessagePattern,
  Payload,
  RpcException,
} from "@nestjs/microservices";
import { randomUUID } from "crypto";

@Controller({
  path: "invoice",
})
export class AppController {
  @Get()
  async getInvoiceById() {
    return {
      id: randomUUID(),
      name: "2000",
      price: 4000,
    };
  }

  @GrpcMethod("InvoiceService", "getById")
  async getById(data: any, metadata: Metadata) {
    const authorizatiuon = metadata.get("authorization");
    console.log("authorization", authorizatiuon);
    console.log("data", data);

    const error = true;
    if (error) {
      throw new RpcException({ code: 4, message: "Invoice not found!" });
    }

    return {
      invoice: {
        id: randomUUID(),
        name: "4000",
        price: 4000,
      },
    };
  }

  @MessagePattern("invoice.create")
  async create(@Payload() data: any) {
    const body = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, 2000);
    });
    console.log(body);
  }
}
