import { formatDate } from "@lib/utils"
import type { CollectionEntry } from "astro:content"

type Props = {
  entry: CollectionEntry<"blog"> | CollectionEntry<"projects">
  pill?: boolean
}

export default function ArrowCard({entry, pill}: Props) {
    return (
      <article class="group relative h-full">
        <a 
          href={`/${entry.collection}/${entry.slug}`} 
           class="card-supabase block h-full p-6
                  transition-all duration-200 transform-none hover:transform-none
                  overflow-hidden"
          role="article"
          aria-label={`Read ${entry.data.title}`}
        >

            
            <div class="relative h-full flex flex-col">
              {/* Header with meta */}
              <div class="flex items-center justify-between mb-3">
                {pill && (
                  <div class="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-md bg-supabase-green/10 text-supabase-green border border-supabase-green/20">
                    {entry.collection === "blog" ? "Post" : "Project"}
                  </div>
                )}
                <time class="text-xs font-medium text-supabase-gray-500 dark:text-supabase-gray-400 tracking-wide uppercase">
                  {formatDate(entry.data.date)}
                </time>
              </div>
              
              {/* Title */}
              <h3 class="text-lg font-semibold text-supabase-gray-900 dark:text-supabase-gray-100 mb-2 leading-tight">
                {entry.data.title}
              </h3>

              {/* Summary */}
              <p class="text-sm text-supabase-gray-600 dark:text-supabase-gray-300 line-clamp-3 mb-3 leading-relaxed flex-grow">
                {entry.data.summary}
              </p>
              
              {/* Tags */}
              {entry.data.tags && entry.data.tags.length > 0 && (
                <div class="flex flex-wrap gap-1.5">
                  {entry.data.tags.slice(0, 3).map((tag: string) => (
                    <span class="text-xs font-medium uppercase tracking-wide py-1 px-2 rounded bg-supabase-gray-100 dark:bg-supabase-gray-800 text-supabase-gray-600 dark:text-supabase-gray-400 border border-supabase-gray-200 dark:border-supabase-gray-700">
                      {tag}
                    </span>
                  ))}
                  {entry.data.tags.length > 3 && (
                    <span class="text-xs font-medium uppercase tracking-wide py-1 px-2 rounded bg-supabase-gray-50 dark:bg-supabase-gray-900 text-supabase-gray-500 dark:text-supabase-gray-500 border border-supabase-gray-200 dark:border-supabase-gray-700">
                      +{entry.data.tags.length - 3}
                    </span>
                  )}
                </div>
              )}


            </div>
          </a>
      </article>
       )
    }
