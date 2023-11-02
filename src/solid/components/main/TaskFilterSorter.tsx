import {Task} from "~/core/models/Task";
import {styled} from "@qinetik/emotion";
import {Anique, ClickableChip, Icon} from "@qinetik/anique";
import {Accessor, createSignal, JSX, JSXElement, splitProps} from "solid-js";
import CheckCircleOutlineIcon from "@qinetik/mdi/CheckCircleOutlineIcon";
import ProgressCheckIcon from "@qinetik/mdi/ProgressCheckIcon";
import SortAscendingIcon from "@qinetik/mdi/SortAscendingIcon";
import SortDescendingIcon from "@qinetik/mdi/SortDescendingIcon";
import TodoAutoIcon from "@qinetik/mdi/TodoAutoIcon";

export type TaskFilterFunction = (task: Task[]) => Task[]

export type TaskSortingFunction = (tasks: Task[]) => Task[]

export interface TaskFilterChipsProps {

    onUpdateFilter: (filter: TaskFilterFunction) => void

    onUpdateSorting: (sorter: TaskSortingFunction) => void

}

const StyledClickableChip = styled(ClickableChip)`
    gap: 0.25em;
    padding: 0.25em 0.5em;

    &.selected {
        background: ${Anique.colors.bg500};
    }
`

function FilterChip(props: {
    icon?: JSXElement,
    content: JSXElement,
    selected: Accessor<boolean>
} & JSX.HTMLAttributes<HTMLDivElement>) {
    return (
        <StyledClickableChip
            class={props.selected() ? "selected" : undefined}
            {...splitProps(props, ["icon", "content", "selected"])[1]}
        >
            {props.icon && (
                <Icon>
                    {props.icon}
                </Icon>
            )}
            {typeof props.content === "string" ? (<span>{props.content}</span>) : props.content}
        </StyledClickableChip>
    )
}

export function TaskFilterChips(props: TaskFilterChipsProps) {

    const [todo, setTodo] = createSignal(false)
    const [finished, setFinished] = createSignal(false)
    const [inProgress, setInProgress] = createSignal(false)
    const [ascending, setAscending] = createSignal(false)

    function mergeFilters(filters: [boolean, (t: Task) => boolean][]): TaskFilterFunction {

        // only turned on filters
        const on = filters.filter(f => f[0])

        // single filter
        if (on.length == 1) return (
            (tasks) => {
                return tasks.filter(on[0][1])
            }
        ) satisfies TaskFilterFunction

        // merge multiple filters, only return those selected not rejected by any filter
        return ((tasks) => {
            return tasks.filter(t => {
                for (const f of on) {
                    if (!f[1](t)) {
                        return false
                    }
                }
                return true
            })
        }) satisfies TaskFilterFunction

    }

    function updatedFilter() {
        const filterFinished = finished()
        const filterTodos = todo()
        const filterInProgress = inProgress()
        props.onUpdateFilter(mergeFilters([
            [filterFinished, (t) => (t.finished || false)],
            [filterTodos, (t) => !t.finished],
            [filterInProgress, (t) => (t.in_progress || false)]
        ]))
    }

    function updatedSorting() {
        if(ascending()) {
            props.onUpdateSorting((tasks) => {
                return tasks.sort((a,b) => a.created_date < b.created_date ? 1 : -1)
            })
        } else {
            props.onUpdateSorting((tasks) => {
                return tasks.sort((a,b) => a.created_date > b.created_date ? 1 : -1)
            })
        }
    }

    return (
        <>
            <FilterChip
                content={"Todo"}
                selected={todo}
                icon={<TodoAutoIcon/>}
                onClick={() => {
                    if (!todo()) {
                        setFinished(false)
                    }
                    setTodo(e => !e)
                    updatedFilter()
                }}
            />
            <FilterChip
                content={"Finished"}
                selected={finished}
                icon={<CheckCircleOutlineIcon/>}
                onClick={() => {
                    if (!finished()) {
                        setTodo(false)
                        setInProgress(false)
                    }
                    setFinished(e => !e)
                    updatedFilter()
                }}
            />
            <FilterChip
                content={"In Progress"}
                selected={inProgress}
                icon={<ProgressCheckIcon/>}
                onClick={() => {
                    if (!inProgress()) {
                        setFinished(false)
                        setTodo(true)
                    }
                    setInProgress(e => !e)
                    updatedFilter()
                }}
            />
            <FilterChip
                content={"Ascending"}
                selected={ascending}
                icon={<SortAscendingIcon/>}
                onClick={() => {
                    setAscending(e => !e)
                    updatedSorting()
                }}
            />
            <FilterChip
                content={"Descending"}
                selected={() => !ascending()}
                icon={<SortDescendingIcon/>}
                onClick={() => {
                    setAscending(e => !e)
                    updatedSorting()
                }}
            />
        </>
    )
}