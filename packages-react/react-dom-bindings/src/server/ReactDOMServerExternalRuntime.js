"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable dot-notation */
// Imports are resolved statically by the closure compiler in release bundles
// and by rollup in jest unit tests
var ReactDOMFizzInstructionSetExternalRuntime_1 = require("@zenflux/react-dom-bindings/src/server/fizz-instruction-set/ReactDOMFizzInstructionSetExternalRuntime");
// @ts-ignore
if (!window.$RC) {
    // TODO: Eventually remove, we currently need to set these globals for
    // compatibility with ReactDOMFizzInstructionSet
    // @ts-ignore
    window.$RC = ReactDOMFizzInstructionSetExternalRuntime_1.completeBoundary;
    // @ts-ignore
    window.$RM = new Map();
}
if (document.body != null) {
    if (document.readyState === "loading") {
        installFizzInstrObserver(document.body);
    }
    // $FlowFixMe[incompatible-cast]
    handleExistingNodes(document.body);
}
else {
    // Document must be loading -- body may not exist yet if the fizz external
    // runtime is sent in <head> (e.g. as a preinit resource)
    // $FlowFixMe[recursive-definition]
    var domBodyObserver_1 = new MutationObserver(function () {
        // We expect the body node to be stable once parsed / created
        if (document.body != null) {
            if (document.readyState === "loading") {
                installFizzInstrObserver(document.body);
            }
            // $FlowFixMe[incompatible-cast]
            handleExistingNodes(document.body);
            // We can call disconnect without takeRecord here,
            // since we only expect a single document.body
            domBodyObserver_1.disconnect();
        }
    });
    // documentElement must already exist at this point
    domBodyObserver_1.observe(document.documentElement, {
        childList: true
    });
}
function handleExistingNodes(target) {
    var existingNodes = target.querySelectorAll("template");
    for (var i_1 = 0; i_1 < existingNodes.length; i_1++) {
        handleNode(existingNodes[i_1]);
    }
}
function installFizzInstrObserver(target) {
    var handleMutations = function (mutations) {
        for (var i_2 = 0; i_2 < mutations.length; i_2++) {
            var addedNodes = mutations[i_2].addedNodes;
            for (var j = 0; j < addedNodes.length; j++) {
                if (addedNodes[j].parentNode) {
                    handleNode(addedNodes[j]);
                }
            }
        }
    };
    var fizzInstrObserver = new MutationObserver(handleMutations);
    // We assume that instruction data nodes are eventually appended to the
    // body, even if Fizz is streaming to a shell / subtree.
    fizzInstrObserver.observe(target, {
        childList: true
    });
    window.addEventListener("DOMContentLoaded", function () {
        handleMutations(fizzInstrObserver.takeRecords());
        fizzInstrObserver.disconnect();
    });
}
function handleNode(node_) {
    // $FlowFixMe[incompatible-cast]
    if (node_.nodeType !== 1 || !node_.dataset) {
        return;
    }
    // $FlowFixMe[incompatible-cast]
    var node = node_;
    var dataset = node.dataset;
    if (dataset["rxi"] != null) {
        (0, ReactDOMFizzInstructionSetExternalRuntime_1.clientRenderBoundary)(dataset["bid"], dataset["dgst"], dataset["msg"], dataset["stck"]);
        node.remove();
    }
    else if (dataset["rri"] != null) {
        // Convert styles here, since its type is Array<Array<string>>
        (0, ReactDOMFizzInstructionSetExternalRuntime_1.completeBoundaryWithStyles)(dataset["bid"], dataset["sid"], JSON.parse(dataset["sty"]));
        node.remove();
    }
    else if (dataset["rci"] != null) {
        (0, ReactDOMFizzInstructionSetExternalRuntime_1.completeBoundary)(dataset["bid"], dataset["sid"]);
        node.remove();
    }
    else if (dataset["rsi"] != null) {
        (0, ReactDOMFizzInstructionSetExternalRuntime_1.completeSegment)(dataset["sid"], dataset["pid"]);
        node.remove();
    }
}
