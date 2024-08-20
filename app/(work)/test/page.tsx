import UserAvatar from "@/components/elements/UserAvatar";

export default function page() {
  return (
    <section className="page-sections">
      <UserAvatar size="lg" user={{ image: "", name: "ss" }} label />
    </section>
  );
}
