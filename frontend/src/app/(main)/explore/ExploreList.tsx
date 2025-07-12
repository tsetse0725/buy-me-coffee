import ExploreCard from "@/app/_components/ExploreCard";
import EmptyState from "./EmptyState";
import type { Profile } from "@/app/types/user";

type Props = {
  profiles: Profile[];
  query: string;
};

export default function ExploreList({ profiles, query }: Props) {
  const filtered = profiles.filter((p) =>
    p.name?.toLowerCase().includes(query.toLowerCase())
  );

  if (!filtered.length) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col space-y-4">
      {filtered.map((profile) => (
        <ExploreCard
          key={profile.id}
          username={profile.username}
          name={profile.name}
          avatarImage={profile.avatarImage}
          about={profile.about}
          socialMediaURL={profile.socialMediaURL}
        />
      ))}
    </div>
  );
}
