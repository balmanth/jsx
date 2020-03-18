"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**!
 * Copyright (C) 2020 Silas B. Domingos
 * @license MIT
 */
const Objects = require("@balmanth/objects");
/**
 * Attachment base.
 */
class Attachment {
    /**
     * Get children.
     */
    get children() {
        return Objects.emptyArray;
    }
    /**
     * Get attributes.
     */
    get attributes() {
        return Objects.emptyObject;
    }
    /**
     * Render contents.
     * @throws Throws an error when the method wasn't overwritten.
     */
    render() {
        throw new TypeError(`Render method doesn't implemented.`);
    }
}
exports.Attachment = Attachment;
//# sourceMappingURL=attachment.js.map