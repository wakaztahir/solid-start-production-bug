import {Alert, AlertType, Anique, Button, Card, Spinner} from "@qinetik/anique";
import {styled} from "@qinetik/emotion";
import {Accessor, Match, ParentProps, Show, Switch} from "solid-js";
import {A} from "solid-start";

export const SmallText = styled("small")`
    color: ${Anique.colors.onBg400};
`

export const UnstyledLink = styled(A)`
    text-decoration: none;

    &:hover {
        color: ${Anique.colors.onBg} !important;
    }
`

export const ClickableCard = styled(Card)`

    cursor: pointer;
    transition: background 0.25s ease-in;
    position: relative;

    &:hover {
        background: ${Anique.colors.bg300};
    }

`

export const ErrorStyledButton = styled(Button)`
    background: ${Anique.colors.error};
    color: ${Anique.colors.onError};

    &:hover {
        background: ${Anique.colors.error};
        filter: brightness(110%);
    }
`

export function DisplayResource<T>(props: ParentProps<{
    fetch: () => void,
    error: Accessor<[AlertType, any] | undefined>,
    accessor: Accessor<T>
}>) {
    return (
        <Switch>
            <Match when={props.accessor() != null}>
                {props.children}
            </Match>
            <Match when={props.error() != null && props.accessor() == null}>
                <Alert type={props.error()![0]}>
                    {props.error()![1]}
                    <Button onClick={props.fetch}>Retry</Button>
                </Alert>
            </Match>
            {/*TODO @ryan this is where the error occurs, If you hide the component, no error*/}
            <Match when={props.accessor() == null && props.error() == null}>
                <Spinner/>
            </Match>
        </Switch>
    )
}

export function ProcessingField(props: ParentProps<{ processing : Accessor<string | undefined>, field: string }>) {
    return (
        <>
            <Show when={props.processing() == props.field}>
                <Spinner/>
            </Show>
            <Show when={props.processing() == null}>
                {props.children}
            </Show>
        </>
    )
}