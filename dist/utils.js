"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashGenerator = void 0;
function hashGenerator(len) {
    let options = "qsdcvbnmpoiuytrdcvb23456789";
    let length = options.length;
    let ans = "";
    for (let i = 0; i < len; i++) {
        ans += options[Math.floor(Math.random() * length)];
    }
    return ans;
}
exports.hashGenerator = hashGenerator;
