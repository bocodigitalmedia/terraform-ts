"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function remove(_a) {
    var name = _a.name, dir = _a.dir, force = _a.force;
    return {
        name: ["workspace", "delete"],
        opts: { force: force },
        args: [name, dir]
    };
}
exports.remove = remove;
