import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { S3Service } from "src/common/services/s3.service";
import { ImagesRepository } from "src/modules/project/repositories/image.repository";
import { AccessControlRepository } from "../repositories/acess-control.repository";

@Injectable()
export class UserService {
  constructor(
    private readonly imagesRepo: ImagesRepository,
    private readonly s3Service: S3Service,
    private readonly accessControlRepo: AccessControlRepository
  ) {}

  async getUserWithImage(params: { user: User }) {
    const { user } = params;
    if (!user.profileImageId) return user;
    const img = await this.imagesRepo.getImageById({
      id: user.profileImageId,
    });
    if (img == null) return user;
    const s3Path = img.s3Path;
    const mimeType = img.mimeType;
    const signedURL = await this.s3Service.getPresignedURL({
      path: s3Path,
      mimeType,
    });
    return { ...user, signedURL };
  }
  async getUserWithRole(params: { user: User }) {
    const { user } = params;
    const role = await this.accessControlRepo.getRoleInfoById({
      id: user.roleId,
    });
    return { ...user, role: role.role };
  }
  async prepareUserImageRole(params: { user: User }) {
    const [usImg, usR] = await Promise.all([
      await this.getUserWithImage(params),
      await this.getUserWithRole(params),
    ]);
    usImg["role"] = usR.role;
    return usImg;
  }
}
