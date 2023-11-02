import {AppBar, Dialog, IconButton, Row, Spacer} from "@qinetik/anique";
import {ThemeSwitcher} from "./ThemeSwitcher";
import {createEffect, createSignal, Show} from "solid-js";
import {styled} from "@qinetik/emotion";
import AccountIcon from "~/solid/icons/AccountIcon";
import {Title} from "solid-start";

const UserPic = styled("img")`
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
`

const LinkButton = IconButton.withComponent("a")

function UserAccountAction() {

    const [signIn, setSignIn] = createSignal(false)
    const [userInfo, setUserInfo] = createSignal<{}>()

    return (
        <>
            <Show when={userInfo() != null}>
                <LinkButton href={"https://account.qinetik.org"} target={"_blank"}>
                    <AccountIcon/>
                </LinkButton>
            </Show>
            <Show when={userInfo() == null}>
                <IconButton onClick={() => setSignIn(true)}>
                    <AccountIcon/>
                </IconButton>
            </Show>
        </>
    )

}

export function WebAppBar(props: { title?: string }) {
    return (
        <>
            <Title>{props.title || "EasyToDo"}</Title>
            <AppBar
                title={props.title || "EasyToDo"}
                actions={(
                    <Row gap={"1em"}>
                        <ThemeSwitcher/>
                        <UserAccountAction/>
                    </Row>
                )}
            />
        </>
    )
}