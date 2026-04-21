import Link from 'next/link'

export default function PostCard({ post }) {
  return (
    <article className="border rounded p-4">
      {/* Move the clickable area to Link directly */}
      <Link href={`/blog/${post.slug}`} className="no-underline">
        <h3 className="font-semibold">{post.frontmatter.title}</h3>
      </Link>

      <p className="text-sm text-gray-600 mt-2">
        {post.frontmatter.description || post.frontmatter.summary || ''}
      </p>
      <div className="text-xs text-gray-500 mt-3">{post.frontmatter.date}</div>
    </article>
  )
}
