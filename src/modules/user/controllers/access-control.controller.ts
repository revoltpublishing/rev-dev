import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { AcessControlService } from "../services/acess-control.service";
import {
  createResourceParamsI,
  resourceAttributeI,
} from "src/common/interfaces/roles.interface";

@Controller("access-control")
export class AccessControlController {
  constructor(private readonly accessControlService: AcessControlService) {}

  @Get("/ping")
  async ping() {
    return "pong!";
  }
  @Post("/resource")
  async createResource(@Body() params: createResourceParamsI) {
    return await this.accessControlService.createResource(params);
  }
  @Post("/resource/attribute")
  async createResourceAttribute(@Body() params: resourceAttributeI) {
    return await this.accessControlService.createResourceAttribute(params);
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
