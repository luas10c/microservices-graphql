import { Controller, Get } from "@nestjs/common";
import { MessagePattern, Payload, Transport } from "@nestjs/microservices";

@Controller({
  path: "user",
})
export class AppController {
  @Get()
  async findById() {
    return {
      name: "user",
    };
  }

  @MessagePattern("user.create", Transport.KAFKA)
  async create(@Payload() data: any) {
    const user = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, 1000);
    });

    console.log(user);
  }
}
