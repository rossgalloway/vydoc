"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.generateDocs = void 0;
var ejs_1 = __importDefault(require("ejs"));
var fs_1 = require("fs");
var path_1 = require("path");
var ramda_1 = require("ramda");
var progress_1 = require("./progress");
var generateDocs = function (format, output, contracts, templatePath) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, ramda_1.cond([
                [
                    ramda_1.equals('markdown'),
                    function () { return generateMarkDown(contracts, output, templatePath); },
                ],
                [
                    ramda_1.T,
                    function () {
                        throw new Error('invalid format');
                    },
                ],
            ])(format)];
    });
}); };
exports.generateDocs = generateDocs;
var generateMarkDown = function (contracts, output, templatePath) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, ramda_1.pipe(fs_1.readFileSync, function (buffer) { return buffer.toString(); }, ejs_1["default"].compile, function (template) {
                return ramda_1.pipe(function (handler) {
                    return contracts
                        .map(ramda_1.tap(function (contract) {
                        return fs_1.mkdirSync(path_1.join(output, contract.fileName, '..'), {
                            recursive: true
                        });
                    }))
                        .map(ramda_1.tap(function (contract) {
                        return fs_1.writeFileSync(path_1.join(output, contract.fileName).replace(/\.[^.]+$/, '.md'), 
                        // commented the below as it breaks any .vy files not in kebab-case
                        // .replace(/([a-z])([A-Z])/g, '$1-$2')
                        // .toLowerCase(),
                        template(contract).toString());
                    }))
                        .map(ramda_1.tap(handler));
                })(progress_1.makeProgressBar(contracts.length));
            })(templatePath)];
    });
}); };
