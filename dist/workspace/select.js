"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function select(_a) {
    var name = _a.name, dir = _a.dir;
    return {
        name: ["workspace", "select"],
        args: [name, dir]
    };
}
exports.select = select;
