import { readingTime } from "@lib/utils"
import type { CollectionEntry } from "astro:content"

type Props = {
  entry: CollectionEntry<"blog"> | CollectionEntry<"projects">
  pill?: boolean
}

function compactDate(date: Date) {
  const month = date.toLocaleDateString("en-US", { month: "short" })
  const day = String(date.getDate()).padStart(2, "0")
  const year = String(date.getFullYear()).slice(-2)
  return `${month} ${day}, ${year}`
}

export default function ArrowCard({ entry, pill }: Props) {
  const isBlog = entry.collection === "blog"
  const readTime = isBlog ? readingTime(entry.body) : null

  return (
    <article class="group relative h-full">
      <a
        href={`/${entry.collection}/${entry.slug}`}
        class="card block h-full p-5"
        role="article"
        aria-label={`Read ${entry.data.title}`}
      >
        <div class="relative h-full flex flex-col">
          {pill && (
            <div class="mb-2.5">
              <span class="text-xs font-semibold uppercase tracking-[0.1em] px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-200">
                {isBlog ? "Post" : "Project"}
              </span>
            </div>
          )}

          <div class="flex items-center gap-2 mb-3 text-xs font-medium uppercase tracking-[0.08em] text-slate-500 leading-none min-w-0">
            <span class="inline-flex items-center gap-1 min-w-0">
              <svg class="size-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              <span class="whitespace-nowrap">{compactDate(entry.data.date)}</span>
            </span>
            {readTime && (
              <>
                <span class="text-slate-300 flex-shrink-0">·</span>
                <span class="inline-flex items-center gap-1 min-w-0">
                  <svg class="size-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <span class="whitespace-nowrap">{readTime}</span>
                </span>
              </>
            )}
          </div>

          <h3 class="text-base font-semibold mb-2 leading-tight tracking-tight text-slate-800 group-hover:text-blue-600 transition-colors duration-200 font-display">
            {entry.data.title}
          </h3>

          <p class="text-sm text-slate-600 line-clamp-3 mb-3 leading-relaxed flex-grow">
            {entry.data.summary}
          </p>

          {entry.data.tags && entry.data.tags.length > 0 && (
            <div class="flex flex-wrap gap-1.5 items-center pr-6">
              {entry.data.tags.slice(0, 3).map((tag: string) => (
                <span class="text-xs font-medium uppercase tracking-[0.08em] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  {tag}
                </span>
              ))}
              {entry.data.tags.length > 3 && (
                <span class="text-xs font-medium uppercase tracking-[0.08em] px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                  +{entry.data.tags.length - 3}
                </span>
              )}
              <div class="absolute right-5 top-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
                <svg class="size-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </div>
            </div>
          )}

          {!entry.data.tags || entry.data.tags.length === 0 && (
            <div class="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
              <svg class="size-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </div>
          )}
        </div>
      </a>
    </article>
  )
}
