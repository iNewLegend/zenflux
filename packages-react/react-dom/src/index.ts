// Export all exports so that they're available in tests.
// We can't use export * from in Flow for some reason.
export { default as __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from "@z-react-dom/ReactDOMSharedInternals";
export {
    createPortal,
    createRoot,
    hydrateRoot,
    findDOMNode,
    flushSync,
    hydrate,
    render,
    unmountComponentAtNode,
    unstable_batchedUpdates,
    unstable_createEventHandle,
    unstable_renderSubtreeIntoContainer,
    unstable_runWithPriority // DO NOT USE: Temporarily exposed to migrate off of Scheduler.runWithPriority.
    ,
    useFormStatus,
    useFormState,
    prefetchDNS,
    preconnect,
    preload,
    preloadModule,
    preinit,
    preinitModule,
    version
} from "@z-react-dom/client/ReactDOM";