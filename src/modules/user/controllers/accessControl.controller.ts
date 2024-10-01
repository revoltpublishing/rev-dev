import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AccessControlRepository } from "../repositories/acessControl.repository";
import {
  createResourceActionI,
  createResourceParamsI,
  resourceActionDependI,
  resourceAttributeI,
  resourceAttributePermissionsBodyI,
} from "src/common/interfaces/roles.interface";
import { AccessGuard } from "src/common/guards/access.guard";

@Controller("access-control")
export class AccessControlController {
  constructor(private readonly accessControlRepo: AccessControlRepository) {}

  @Get("/ping")
  async ping() {
    return "pong!";
  }
  @Post("/resource")
  async createResource(@Body() body: createResourceParamsI) {
    return await this.accessControlRepo.createResource(body);
  }
  @Post("/resource/attribute")
  async createResourceAttribute(@Body() body: resourceAttributeI) {
    return await this.accessControlRepo.createResourceAttribute(body);
  }
  @Post("/resource/action")
  async createResourceAction(@Body() body: createResourceActionI) {
    return await this.accessControlRepo.createResourceAction(body);
  }
  @Post("/resource/action/depends")
  async addResourceActionDepends(@Body() body: resourceActionDependI[]) {
    return await this.accessControlRepo.createResourceActionDepends(body);
  }
  @Post("/resource/permission/list")
  @UseGuards(AccessGuard)
  async getResourcePermissionsForRole(
    @Body()
    body: resourceAttributePermissionsBodyI[],
    @Req()
    req: Request
  ) {
    const { userDetails } = req["context"];
    return this.accessControlRepo.getResourcesPermission({
      resources: body,
      roleId: userDetails.roleId,
    });
  }
}
