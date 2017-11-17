"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
var Parse_1 = require("./Parse");
var tf = _1.Terraform({
    path: "/usr/local/bin/terraform",
    cwd: "/Users/christianbradley/src/delphire-terraform/modules/environment/api",
});
Promise.resolve()
    .then(function () { return _1.exec(_1.WorkspaceSelect("clovis.staging"), tf); })
    .then(function () { return _1.exec(_1.StateShow("aws_elastic_beanstalk_environment.api"), tf, Parse_1.stateShow); })
    .then(console.log)
    .catch(console.error);
