"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.E_HTTP_METHOD_TYPE = exports.E_RESPONSE_HANDLER_TYPE = void 0;
var E_RESPONSE_HANDLER_TYPE;
(function (E_RESPONSE_HANDLER_TYPE) {
    E_RESPONSE_HANDLER_TYPE["ERROR_HANDLER"] = "error_handler";
    E_RESPONSE_HANDLER_TYPE["RESPONSE_FILTER"] = "response_filter";
    E_RESPONSE_HANDLER_TYPE["RESPONSE_HANDLER"] = "response_handler";
})(E_RESPONSE_HANDLER_TYPE || (exports.E_RESPONSE_HANDLER_TYPE = E_RESPONSE_HANDLER_TYPE = {}));
;
var E_HTTP_METHOD_TYPE;
(function (E_HTTP_METHOD_TYPE) {
    E_HTTP_METHOD_TYPE["DELETE"] = "DELETE";
    E_HTTP_METHOD_TYPE["GET"] = "GET";
    E_HTTP_METHOD_TYPE["OPTIONS"] = "OPTIONS";
    E_HTTP_METHOD_TYPE["PATCH"] = "PATCH";
    E_HTTP_METHOD_TYPE["POST"] = "POST";
    E_HTTP_METHOD_TYPE["PUT"] = "PUT";
    E_HTTP_METHOD_TYPE["__EMPTY__"] = "";
})(E_HTTP_METHOD_TYPE || (exports.E_HTTP_METHOD_TYPE = E_HTTP_METHOD_TYPE = {}));
;