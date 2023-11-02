import {Button, Column, Dialog, Row} from "@qinetik/anique";
import {createSignal, Show} from "solid-js";
import CreateProject from "~/solid/components/main/CreateProject";
import {
    onProjectCreated,
    onProjectDeleted,
    onProjectUpdated,
    useMainContext
} from "~/solid/components/main/MainContext";

export default function ProjectsActions() {
    const [createProjectDialog, setCreateProjectDialog] = createSignal(false)
    const context = useMainContext()
    return (
        <Row gap={"0.35em"}>
            <Button
                onClick={() => setCreateProjectDialog(true)}
            >Create Project</Button>
            <Show when={createProjectDialog()}>
                <Dialog onCloseRequest={() => setCreateProjectDialog(false)}>
                    <CreateProject
                        onCloseRequest={() => setCreateProjectDialog(false)}
                        onProjectCreated={(project) => onProjectCreated(context.setProjects, project)}
                        onProjectUpdated={(project) => onProjectUpdated(context.setProjects, project)}
                        onProjectDeleted={(project) => onProjectDeleted(context.setProjects, project)}
                        onMessage={() => {
                            // TODO
                        }}
                    />
                </Dialog>
            </Show>
        </Row>
    )
}