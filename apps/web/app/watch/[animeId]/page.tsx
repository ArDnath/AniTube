import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ animeId: string }>;
}

export default async function WatchAnimeRedirectPage({ params }: Props) {
  const { animeId } = await params;
  redirect(`/watch/${animeId}/1`);
}
