"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("./Util");
var Terraform_1 = require("./Terraform");
function Create(_a) {
    var name = _a.name, dir = _a.dir, state = _a.state;
    return {
        name: ["workspace", "new"],
        opts: { state: state },
        args: [name, dir]
    };
}
exports.Create = Create;
function List(_a) {
    var dir = _a.dir;
    return {
        name: ["workspace", "list"],
        args: [dir]
    };
}
exports.List = List;
function Remove(_a) {
    var name = _a.name, dir = _a.dir, force = _a.force;
    return {
        name: ["workspace", "delete"],
        opts: { force: force },
        args: [name, dir]
    };
}
exports.Remove = Remove;
function Select(_a) {
    var name = _a.name, dir = _a.dir;
    return {
        name: ["workspace", "select"],
        args: [name, dir]
    };
}
exports.Select = Select;
function Show(params) {
    return {
        name: ["workspace", "show"]
    };
}
exports.Show = Show;
function list(params, tf) {
    var parse = function (_a) {
        var stdout = _a.stdout;
        var pattern = /^\* (.+)$/;
        return stdout
            .split("\n")
            .map(Util_1.trim)
            .filter(Util_1.isPresentString)
            .map(function (name) {
            var result = pattern.exec(name);
            if (result === null) {
                return { name: name };
            }
            else {
                return { name: result[1], selected: true };
            }
        });
    };
    return Terraform_1.exec(List(params), tf).then(parse);
}
exports.list = list;
function show(params, tf) {
    var parse = function (_a) {
        var stdout = _a.stdout;
        return Util_1.trim(stdout);
    };
    return Terraform_1.exec(Show(params), tf).then(parse);
}
exports.show = show;
function create(params, tf) {
    return Terraform_1.exec(Create(params), tf).then(Util_1.voidResult);
}
exports.create = create;
function remove(params, tf) {
    return Terraform_1.exec(Remove(params), tf).then(Util_1.voidResult);
}
exports.remove = remove;
function select(params, tf) {
    return Terraform_1.exec(Select(params), tf).then(Util_1.voidResult);
}
exports.select = select;
