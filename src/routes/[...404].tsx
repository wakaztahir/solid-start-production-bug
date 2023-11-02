import {A} from 'solid-start'
import {Headline} from "@qinetik/anique";

export default function NotFound() {
    return (
        <main>
            <Headline>Not Found</Headline>
            <p>
                <A href="/">
                    Home
                </A>
            </p>
        </main>
    )
}
