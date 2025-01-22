import UserProfile from "./UserProfile";

export default async function Page({ params }: { params: Promise<{ userId: string }> }) {
  const userIdString: string = (await params).userId;

  return (
    <div>
      <UserProfile userId={userIdString} />
    </div>
  );
}
