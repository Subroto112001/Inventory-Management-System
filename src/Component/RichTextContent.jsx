export default function RichTextContent({ html, className = "" }) {
  if (!html || !html.replace(/<[^>]*>/g, "").trim()) return null;

  // Content is sanitized in the product API before it reaches this renderer.
  return (
    <div
      className={`rich-text-content min-w-0 break-words [&_a]:text-blue-700 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_h1]:my-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:my-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:my-3 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:my-1 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-2 [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:border-collapse [&_td]:border [&_td]:border-gray-300 [&_td]:p-2 [&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-50 [&_th]:p-2 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
