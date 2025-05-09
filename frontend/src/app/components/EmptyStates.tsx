import Image from "next/image";
import React from "react";

import styles from "./EmptyStates.module.css";

type EmptyStateProps = {
  title: string;
  subtitle: string;
  icon: string;
  alt: string;
};

const EmptyState = ({ title, subtitle, icon, alt }: EmptyStateProps) => (
  <div
    className={
      title.includes("No notes") ? styles.emptyStateContainerNoNotes : styles.emptyStateContainer
    }
  >
    <Image src={icon} alt={alt} width={170} height={150} className="empty-icon" />
    <h3>{title}</h3>
    <p>{subtitle}</p>
  </div>
);

export const NoVeterans = () => (
  <EmptyState
    title="No veterans assigned yet"
    subtitle="Admins will assign you a veteran soon! You’ll receive a notification in your activities panel once assigned."
    icon="/building_icon.png"
    alt="no veterans icon"
  />
);

export const NoDocuments = () => (
  <EmptyState
    title="No documents yet"
    subtitle="Start uploading documents for volunteers to view!"
    icon="/document_icon.png"
    alt="no documents icon"
  />
);

export const NoNotes = () => (
  <EmptyState title="No notes yet" subtitle="" icon="/clipboard_icon.png" alt="no notes icon" />
);
