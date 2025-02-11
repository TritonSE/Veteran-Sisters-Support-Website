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

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

type DocumentViewProps = {
    documentId: string
}

export function DocumentView({documentId}: DocumentViewProps){
    const [fileURL, setFileURL] = useState<string>();
    const [numPages, setNumPages] = useState<number>();

    useEffect(()=>{
        getDownloadURL(ref(storage, `files/${documentId}`)).then((url)=>{
            setFileURL(url)
            console.log(url)
        }).catch((error)=>{
            console.log(error)
        })
    }, [])

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
      }

    const HeaderBar = ()=>{
        return(
            <div className={styles.header}>
                <Image src="/logo.svg" width={143} height={32} alt="logo"/>
                <div className={styles.headerSection}>Housing Document <Image src="/pencil_icon.svg" width={16} height={16} alt="edit"/></div>
                <div className={styles.headerSection}>
                    <Image src="/back_arrow.svg" width={24} height={24} alt="back"/>
                    <Image src="/forward_arrow.svg" width={24} height={24} alt="forward"/>
                    <Image src="/download_icon.svg" width={24} height={24} alt="download"/>
                    <Image src="/print_icon.svg" width={24} height={24} alt="print"/>
                </div>
            </div>
        )
    }

    const Comment = (name: string, role: string, programs: string[], body: string, date: string) => {
        const borderColor = programs[0]==="battle buddies"?"#0093EB":programs[0]==="advocacy"?"#3730A3":"#337357"
        return(
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
        )
    }

    return(
        <div style={{background: "#f5f5f5"}}>
            <HeaderBar />
            {fileURL && <>
            <Document className={styles.document} file={fileURL} onLoadSuccess={onDocumentLoadSuccess} >
                {Array.from(Array(numPages), (e, i) => {
                    return <Page key={i} pageNumber={i+1} canvasBackground="white" height={window.innerHeight} width={window.innerWidth*0.5} renderAnnotationLayer={false} renderTextLayer={false}/>
                })}
            </Document>
            </>
            }
            <div className={styles.commentsWrapper}>
                {Comment("Jim Williams", "volunteer", ["battle buddies","advocacy"], "My name is Jim My name is Jim My name is Jim My name is Jim My name is Jim My name is Jim My name is Jim My name is Jim", "Dec 10, 2024")}
                {Comment("Stevethan Montgomery", "staff", ["operation wellness"], "Hi", "Dec 10, 2024")}
                {Comment("Kevin", "veteran", ["battle buddies", "operation wellness"], "I wish my name was Frank", "Dec 10, 2024")}
                {Comment("Margaret", "admin", ["advocacy", "operation wellness"], "I am at least 55 years old", "Dec 10, 2024")}
            </div>
        </div>
    )
}