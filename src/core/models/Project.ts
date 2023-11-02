export interface ProjectLabel {

    id?: string
    title: string
    color?: number

}

export interface Project {
    _id?: string;
    user_id?: string;
    parent_uuid?: string
    title: string;
    project_type?: string
    color?: number
    is_archived?: boolean
    is_pinned?: boolean
    labels?: ProjectLabel[]
    key?: string
    children?: string[]
    start_date?: number
    due_date?: number
    last_task_number?: number
    total_tasks ?: number;
    created_date: number;
    edited_date: number;
    deleted_date?: number
    viewers?: string[]
    editors?: string[]
}