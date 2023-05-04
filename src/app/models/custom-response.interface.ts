import { Status } from "src/app/enums/status.enum";
import { ResponseData } from "./response-data.interface";

export interface CustomResponse{
    timeStamp: Date;
    statusCode: number;
    status: Status;
    reason: string;
    data: ResponseData;
}