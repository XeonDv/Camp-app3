/** Barra roja con el título de cada sección del PDF. */
export function SectionHeader({ title }: { title: string }) {
  return <h2 className="section-bar">{title}</h2>;
}
