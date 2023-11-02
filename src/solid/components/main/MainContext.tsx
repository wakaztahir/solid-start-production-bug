import {Accessor, createContext, Setter, useContext} from "solid-js";
import {Project} from "~/core/models/Project";
import {Task} from "~/core/models/Task";

export interface AsyncResource<T> {
    resource?: T
    error?: any
}

export interface MainContextType {

    projects: Accessor<Project[]>

    setProjects: Setter<Project[]>

    tasks: Accessor<Task[]>

    setTasks: Setter<Task[]>

}

const defaultMainContext: MainContextType = {

    projects: () => [],

    setProjects: (projects) => {
    },

    tasks: () => [],

    setTasks: (tasks) => {
    }

}

export const MainContext = createContext(defaultMainContext)

export function useMainContext() {
    return useContext(MainContext)
}

export function onProjectCreated(setProjects: Setter<Project[]>, project: Project) {
    setProjects((prevProjs) => [
        ...prevProjs,
        project,
    ])
}

export function onProjectUpdated(setProjects: Setter<Project[]>, project: Project) {
    setProjects((prevProjs) =>
        prevProjs.map((e) => e._id === project._id ? project : e)
    )
}

export function onProjectDeleted(setProjects: Setter<Project[]>, project: Project) {
    setProjects((prevProjs) => (
        prevProjs.filter(e => e._id != project._id)
    ))
}
export function onTaskUpdated(setTasks: Setter<Task[]>, task: Task) {
    setTasks((prevTasks) =>
        prevTasks.map((e) => e._id === task._id ? task : e)
    )
}