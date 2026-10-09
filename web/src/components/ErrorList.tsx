/** Lista de mensajes de error del servidor, en un recuadro rojo. */
export function ErrorList({ messages, title }: { messages: string[]; title?: string }) {
  if (messages.length === 0) return null;
  return (
    <div className="alert alert-error" role="alert">
      {title && <strong>{title}</strong>}
      {messages.length === 1 ? (
        <p>{messages[0]}</p>
      ) : (
        <ul>
          {messages.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
