import {TaskPriority} from "../../../core/models/Task";
import {Chip} from "@qinetik/anique";


export function PriorityChip(props: { priority: TaskPriority }) {
    return (
        <Chip>{props.priority}</Chip>
    )
}