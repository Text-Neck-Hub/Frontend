import { Http } from "../types/Http";
import { type Logs } from "../types/Logs";
export const getLogs = async (): Promise<Logs> =>
  await Http.get<Logs>("/core/v1/dashboard/");



