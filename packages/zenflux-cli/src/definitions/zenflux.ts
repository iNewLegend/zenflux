/**
 * @author: Leonid Vinikov <leonidvinikov@gmail.com>
 */
export const DEFAULT_Z_CONFIG_FILE = "zenflux.config.ts";

export const DEFAULT_Z_ETC_FOLDER = ".z";

export const DEFAULT_Z_VERDACCIO_FOLDER = "verdaccio";
export const DEFAULT_Z_VERDACCIO_CONFIG_FILE = "config.yaml";
export const DEFAULT_Z_VERDACCIO_STORAGE_FOLDER = "storage";
export const DEFAULT_Z_VERDACCIO_HTPASSWD_FILE = "htpasswd";

export const DEFAULT_Z_REGISTRY_HOST = "0.0.0.0";
export const DEFAULT_Z_REGISTRY_PORT_RANGE: [ number, number ] = [ 4873, 4999 ];

export const DEFAULT_Z_REGISTRY_USER = "zenflux";
export const DEFAULT_Z_REGISTRY_PASSWORD = "zenflux";

export const DEFAULT_Z_FORMATS = [ "cjs", "es", "umd" ] as const;

export type TZFormatType = typeof DEFAULT_Z_FORMATS[ number ];
