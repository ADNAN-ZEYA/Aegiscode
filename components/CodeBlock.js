export default function CodeBlock({ children }) {
  return (
    <pre className="bg-gray-100 p-3 rounded overflow-auto text-sm">
      <code>{children}</code>
    </pre>
  )
}
