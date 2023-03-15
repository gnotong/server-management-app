import { Status } from "src/app/enums/status.enum";
import { ResponseData } from "./response-data.interface";
import { Server } from "./server.interface";

export interface CustomResponse{
    timeStamp: Date;
    statusCode: number;
    status: Status;
    reason: string;
    message: string;
    developerMessage: string;
    data: ResponseData;
}