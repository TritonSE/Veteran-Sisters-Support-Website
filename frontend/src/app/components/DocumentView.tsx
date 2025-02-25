"use client"
import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { storage } from "../firebase";
import Image from "next/image"
import {Document, Page} from "react-pdf"
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import styles from "./DocumentView.module.css";
import { Role } from "./Role";
import { Program } from "./Program";
import { FileObject, getFileById, Comment } from "../api/fileApi";
import Link from "next/link";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

type DocumentViewProps = {
    documentId: string
}

export function DocumentView({documentId}: DocumentViewProps){
    const [file, setFile] = useState<FileObject>();
    const [fileURL, setFileURL] = useState<string>();
    const [numPages, setNumPages] = useState<number>();
    const [comments, setComments] = useState<Comment[]>();
    const [currComment, setCurrComment] = useState<number>();

    useEffect(()=>{
        getFileById(documentId).then((response)=>{
            if(response.success){
                setFile(response.data)
                setComments(response.data.comments)
            }else{
                console.log(response.error)
            }
        }).catch((error)=>{
            console.log(error)
        })
        getDownloadURL(ref(storage, `files/${documentId}`)).then((url)=>{
            setFileURL(url)
            console.log(url)
        }).catch((error)=>{
            console.log(error)
        })
    }, [])

    // const addCommentHandler = () => {
    //     set
    // }

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
      }

    const HeaderBar = (filename: string)=>{
        return(
            <div className={styles.header}>
                <Link href="/veteranDashboard">
                    <Image src="/logo.svg" width={143} height={32} alt="logo" />
                </Link>
                <div className={styles.headerSection}>{filename}<Image src="/pencil_icon.svg" width={16} height={16} alt="edit"/></div>
                <div className={styles.headerSection}>
                    <Image src="/download_icon.svg" width={24} height={24} alt="download"/>
                    <Image src="/print_icon.svg" width={24} height={24} alt="print"/>
                </div>
            </div>
        )
    }

    const Comment = (key: number, name: string, role: string, programs: string[], body: string, date: string) => {
        const borderColor = programs[0]==="battle buddies"?"#0093EB":programs[0]==="advocacy"?"#3730A3":"#337357"
        return(
            <div key={key}>
            {key!=currComment?
                (
            <div className={styles.comment} style={{border: `1px solid ${borderColor}`} as React.CSSProperties}>
                <div className={styles.commentTopRow}>
                    <div className={styles.profileIcon}>{name.trim().substring(0, 1).toUpperCase()}</div>
                    <div style={{maxWidth: 100}}>{name}</div>
                    <Role role={role} />
                    {programs.map((program, i)=>{
                        return(<Program key={i} program={program} iconOnly />)
                    })}
                </div>
                <div className={styles.commentBody}>
                    {body}
                </div>
                <div className={styles.commentBottomRow}>
                    <div className={styles.commentDate}>{date}</div>
                    <div className={styles.commentBottomIcons}>
                        <Image src="/pencil_icon_2.svg" width={16} height={16} alt="edit" />
                        <Image src="/trash_icon.svg" width={16} height={16} alt="trash" />
                    </div>
                </div>
            </div>
            ):
            (
                <div className={styles.selectedComment} style={{border: `1px solid ${borderColor}`} as React.CSSProperties}>
                <div className={styles.commentTopRow}>
                    <div className={styles.profileIcon}>{name.trim().substring(0, 1).toUpperCase()}</div>
                    <div style={{maxWidth: 100}}>{name}</div>
                    <Role role={role} />
                    {programs.map((program, i)=>{
                        return(<Program key={i} program={program} iconOnly />)
                    })}
                </div>
                <div className={styles.commentBody}>
                    {body}
                </div>
                <div className={styles.commentBottomRow}>
                    <div className={styles.commentDate}>{date}</div>
                    <div className={styles.commentBottomIcons}>
                        <Image src="/pencil_icon_2.svg" width={16} height={16} alt="edit" />
                        <Image src="/trash_icon.svg" width={16} height={16} alt="trash" />
                    </div>
                </div>
            </div>
            )
            }
        </div>
        )
    }

    return(
        <>
        {file && comments &&
         <>
        <div style={{background: "#f5f5f5"}}>
            {HeaderBar(file.filename)}
            {fileURL && <>
            <Document className={styles.document} file={fileURL} onLoadSuccess={onDocumentLoadSuccess} >
                {Array.from(Array(numPages), (e, i) => {
                    return <Page key={i} pageNumber={i+1} canvasBackground="white" height={window.innerHeight} width={window.innerWidth*0.5} renderAnnotationLayer={false} renderTextLayer={false}/>
                })}
            </Document>
            </>
            }
            <div className={styles.commentsWrapper}>
                {comments.map((comment, i)=>{
                    return Comment(i, `${comment.commenterId.firstName} ${comment.commenterId.lastName}`, comment.commenterId.role, comment.commenterId.assignedPrograms, comment.comment, comment.datePosted)
                })}
            </div>
        </div>
        <div className={styles.addCommentButton}> 
            <Image src="/add_icon.svg" width={20} height={20} alt="add"></Image>
            Add a comment
        </div>
       </>
        }
        </>
    )
}