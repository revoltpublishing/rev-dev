import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { AccessControlRepository } from "../repositories/acess-control.repository";
import {
  createResourceParamsI,
  resourceAttributeI,
} from "src/common/interfaces/roles.interface";

@Controller("access-control")
export class AccessControlController {
  constructor(private readonly accessControlRepo: AccessControlRepository) {}

  @Get("/ping")
  async ping() {
    return "pong!";
  }
  @Post("/resource")
  async createResource(@Body() params: createResourceParamsI) {
    return await this.accessControlRepo.createResource(params);
  }
  @Post("/resource/attribute")
  async createResourceAttribute(@Body() params: resourceAttributeI) {
    return await this.accessControlRepo.createResourceAttribute(params);
  }
}

// "attribute" : [{
//         "name" : "ROLE",
//         "value" : "ADMIN",
//         "permission" : [{
//             "roleId" : 990,
//             "action" : 1
//     }]
//     },{
//     "name" : "ROLE",
//     "value" : "AUTHOR",
//     "permission" : [{
//         "roleId" : 990,
//         "action" : 1
//         },{
//         "roleId" : 991,
//         "action" : 1
//         }
//     ]
// }]
