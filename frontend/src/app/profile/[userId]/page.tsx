export default async function Page({ params }: { params: Promise<{ userId: string }> }) {
  const userId = (await params).userId;
  return <h1>Profile page {userId}</h1>;
}
