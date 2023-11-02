import {useNavigate, useParams, useSearchParams} from "@solidjs/router";
import LoadProjectScreen from "~/solid/routes/single_project";
import {onMount} from "solid-js";

export default function PublicProjectDisplayer() {
    const params = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const pageNumber = parseInt(searchParams.page)
    return (
        <LoadProjectScreen
            key={params.key}
            isUUID={searchParams.uuid === "true"}
            isOwned={searchParams.owned === "true"}
            pageNumber={isNaN(pageNumber) ? 1 : pageNumber}
        />
    )
}