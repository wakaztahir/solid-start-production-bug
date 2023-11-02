// @refresh reload
import {Suspense} from 'solid-js'
import {Body, ErrorBoundary, FileRoutes, Head, Html, Meta, Routes, Scripts, Title} from 'solid-start'
import './root.css'
import {
    AniqueGlobalStyling,
    AniqueThemeAutoSetup,
    AniqueThemeDark,
    AniqueThemeLight,
    SpinnerAnimation
} from "@qinetik/anique";

export default function Root() {
    return (
        <Html lang="en" class={"dark"}>
            <Head>
                <Title>easyToDo | Task Management</Title>
                <Meta charset="utf-8"/>
                <Meta name="viewport" content="width=device-width, initial-scale=1"/>
                <AniqueThemeAutoSetup />
            </Head>
            <Body>
                <Suspense>
                    <ErrorBoundary>
                        <Routes>
                            <FileRoutes/>
                        </Routes>
                    </ErrorBoundary>
                </Suspense>
                <Scripts/>
            </Body>
        </Html>
    )
}
