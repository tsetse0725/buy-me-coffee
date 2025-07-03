/* simple vertical menu */
export default function Sidebar() {
  return (
    <aside className="w-56 border-r h-screen p-6 space-y-4">
      <a href="/dashboard" className="block font-medium">Home</a>
      <a href="/explore"   className="block">Explore</a>
      <a href="/page"      className="block">View page</a>
      <a href="/settings"  className="block">Account settings</a>
    </aside>
  );
}
