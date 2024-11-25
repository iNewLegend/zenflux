export async function resolve(specifier, context, defaultResolve) {
    console.log(specifier)
    // Custom resolve logic if needed
    return defaultResolve(specifier, context, defaultResolve);
}

export async function load(url, context, defaultLoad) {
    // Fallback to the default loader
    const result = defaultLoad(url, context, defaultLoad);

    console.log(url, result );

    result.then( console.warn )

    return result;
}
