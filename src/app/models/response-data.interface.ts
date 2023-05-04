import { Server } from "./server.interface";

export interface ResponseData{
    servers?: Server[];
    server?: Server;
    error?: string | Map<string, string>;
    deleted?: boolean;
}