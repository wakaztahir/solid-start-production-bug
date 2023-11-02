import {
    Alert,
    AlertType,
    Anique,
    BaseTextField,
    Button,
    Card,
    Chip,
    Column,
    Dialog,
    IconButton,
    Row,
    Scaffold,
    Spinner,
    TextField
} from "@qinetik/anique";
import {createEffect, createSignal, For, Show} from "solid-js";
import type {Project, ProjectLabel} from "~/core/models/Project";
import {DisplayResource, ProcessingField} from "../components/Utils";
import ProjectTaskActions from "~/solid/components/main/ProjectTaskActions";
import {useMainContext} from "~/solid/components/main/MainContext";
import {Task} from "~/core/models/Task";
import {WebAppBar} from "~/solid/components/AppBar";
import PencilEditIcon from "~/solid/icons/PencilEditIcon";
import CloseIcon from "~/solid/icons/CloseIcon";
import CheckIcon from "~/solid/icons/CheckIcon";
import {styled} from "@qinetik/emotion";
import type {TaskFilterFunction, TaskSortingFunction} from "../components/main/TaskFilterSorter";

interface LoadProjectProps {
    key: string,
    isUUID: boolean,
    isOwned: boolean,
    pageNumber: number
}

interface ProjectWithChildren {
    project: Project
    children: Task[]
}

export default function LoadProjectScreen(props: LoadProjectProps) {

    const [project, setProject] = createSignal<ProjectWithChildren>()
    const [error, setError] = createSignal<[AlertType, any]>()

    function fetch() {
        setTimeout(() => {
            const proj: Project = {
                _id: "",
                children: [],
                color: 0,
                created_date: 0,
                deleted_date: 0,
                due_date: 0,
                edited_date: 0,
                editors: [],
                is_archived: false,
                is_pinned: false,
                key: "",
                labels: [],
                last_task_number: 0,
                parent_uuid: "",
                project_type: "",
                start_date: 0,
                title: "",
                total_tasks: 0,
                user_id: "",
                viewers: []
            }
            setProject({project: proj, children: []})
        }, 1000)
    }

    createEffect(fetch)

    return (
        <DisplayResource fetch={fetch} error={error} accessor={project}>
            <Scaffold
                topBar={() => (
                    <WebAppBar/>
                )}
                oppositeDrawerContent={() => (
                    <ProjectRightSidebar
                        item={project()!!}
                        onUpdate={setProject}
                        displayActions={props.isOwned}
                    />
                )}
            >
                <ProjectContentSection
                    item={project()!!}
                    showUserActions={props.isOwned}
                    projectKey={props.key}
                    isProjectKeyUUID={props.isUUID}
                    isOwned={props.isOwned}
                    pageNumber={props.pageNumber}
                    onUpdate={setProject}
                />
            </Scaffold>
        </DisplayResource>
    )
}

interface ProjectRightSidebarProps {

    item: ProjectWithChildren

    onUpdate: (item: ProjectWithChildren) => void;

    displayActions: boolean

}

function ProjectRightSidebar(props: ProjectRightSidebarProps) {

    let created = new Date(props.item.project.created_date)
    let updated = new Date(props.item.project.edited_date)

    const [manageLabels, setManageLabels] = createSignal(false)
    const [processing, setProcessing] = createSignal<string>()
    const [error, setError] = createSignal<[AlertType, any]>()

    return (
        <Column gap={"1em"} style={{padding: "2em", "box-sizing": "border-box"}}>
            <Show when={error() != null}>
                <Alert type={error()![0]}>{error()![1]}</Alert>
            </Show>
            <Column gap={"0.25em"} style={{width: "100%"}}>
                <h5 style={{margin: 0}}>Public</h5>
                <Card
                    style={{width: "100%"}}>{(props.item.project.viewers?.find(e => e == "public") != null).toString()}</Card>
            </Column>
            {props.displayActions && (
                <ProcessingField processing={processing} field={"labels"}>
                    <Column gap={"0.5em"} style={{width: "100%"}}>
                        <h5 style={{margin: 0}}>Labels</h5>
                        <DisplayProjectLabels labels={props.item.project.labels}/>
                        <Button style={{width: "100%"}} onClick={() => setManageLabels(true)}>Manage</Button>
                    </Column>
                </ProcessingField>
            )}
            <Column gap={"0.25em"} style={{width: "100%"}}>
                <h5 style={{margin: 0}}>Total Tasks</h5>
                <Card style={{width: "100%"}}>{(props.item.project.total_tasks || 0).toString()}</Card>
            </Column>
            <Column gap={"0.25em"} style={{width: "100%"}}>
                <h5 style={{margin: 0}}>Created</h5>
                <Card style={{width: "100%"}}>{updated.toLocaleString()}</Card>
            </Column>
            <Column gap={"0.25em"} style={{width: "100%"}}>
                <h5 style={{margin: 0}}>Last Modified</h5>
                <Card style={{width: "100%"}}>{created.toLocaleString()}</Card>
            </Column>
            <Show when={manageLabels()}>
                <Dialog
                    onCloseRequest={() => setManageLabels(false)}
                >
                    <ManageLabels
                        project_uuid={props.item.project._id!}
                        labels={props.item.project.labels || []}
                        onUpdate={(newLabels, edited_date) => {
                            props.item.project.labels = newLabels
                            props.item.project.edited_date = edited_date
                            props.onUpdate({...props.item})
                        }}
                        onDismiss={() => setManageLabels(false)}
                    />
                </Dialog>
            </Show>
        </Column>
    )
}

export function DisplayProjectLabels(
    props: {
        labels: ProjectLabel[] | undefined
        onRemove?: (label: ProjectLabel) => void
    }
) {
    // TODO use a flex row here
    return (
        <Show when={props.labels != null}>
            <Row gap={"0.5em"}>
                <For each={props.labels}>
                    {label => (
                        <Chip>
                            <Row gap={"0.25em"}>
                                {label.title}
                                <Show when={props.onRemove != null}>
                                    <IconButton size={-1}
                                                onClick={() => props.onRemove!(label)}><CloseIcon/></IconButton>
                                </Show></Row>
                        </Chip>
                    )}
                </For>
            </Row>
        </Show>
    )
}

interface ManageLabelsProps {

    project_uuid: string

    labels: ProjectLabel[],

    onUpdate: (labels: ProjectLabel[] | undefined, edited_date: number) => void

    onDismiss: () => void

}

export function ManageLabels(props: ManageLabelsProps) {

    const [labels, setLabels] = createSignal(props.labels || [])
    const [labelCreateText, setLabelCreateText] = createSignal("")
    const [error, setError] = createSignal<[AlertType, any]>()
    const [processing, setProcessing] = createSignal(false)

    function updateLabels(labels: ProjectLabel[] | undefined) {
        if (labels === props.labels) {
            props.onDismiss()
            return
        }
        setProcessing(true)
    }

    function createLabel(text: string) {
        setLabelCreateText("")
        const label: ProjectLabel = {
            title: text
        }
        setLabels((prevLabels) => [label, ...prevLabels])
    }

    return (
        <Column style={{background: Anique.colors.bg200, "border-radius": "4px", "padding": "1em"}} gap={"0.5em"}>
            <h3 style={{margin: 0}}>Labels</h3>
            <Show when={processing()}>
                <Spinner/>
            </Show>
            <Show when={error() != null}>
                <Alert type={error()![0]}>{error()![1]}</Alert>
            </Show>
            <Row gap={"0.5em"}>
                <TextField
                    placeholder={"Add Label"}
                    style={{width: "16em"}}
                    value={labelCreateText()}
                    disabled={processing()}
                    onChange={(e) => setLabelCreateText(e.currentTarget.value)}
                    onkeyup={(e) => {
                        if (e.key == "Enter") {
                            createLabel(e.currentTarget.value)
                        }
                    }}
                />
                <IconButton onClick={() => createLabel(labelCreateText())}>
                    <CheckIcon/>
                </IconButton>
            </Row>
            <DisplayProjectLabels
                labels={labels()}
                onRemove={(label) => {
                    setLabels((prevLabels) => prevLabels.filter(e => e.id != label.id))
                }}
            />
            <Button
                style={{"align-self": "flex-end"}}
                onClick={() => {
                    const l = labels()
                    updateLabels(l.length == 0 ? undefined : l)
                }}
                disabled={processing()}>Save</Button>
        </Column>
    )
}

interface ProjectContentProps {

    item: ProjectWithChildren

    showUserActions: boolean

    projectKey: string

    isProjectKeyUUID: boolean

    pageNumber: number

    isOwned: boolean

    onUpdate: (item: ProjectWithChildren) => void;


}

function ProjectContentSection(props: ProjectContentProps) {
    // let created = new Date(props.item.project.created_date)
    // let updated = new Date(props.item.project.edited_date)
    const context = useMainContext()
    const [editingTitle, setEditingTitle] = createSignal(false)
    const [title, setTitle] = createSignal(props.item.project.title)
    const [children, setChildren] = createSignal(props.item.children)
    const [editingTask, setEditingTask] = createSignal<Task>()
    const [processing, setProcessing] = createSignal<string>()
    const [error, setError] = createSignal<[AlertType, any]>()

    let filter: TaskFilterFunction = (tasks) => tasks
    let sorter: TaskSortingFunction = (tasks) => tasks

    function updateFilter(newFilter: TaskFilterFunction) {
        filter = newFilter
        setChildren(sorter(filter(props.item.children)))
    }

    function updateSorter(newSorter: TaskSortingFunction) {
        sorter = newSorter
        setChildren(sorter(filter(props.item.children)))
    }

    return (
        <Column gap={"1em"} style={{width: "100%", padding: "2em", "box-sizing": "border-box"}}>
            <Show when={error() != null}>
                <Alert type={error()![0]}>{error()![1]}</Alert>
            </Show>
            <Show when={editingTitle()}>
                <Row gap={"0.5em"} style={{"justify-content": "space-between", width: "100%"}}>
                    <ProcessingField processing={processing} field={"title"}>
                        <BaseTextField
                            style={{width: "100%"}}
                            value={title()}
                            onChange={(e) => setTitle(e.currentTarget.value)}
                        />
                        <IconButton
                            onClick={() => setEditingTitle(false)}
                        >
                            <CloseIcon/>
                        </IconButton>
                        <IconButton
                            onClick={() => {
                                setProcessing("title")
                            }}
                        >
                            <CheckIcon/>
                        </IconButton>
                    </ProcessingField>
                </Row>
            </Show>
            <Show when={!editingTitle()}>
                <Row gap={"0.5em"} style={{"justify-content": "space-between", width: "100%"}}>
                    <h1 style={{margin: 0}}>{props.item.project.title}</h1>
                    {props.showUserActions && (
                        <IconButton
                            onClick={() => setEditingTitle(true)}
                        ><PencilEditIcon/></IconButton>
                    )}
                </Row>
            </Show>
            {/*<Row gap={"1em"} style={{width: "100%", "justify-content": "space-between"}}>*/}
            {/*    <SmallText><strong>Created</strong> {updated.toLocaleString()}</SmallText>*/}
            {/*    <SmallText><strong>Modified</strong> {created.toLocaleString()}</SmallText>*/}
            {/*</Row>*/}
            <Show when={props.showUserActions}>
                <ProjectTaskActions
                    project={props.item.project}
                    onUpdateFilter={updateFilter}
                    onUpdateSorting={updateSorter}
                />
            </Show>
            Like I said error doesn't happen in dev mode
            <Pagination
                total={props.item.project.total_tasks || 0}
                perPage={10}
                current={props.pageNumber}
                href={(pageNumber) => {
                    const url = new URL(window.location.href)
                    url.searchParams.set("page", String(pageNumber))
                    return `${url}`
                }}
            />
        </Column>
    )
}

interface PaginationProps {
    total: number,
    perPage: number,
    current: number,
    href?: (page: number) => (string | undefined)
}

const PageNumber = styled.a`

    width: 2.75em;
    height: 2.75em;
    background: ${Anique.colors.bg100};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    cursor: pointer;
    color: ${Anique.colors.onBg};
    text-decoration: none;

    &:hover, &.current {
        background: ${Anique.colors.bg200};
        color: ${Anique.colors.onBg};
    }

    &.current {
        background: ${Anique.colors.primary};
    }

`

function Pagination(props: PaginationProps) {

    if (props.total < 1 || props.perPage < 1) return null

    return (
        <Row gap={"0.5em"} wrap>
            <For each={Array.from(Array(Math.ceil(props.total / props.perPage)).keys(), item => item + 1)}>
                {pageNumber => (
                    <PageNumber
                        class={props.current == pageNumber ? "current" : undefined}
                        href={(props.href || (() => undefined))(pageNumber)}
                    >{pageNumber}</PageNumber>
                )}
            </For>
        </Row>
    )

}