import { createClient, Entry, EntrySkeletonType } from "contentful";

interface AdFields {
  contentAddUrl?: string;
  contentRedirectUrl?: string;
  title?: string;
}

interface AdEntrySkeleton extends EntrySkeletonType {
  fields: AdFields;
}

type AdEntry = Entry<AdEntrySkeleton>;

const client = createClient({
  space: process.env.NEXT_PUBLIC_SPACE_CONTENT as string,
  accessToken: process.env.NEXT_PUBLIC_SPACE_CONTENT_TOKEN as string,
});

export async function fetchAds(): Promise<AdEntry[]> {
  const entries = await client.getEntries<AdEntrySkeleton>({
    content_type: "videoAdd",
  });
  return entries.items as AdEntry[];
}
