import UserProfile from "../../components/UserProfile";

import styles from "./page.module.css";

export default async function Page({ params }: { params: Promise<{ userId: string }> }) {
  const userIdString: string = (await params).userId;

  return (
    <div className={styles.profilePage}>
      <UserProfile userId={userIdString} />
    </div>
  );
}
