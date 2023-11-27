/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
"use strict";

import {
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED as Internals,
    createRoot as createRootImpl,
    hydrateRoot as hydrateRootImpl
} from "./";

import type { ReactNodeList } from "../../zenflux-react-shared/src/react-types";

import type { CreateRootOptions, HydrateRootOptions, RootType } from "@z-react-dom/client/ReactDOMRoot";

export function createRoot( container: Element | Document | DocumentFragment, options?: CreateRootOptions ): RootType {
    if ( __DEV__ ) {
        Internals.usingClientEntryPoint = true;
    }

    try {
        return createRootImpl( container, options );
    } finally {
        if ( __DEV__ ) {
            Internals.usingClientEntryPoint = false;
        }
    }
}

export function hydrateRoot( container: Document | Element, children: ReactNodeList, options?: HydrateRootOptions ): RootType {
    if ( __DEV__ ) {
        Internals.usingClientEntryPoint = true;
    }

    try {
        return hydrateRootImpl( container, children, options );
    } finally {
        if ( __DEV__ ) {
            Internals.usingClientEntryPoint = false;
        }
    }
}
