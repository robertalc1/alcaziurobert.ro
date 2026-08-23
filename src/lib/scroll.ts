// Shared anchor-scroll helper — same offsets the fixed navbar needs
// (100px under 768px, 80px above), used by Navbar/Hero/Index anchors.
export const navOffset = () => (window.innerWidth < 768 ? 100 : 80);

export function scrollToId(id: string): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  const y = el.getBoundingClientRect().top + window.pageYOffset - navOffset();
  window.scrollTo({ top: y, behavior: "smooth" });
  return true;
}
