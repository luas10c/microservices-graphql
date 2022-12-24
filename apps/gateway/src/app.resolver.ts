import {
  Field,
  Mutation,
  ObjectType,
  Context,
  Query,
  Resolver,
  Subscription,
} from "@nestjs/graphql";
import { ClientGrpc, ClientKafka, RpcException } from "@nestjs/microservices";
import { Metadata } from "@grpc/grpc-js";
import { PubSub } from "graphql-subscriptions";
import { Inject } from "@nestjs/common";
import { SkipThrottle, Throttle } from "@nestjs/throttler";
import { firstValueFrom } from "rxjs";
import { Observable } from "rxjs";

import { GraphQLError } from "graphql";

@ObjectType()
export class Queue {
  @Field()
  topicName: string;

  @Field()
  partition: number;

  @Field()
  errorCode: number;

  @Field()
  baseOffset: string;

  @Field()
  logAppendTime: string;

  @Field()
  logStartOffset: string;
}

@ObjectType()
class Welcome {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  price: number;
}

@ObjectType()
export class Invoice {
  @Field()
  invoice: Welcome;
}

const pubSub = new PubSub();

type GetByIdRequest = {
  id: string;
};
interface InvoiceService {
  getById(request: GetByIdRequest, metadata: Metadata): Observable<any>;
}

@Resolver()
export class AppResolver {
  private invoiceService: InvoiceService;
  constructor(
    @Inject("USER_SERVICE") private readonly client: ClientKafka,
    @Inject("INVOICE_PACKAGE") private readonly invoice: ClientGrpc
  ) {}

  onModuleInit() {
    this.invoiceService =
      this.invoice.getService<InvoiceService>("InvoiceService");
  }

  @Query(() => Invoice, { name: "welcome" })
  async welcome(@Context() ctx: any): Promise<Invoice> {
    const { authorization } = ctx.req.headers;

    try {
      const metadata = new Metadata();
      metadata.set("authorization", authorization);
      const source = this.invoiceService.getById({ id: "1000" }, metadata);
      const data = await firstValueFrom<Invoice>(source);

      console.log(data);

      pubSub.publish("welcome", data.invoice.name);

      return data;
    } catch (error) {
      throw new RpcException({ code: error.code, message: error.message });
    }
  }

  @Query(() => Welcome, { nullable: true, name: "hello" })
  async hello() {
    const response = await fetch("http://192.168.31.124:4002/invoice");
    const data = await response.json();
    return data;
  }

  @Throttle(10, 60)
  @Mutation(() => [Queue], { name: "createUser" })
  async create() {
    const source = this.client.emit(
      "user.create",
      JSON.stringify({ id: "1", name: "John", email: "example@email.com" })
    );
    const data = await firstValueFrom(source);

    return data;
  }

  @Mutation(() => String, { name: "userBanned" })
  userBanned() {
    this.client.emit(
      "user.banned",
      JSON.stringify({ id: "1", name: "John", email: "example@email.com" })
    );

    pubSub.publish("userBanned", "Hello");

    return "Banned";
  }

  /*   @MessagePattern("user.create")
  async user(@Payload() data: any) {
    console.log("data", data);
    pubSub.publish("createUser", "Usuário criado!");
  } */

  @Mutation(() => [Queue], { name: "createInvoice" })
  async createInvoice() {
    const source = this.client.emit(
      "invoice.create",
      JSON.stringify({ id: "1000", userId: "1", name: "Computador" })
    );
    const data = await firstValueFrom(source);

    return data;
  }

  @SkipThrottle()
  @Subscription(() => String, {
    resolve(value) {
      return value;
    },
    name: "welcomeWatch",
  })
  async welcomeWatch() {
    return pubSub.asyncIterator("welcome");
  }

  @SkipThrottle()
  @Subscription(() => String, {
    resolve(value) {
      return value;
    },
  })
  async createUser() {
    return pubSub.asyncIterator("createUser");
  }

  @SkipThrottle()
  @Subscription(() => String, {
    resolve(value) {
      return value;
    },
  })
  async userBannedSubscription() {
    return pubSub.asyncIterator("userBanned");
  }
}
