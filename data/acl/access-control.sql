INSERT INTO "public"."RoleMaster" ("id", "role", "createdAt") VALUES ('990', 'SUPER_ADMIN', '2024-08-15 18:18:45.387'), ('991', 'ADMIN', '2024-08-15 18:18:45.387'), ('992', 'PROJECT_MANAGER', '2024-08-15 18:18:45.387'), ('993', 'AUTHOR', '2024-08-15 18:18:45.387'), ('994', 'DESIGNER', '2024-08-15 18:18:45.387'), ('995', 'TYPE_SETTER', '2024-08-15 18:18:45.387'), ('996', 'VIEWER', '2024-08-15 18:18:45.387'), ('997', 'EDITOR', '2024-08-17 16:06:41');
INSERT INTO "public"."Resource" ("id", "name", "createdAt", "updatedAt") VALUES ('1', 'user', '2024-08-25 11:45:43.695', '2024-08-25 11:45:43.695'), ('3', 'book', '2024-08-27 11:37:38.997', '2024-08-27 11:37:38.997'), ('5', 'bookUserMap', '2024-08-29 13:58:15.662', '2024-08-29 13:58:15.662'), ('6', 'bookStage', '2024-09-01 09:20:35.502', '2024-09-01 09:20:35.502'), ('8', 'bookStageManuscript', '2024-09-03 09:15:04.537', '2024-09-03 09:15:04.537');
INSERT INTO "public"."ResourceAction" ("id", "resourceId", "action", "createdAt", "updatedAt") VALUES ('1', '1', '0', '2024-08-25 11:45:43.695', '2024-08-25 11:45:43.695'), ('3', '3', '0', '2024-08-27 11:37:38.997', '2024-08-27 11:37:38.997'), ('5', '3', '1', '2024-08-27 13:01:00.363', '2024-08-27 13:01:00.363'), ('6', '1', '1', '2024-08-29 00:44:54', '2024-08-29 00:44:57'), ('7', '5', '0', '2024-08-29 13:58:15.662', '2024-08-29 13:58:15.662'), ('9', '8', '0', '2024-09-03 09:15:04.537', '2024-09-03 09:15:04.537'), ('10', '8', '1', '2024-09-03 09:18:18.103', '2024-09-03 09:18:18.103'), ('11', '8', '2', '2024-09-03 10:07:02.101', '2024-09-03 10:07:02.101'), ('14', '6', '1', '2024-09-03 16:27:58.989', '2024-09-03 16:27:58.989'), ('15', '6', '2', '2024-09-03 16:29:45.346', '2024-09-03 16:29:45.346');
INSERT INTO "public"."ResourceActionDepend" ("id", "type", "value", "resourceActionId", "createdAt", "updatedAt", "resourceId", "resourceAttributeId") VALUES ('1', 'attrib', 'role', '1', '2024-08-25 11:57:11.608', '2024-08-25 11:57:11.608', null, null), ('2', 'resc', 'bookUserMap', '10', '2024-09-03 09:18:18.103', '2024-09-03 09:18:18.103', null, null), ('3', 'resc', 'bookStage', '11', '2024-09-03 10:07:02.101', '2024-09-03 10:07:02.101', null, null), ('4', 'resc', 'bookUserMap', '11', '2024-09-03 10:07:02.101', '2024-09-03 10:07:02.101', null, null), ('5', 'attrib', 'stage', '14', '2024-09-03 16:27:58.989', '2024-09-03 16:27:58.989', null, null), ('6', 'resc', 'bookUserMap', '14', '2024-09-03 16:27:58.989', '2024-09-03 16:27:58.989', null, null), ('7', 'attrib', 'stage', '15', '2024-09-03 16:29:45.346', '2024-09-03 16:29:45.346', null, null), ('8', 'resc', 'bookUserMap', '15', '2024-09-03 16:29:45.346', '2024-09-03 16:29:45.346', null, null);
INSERT INTO "public"."ResourceActionPermission" ("id", "resourceActionId", "roleId", "isCreated", "isIncluded", "createdAt", "updatedAt") VALUES ('1', '1', '990', 'false', 'false', '2024-08-25 11:45:43.695', '2024-08-25 11:45:43.695'), ('2', '1', '991', 'false', 'false', '2024-08-25 11:45:43.695', '2024-08-25 11:45:43.695'), ('4', '3', '990', 'false', 'false', '2024-08-27 11:37:38.997', '2024-08-27 11:37:38.997'), ('5', '3', '991', 'false', 'false', '2024-08-27 11:37:38.997', '2024-08-27 11:37:38.997'), ('12', '5', '990', 'false', 'false', '2024-08-27 13:01:00.363', '2024-08-27 13:01:00.363'), ('13', '5', '991', 'false', 'false', '2024-08-27 13:01:00.363', '2024-08-27 13:01:00.363'), ('14', '5', '992', 'false', 'true', '2024-08-27 13:01:00.363', '2024-08-27 13:01:00.363'), ('15', '5', '993', 'false', 'true', '2024-08-27 13:01:00.363', '2024-08-27 13:01:00.363'), ('16', '5', '994', 'false', 'true', '2024-08-27 13:01:00.363', '2024-08-27 13:01:00.363'), ('17', '5', '995', 'false', 'true', '2024-08-27 13:01:00.363', '2024-08-27 13:01:00.363'), ('18', '6', '990', 'false', 'false', '2024-08-29 00:47:01', '2024-08-29 00:47:04'), ('19', '6', '991', 'false', 'false', '2024-08-29 00:47:19', '2024-08-29 00:47:21'), ('20', '7', '990', 'false', 'false', '2024-08-29 13:58:15.662', '2024-08-29 13:58:15.662'), ('21', '7', '991', 'false', 'false', '2024-08-29 13:58:15.662', '2024-08-29 13:58:15.662'), ('24', '9', '990', 'false', 'false', '2024-09-03 09:15:04.537', '2024-09-03 09:15:04.537'), ('25', '9', '991', 'false', 'false', '2024-09-03 09:15:04.537', '2024-09-03 09:15:04.537'), ('26', '10', '990', 'false', 'false', '2024-09-03 09:18:18.103', '2024-09-03 09:18:18.103'), ('27', '10', '991', 'false', 'false', '2024-09-03 09:18:18.103', '2024-09-03 09:18:18.103'), ('28', '10', '992', 'false', 'true', '2024-09-03 09:18:18.103', '2024-09-03 09:18:18.103'), ('29', '10', '993', 'false', 'true', '2024-09-03 09:18:18.103', '2024-09-03 09:18:18.103'), ('30', '10', '994', 'false', 'true', '2024-09-03 09:18:18.103', '2024-09-03 09:18:18.103'), ('31', '10', '995', 'false', 'true', '2024-09-03 09:18:18.103', '2024-09-03 09:18:18.103'), ('32', '10', '997', 'false', 'true', '2024-09-03 09:18:18.103', '2024-09-03 09:18:18.103'), ('33', '14', '990', 'false', 'false', '2024-09-03 16:27:58.989', '2024-09-03 16:27:58.989'), ('34', '14', '991', 'false', 'false', '2024-09-03 16:27:58.989', '2024-09-03 16:27:58.989'), ('35', '14', '992', 'false', 'true', '2024-09-03 16:27:58.989', '2024-09-03 16:27:58.989'), ('36', '14', '993', 'false', 'true', '2024-09-03 16:27:58.989', '2024-09-03 16:27:58.989'), ('37', '14', '994', 'false', 'true', '2024-09-03 16:27:58.989', '2024-09-03 16:27:58.989'), ('38', '14', '995', 'false', 'true', '2024-09-03 16:27:58.989', '2024-09-03 16:27:58.989'), ('39', '14', '997', 'false', 'true', '2024-09-03 16:27:58.989', '2024-09-03 16:27:58.989'), ('40', '15', '992', 'false', 'true', '2024-09-03 16:29:45.346', '2024-09-03 16:29:45.346'), ('41', '15', '993', 'false', 'true', '2024-09-03 16:29:45.346', '2024-09-03 16:29:45.346'), ('42', '15', '994', 'false', 'true', '2024-09-03 16:29:45.346', '2024-09-03 16:29:45.346'), ('43', '15', '995', 'false', 'true', '2024-09-03 16:29:45.346', '2024-09-03 16:29:45.346'), ('44', '15', '997', 'false', 'true', '2024-09-03 16:29:45.346', '2024-09-03 16:29:45.346');
INSERT INTO "public"."ResourceAttribute" ("id", "name", "value", "resourceId", "createdAt", "updatedAt") VALUES ('1', 'role', 'ADMIN', '1', '2024-08-25 11:48:09.123', '2024-08-25 11:48:09.123'), ('2', 'role', 'AUTHOR', '1', '2024-08-25 11:50:16.76', '2024-08-25 11:50:16.76'), ('3', 'role', 'DESIGNER', '1', '2024-08-25 11:50:32.834', '2024-08-25 11:50:32.834'), ('4', 'role', 'PROJECT_MANAGER', '1', '2024-08-25 11:50:39.689', '2024-08-25 11:50:39.689'), ('6', 'role', 'EDITOR', '1', '2024-08-25 11:51:00.177', '2024-08-25 11:51:00.177'), ('7', 'role', 'TYPE_SETTER', '1', '2024-08-25 11:51:17.012', '2024-08-25 11:51:17.012'), ('8', 'api', 'list', '1', '2024-08-25 11:54:30.487', '2024-08-25 11:54:30.487'), ('9', 'api', 'list', '3', '2024-08-27 12:26:25.42', '2024-08-27 12:26:25.42'), ('10', 'stage', 'EDITING', '6', '2024-09-01 09:27:10.206', '2024-09-01 09:27:10.206'), ('11', 'stage', 'DESIGNING', '6', '2024-09-01 10:20:27.004', '2024-09-01 10:20:27.004'), ('12', 'stage', 'TYPE_SETTING', '6', '2024-09-03 08:32:35.651', '2024-09-03 08:32:35.651');
INSERT INTO "public"."ResourceAttributeAction" ("id", "resourceAttributeId", "action", "createdAt", "updatedAt") VALUES ('1', '1', '0', '2024-08-25 11:48:09.123', '2024-08-25 11:48:09.123'), ('2', '2', '0', '2024-08-25 11:50:16.76', '2024-08-25 11:50:16.76'), ('3', '3', '0', '2024-08-25 11:50:32.834', '2024-08-25 11:50:32.834'), ('4', '4', '0', '2024-08-25 11:50:39.689', '2024-08-25 11:50:39.689'), ('5', '6', '0', '2024-08-25 11:51:00.177', '2024-08-25 11:51:00.177'), ('6', '7', '0', '2024-08-25 11:51:17.012', '2024-08-25 11:51:17.012'), ('7', '8', '1', '2024-08-25 11:54:30.487', '2024-08-25 11:54:30.487'), ('8', '9', '1', '2024-08-27 12:26:25.42', '2024-08-27 12:26:25.42'), ('9', '10', '2', '2024-09-01 09:27:10.206', '2024-09-01 09:27:10.206'), ('10', '11', '2', '2024-09-01 10:20:27.004', '2024-09-01 10:20:27.004'), ('11', '12', '2', '2024-09-03 08:32:35.651', '2024-09-03 08:32:35.651');
INSERT INTO "public"."ResourceAttributeActionDepend" ("id", "type", "value", "resourceAttibuteActionId", "createdAt", "updatedAt", "resourceId", "resourceAttributeId") VALUES ('1', 'resc', 'bookUserMap', '9', '2024-09-01 09:27:10.206', '2024-09-01 09:27:10.206', null, null), ('2', 'resc', 'bookUserMap', '10', '2024-09-01 10:20:27.004', '2024-09-01 10:20:27.004', null, null), ('3', 'resc', 'bookUserMap', '11', '2024-09-03 08:32:35.651', '2024-09-03 08:32:35.651', null, null);
INSERT INTO "public"."ResourceAttributeActionPermission" ("id", "resourceAttributeActionId", "roleId", "isCreated", "isIncluded", "createdAt", "updatedAt") VALUES ('1', '1', '990', 'false', 'false', '2024-08-25 11:48:09.123', '2024-08-25 11:48:09.123'), ('2', '2', '990', 'false', 'false', '2024-08-25 11:50:16.76', '2024-08-25 11:50:16.76'), ('3', '2', '991', 'false', 'false', '2024-08-25 11:50:16.76', '2024-08-25 11:50:16.76'), ('4', '3', '990', 'false', 'false', '2024-08-25 11:50:32.834', '2024-08-25 11:50:32.834'), ('5', '3', '991', 'false', 'false', '2024-08-25 11:50:32.834', '2024-08-25 11:50:32.834'), ('6', '4', '990', 'false', 'false', '2024-08-25 11:50:39.689', '2024-08-25 11:50:39.689'), ('7', '4', '991', 'false', 'false', '2024-08-25 11:50:39.689', '2024-08-25 11:50:39.689'), ('8', '5', '990', 'false', 'false', '2024-08-25 11:51:00.177', '2024-08-25 11:51:00.177'), ('9', '5', '991', 'false', 'false', '2024-08-25 11:51:00.177', '2024-08-25 11:51:00.177'), ('10', '6', '990', 'false', 'false', '2024-08-25 11:51:17.012', '2024-08-25 11:51:17.012'), ('11', '6', '991', 'false', 'false', '2024-08-25 11:51:17.012', '2024-08-25 11:51:17.012'), ('12', '7', '990', 'false', 'false', '2024-08-25 11:54:30.487', '2024-08-25 11:54:30.487'), ('13', '7', '991', 'false', 'false', '2024-08-25 11:54:30.487', '2024-08-25 11:54:30.487'), ('14', '7', '992', 'false', 'false', '2024-08-25 11:54:30.487', '2024-08-25 11:54:30.487'), ('15', '8', '990', 'false', 'false', '2024-08-27 12:26:25.42', '2024-08-27 12:26:25.42'), ('16', '8', '991', 'false', 'false', '2024-08-27 12:26:25.42', '2024-08-27 12:26:25.42'), ('17', '8', '992', 'false', 'true', '2024-08-27 12:26:25.42', '2024-08-27 12:26:25.42'), ('18', '8', '993', 'false', 'true', '2024-08-27 12:26:25.42', '2024-08-27 12:26:25.42'), ('19', '8', '994', 'false', 'true', '2024-08-27 12:26:25.42', '2024-08-27 12:26:25.42'), ('20', '8', '995', 'false', 'true', '2024-08-27 12:26:25.42', '2024-08-27 12:26:25.42'), ('21', '9', '997', 'false', 'false', '2024-09-01 09:27:10.206', '2024-09-01 09:27:10.206'), ('22', '9', '993', 'false', 'false', '2024-09-01 09:27:10.206', '2024-09-01 09:27:10.206'), ('23', '10', '994', 'false', 'false', '2024-09-01 10:20:27.004', '2024-09-01 10:20:27.004'), ('24', '10', '993', 'false', 'false', '2024-09-01 10:20:27.004', '2024-09-01 10:20:27.004'), ('25', '11', '995', 'false', 'false', '2024-09-03 08:32:35.651', '2024-09-03 08:32:35.651'), ('26', '11', '993', 'false', 'false', '2024-09-03 08:32:35.651', '2024-09-03 08:32:35.651'), ('27', '8', '997', 'false', 'true', '2024-09-08 12:54:24', '2024-09-08 12:54:33');
