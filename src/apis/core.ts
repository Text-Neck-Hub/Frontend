import { Http } from "../types/Http";
import { type MySetting } from "../types/UserSetting";
export const getUserSetting = async (): Promise<MySetting> =>
  await Http.get<MySetting>("/core/v1/dashboard/");
export const SetUserSetting = async (mySetting:MySetting): Promise<MySetting> =>
  await Http.post<MySetting>("/core/v1/dashboard/",{mySetting});


