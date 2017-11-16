"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function list(params) {
    return {
        name: ["workspace", "list"],
        args: [params.dir]
    };
}
exports.list = list;
