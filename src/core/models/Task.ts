export enum TaskPriority {
    Low = "Low",
    Medium = "Medium",
    High = "High",
    Urgent = "Urgent",
}

export interface Task {

    _id?: string;
    user_id?: string;
    parent_uid?: string;
    project_uuid: string;
    reminder_uid?: string;
    task_type?: string;
    title: string;
    details?: string;
    children?: string[];
    position?: number;
    in_progress?: boolean;
    finished?: boolean;
    priority?: TaskPriority;
    color?: number;
    tag_ids?: string[];
    assigned_to?: string;
    start_date?: number;
    due_date?: number;
    last_time_fired?: number;
    times_fired?: number;
    task_number?: number
    interval_type?: string;
    interval_number?: number;
    firing_week_days?: string;
    same_month_day?: boolean;
    is_forever?: boolean;
    until_date?: number;
    until_events?: number;
    created_date: number;
    edited_date: number;
    deleted_date?: number;

}