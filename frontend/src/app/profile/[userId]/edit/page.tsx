import styles from "./page.module.css";

import EditProfile from "@/app/components/EditProfile";

export default async function Page({ params }: { params: Promise<{ userId: string }> }) {
  const userIdString: string = (await params).userId;

  return (
    <div className={styles.editProfilePage}>
      <EditProfile userId={userIdString} />
    </div>
  );
}
