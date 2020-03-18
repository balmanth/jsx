"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const attachment_1 = require("./attachment");
/**
 * Fragment attachment.
 */
class Fragment extends attachment_1.Attachment {
    /**
     * Render contents.
     */
    render() {
        return this.children;
    }
}
exports.Fragment = Fragment;
//# sourceMappingURL=fragment.js.map