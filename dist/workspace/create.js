"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function create(_a) {
    var name = _a.name, dir = _a.dir, state = _a.state;
    return {
        name: ["workspace", "new"],
        opts: { state: state },
        args: [name, dir]
    };
}
exports.create = create;
