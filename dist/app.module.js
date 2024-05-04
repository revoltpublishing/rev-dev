"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const users_module_1 = require("./modules/user/users.module");
const project_module_1 = require("./modules/project/project.module");
const config_1 = require("@nestjs/config");
const book_module_1 = require("./modules/book/book.module");
const AppEnvironmentModule = config_1.ConfigModule.forRoot({
    envFilePath: "./.env",
    isGlobal: true,
});
let AppModule = class AppModule {
    configure(consumer) {
        consumer;
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule, project_module_1.ProjectModule, book_module_1.BookModule, AppEnvironmentModule],
        controllers: [],
        providers: [],
        exports: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map