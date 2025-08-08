

export interface Angle {
    angle: number;
    result: number;
    loged_at?: string;
}
export interface AngleList{
    angles:Angle[];
}

export interface Option {
    threshold: number;
    healthy_range: number;
    caution_range: number;
    danger_range: number;
}

export interface UserData {
    user_id: number;
    options: Option[];
    logs: Angle[];
}

export interface MySetting {
    message: string;
    settings: UserData;
}