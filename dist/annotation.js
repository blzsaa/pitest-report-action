"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnnotations = void 0;
const core = __importStar(require("@actions/core"));
/**
 * Create Check Runs Annotation for every selected annotation
 * @param report mutation report
 * @param maxAnnotations max number of annotations to process
 * @param annotationType which mutations to include
 * @returns annotation[] annotations that can be used for Checks Run
 */
function createAnnotations(reports, maxAnnotations, annotationType) {
    let annotations = [];
    core.info("reports" + reports);
    reports.map(report => {
        var _a;
        return (_a = report.mutations) === null || _a === void 0 ? void 0 : _a.filter(m => annotationType === "ALL" || m.attr_status === annotationType).slice(0, Math.max(maxAnnotations - annotations.length, 0)).forEach(m => {
            const annotation = {
                path: m.mutatedClass,
                start_line: m.lineNumber,
                end_line: m.lineNumber,
                annotation_level: m.attr_status === "KILLED" ? "notice" : "warning",
                message: limitStringSize((!!m.description) ? m.description : m.mutator, 64 * 1024),
                raw_details: limitStringSize(JSON.stringify(m, null, 2), 64 * 1024),
                title: limitStringSize(`${m.attr_status} -> ${m.mutatedClass}:${m.mutatedMethod}`, 255)
            };
            annotations.push(annotation);
        });
    });
    return annotations;
}
exports.createAnnotations = createAnnotations;
/**
 * Helper method to cut off text at certain size and add three dots to indicate that there should be more text
 * @param text the text to cut-off
 * @param maxSize max size that the text may be
 * @returns string cut-off at max size
 */
function limitStringSize(text, maxSize) {
    return text.length <= maxSize ? text : text.substring(0, maxSize - 3) + "...";
}
