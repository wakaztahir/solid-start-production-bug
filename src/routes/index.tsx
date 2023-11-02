import {Column, DrawerItem, Scaffold, StaticDrawer} from "@qinetik/anique";
import {WebAppBar} from "~/solid/components/AppBar";
import {createSignal, ParentProps} from "solid-js";
import {MainContext, MainContextType} from "~/solid/components/main/MainContext";
import {Project} from "~/core/models/Project";
import {Task} from "~/core/models/Task";
import {UnstyledLink} from "~/solid/components/Utils";

export function MainScreenPage(props : ParentProps) {
    return (
        <Scaffold
            topBar={() => (
                <WebAppBar/>
            )}
            drawerContent={() => (
                <MainPageDrawer/>
            )}
            children={props.children}
        />
    )
}

export default function Home() {

    const [projects, setProjects] = createSignal<Project[]>([])
    const [tasks, setTasks] = createSignal<Task[]>([])

    const context: MainContextType = {
        projects: projects,
        setProjects: setProjects,
        tasks: tasks,
        setTasks: setTasks
    }

    return (
        <MainScreenPage>
            <MainContext.Provider value={context}>
                <div style={{
                    "padding": "0em 2em",
                    "box-sizing": "border-box"
                }}>
                    <Column gap={"1em"}>
                        <h1 style={{margin: 0}}>User Projects</h1>
                        <Column gap={"1em"} style={{width: "100%"}}>
                            Nothing to see here
                        </Column>
                    </Column>
                </div>
            </MainContext.Provider>
        </MainScreenPage>
    )
}

interface MainPageDrawerProps {

}

const DrawerItemLink = DrawerItem.withComponent(UnstyledLink)

export function MainPageDrawer(props: MainPageDrawerProps) {
    return (
        <StaticDrawer>
            <DrawerItemLink href={"/"}>Main</DrawerItemLink>
        </StaticDrawer>
    )
}