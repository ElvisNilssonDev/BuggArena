export default function CodeBlock({ code, label }) {
  return (
    <figure className="code-block" aria-label={label || "Code snippet"}>
      {label && (
        <figcaption className="code-block__label">{label}</figcaption>
      )}
      <pre className="code-block__pre">
        <code>{code}</code>
      </pre>
    </figure>
  );
}