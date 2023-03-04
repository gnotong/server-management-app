import { Status } from "src/app/enums/status.enum";

export interface Server {
  id: number;
  name: string;
  ipAddress: string;
  type: string;
  memory: string;
  status: Status;
}
