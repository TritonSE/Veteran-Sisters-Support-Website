import { DocumentView } from "@/app/components/DocumentView"

export default async function DocumentPage({params}: {params: Promise<{documentId: string}>}){

    const documentId = (await params).documentId    

    return(
        <div>
            <DocumentView documentId={documentId}/>
        </div>
    )

}

