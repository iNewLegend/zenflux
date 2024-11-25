import Module, { ImportAttributes } from "node:module";

import { type Context, Script } from "vm";
import type { ModuleLinker, SourceTextModule, SourceTextModuleOptions, SyntheticModule } from "node:vm";
import type { ProviderBase } from "../src/providers/base/provider-base";

declare global {
    type zVmModuleType = "node" | "esm" | "json";

    type zVmModuleSource = Module | string | any;

    type zVmModule = SyntheticModule | SourceTextModule;

    interface zVmModuleLocalTextSourceOptions {
        cache: boolean;
        referencingModule: Module;
        moduleImportMeta?: ReturnType<SourceTextModuleOptions["initializeImportMeta"]>;
        moduleImportDynamically?: ( ( specifier: string, script: Script, importAttributes: ImportAttributes ) => Module );
        moduleLinkerCallback?: ModuleLinker | null;
    }

    interface zVmModuleEvaluateOptions {
        moduleType?: zVmModuleType
        moduleLocalTextSourceOptions?: zVmModuleLocalTextSourceOptions
        context?: Context
    }

    interface zVmResolverRequest {
        provider: ProviderBase;
        modulePath: string;
        resolvedPath?: string;
        referencingModule: Module;
    }

    function zVmResolverMiddlewareCallback( request: zVmResolverRequest ): void;
}
