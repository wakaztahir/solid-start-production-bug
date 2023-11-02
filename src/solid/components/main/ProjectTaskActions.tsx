import {Column, Row} from "@qinetik/anique";
import {Project} from "~/core/models/Project";
import {TaskFilterChips, TaskFilterChipsProps} from "~/solid/components/main/TaskFilterSorter";

interface ProjectTaskActionsProps extends TaskFilterChipsProps {
    project: Project
}

export default function ProjectTaskActions(props: ProjectTaskActionsProps) {
    return (
        <Column gap={"0.5em"}>
            <Row gap={"0.35em"}>
                <button>A Buttttton</button>
            </Row>
            <Row gap={"0.25em"}>
                <TaskFilterChips
                    onUpdateFilter={props.onUpdateFilter}
                    onUpdateSorting={props.onUpdateSorting}
                />
            </Row>
        </Column>
    )
}