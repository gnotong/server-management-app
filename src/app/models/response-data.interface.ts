import { Server } from "./server.interface";

export interface ResponseData{
    servers?: Server[];
    server?: Server;
    deleted?: boolean;
}