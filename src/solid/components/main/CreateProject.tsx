import {AlertType, Anique, Column, Dialog} from "@qinetik/anique";
import {Project} from "~/core/models/Project";
import {createSignal} from "solid-js";

interface CreateProjectProps {

    project?: Project

    onProjectCreated: (project: Project) => void;

    onProjectUpdated: (project: Project) => void;

    onProjectDeleted: (project: Project) => void;

    onMessage: (message: [AlertType, string]) => void;

    onCloseRequest: () => void

}

export default function CreateProject(props: CreateProjectProps) {

    return (
        <Column
            style={{background: Anique.colors.bg200, "border-radius": Anique.border.mdRadius, "padding": "1em 2em"}}
            gap={"1em"}
        >
            No Project to create, since I am a cute dummy
        </Column>
    )
}

function ConfirmDeleteDialog(props: { keyOrName: string, onCloseRequest: () => void, onDelete: () => void }) {
    const [typed, setTyped] = createSignal("")
    return (
        <Dialog onCloseRequest={props.onCloseRequest}>
            <Column
                style={{
                    background: Anique.colors.bg200,
                    padding: "1em",
                    "border-radius": Anique.border.mdRadius
                }}
                onClick={(e) => e.stopPropagation()}
            >
                Came to delete bro ?
            </Column>
        </Dialog>
    )
}