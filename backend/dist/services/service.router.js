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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceRouter = void 0;
var express_1 = __importDefault(require("express"));
var Service = __importStar(require("./service.service"));
// export const serviceRouter = express.Router()
exports.serviceRouter = express_1.default.Router();
// List users
exports.serviceRouter.get("/", function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var service, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Service.findAll()];
            case 1:
                service = _a.sent();
                return [2 /*return*/, response.status(200).json(service)];
            case 2:
                error_1 = _a.sent();
                return [2 /*return*/, response.status(500).json(error_1.message)];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get single service
exports.serviceRouter.get("/:id", function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var id, service, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = parseInt(request.params.id, 10);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Service.findById(id)];
            case 2:
                service = _a.sent();
                if (service) {
                    return [2 /*return*/, response.status(200).json(service)];
                }
                return [2 /*return*/, response.status(404).json({ error: true, msg: "O serviço não foi encontrado!" })];
            case 3:
                error_2 = _a.sent();
                return [2 /*return*/, response.status(500).json(error_2.message)];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Create service
exports.serviceRouter.post("/", function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var service, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Service.create(request.body)];
            case 1:
                service = _a.sent();
                if (service)
                    return [2 /*return*/, response.status(200).json({ error: false, msg: "Novo serviço foi criado com sucesso" })];
                return [2 /*return*/, response.status(500).json({ error: true, msg: "Operação falhou" })];
            case 2:
                error_3 = _a.sent();
                return [2 /*return*/, response.status(500).json({ error: true, msg: error_3.message })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Delete service
exports.serviceRouter.delete("/:id", function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var id, service, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = parseInt(request.params.id, 10);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Service.destroy(id)];
            case 2:
                service = _a.sent();
                return [2 /*return*/, response.status(200).json({ error: "false", msg: "Serviço eliminado com sucesso" })];
            case 3:
                error_4 = _a.sent();
                return [2 /*return*/, response.status(500).json(error_4.message)];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Updade service
exports.serviceRouter.put("/:id", function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var id, service, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = parseInt(request.params.id);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Service.updateservice(id, request.body)];
            case 2:
                service = _a.sent();
                return [2 /*return*/, response.json({ error: false, msg: "Alterações feitas com sucesso" })];
            case 3:
                error_5 = _a.sent();
                return [2 /*return*/, response.status(500).json(error_5.message)];
            case 4: return [2 /*return*/];
        }
    });
}); });
