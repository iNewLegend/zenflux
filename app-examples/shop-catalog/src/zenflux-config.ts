import { interfaces } from "@zenflux/core";

const config: Partial<interfaces.IAPIConfig> = {
    baseURL: "http://localhost:8000",
    requestInit: {
        credentials: "include",
        redirect: "manual",
    }
};

export default config;
