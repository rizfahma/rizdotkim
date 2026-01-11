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
           class="block h-full p-6 bg-white dark:bg-zinc-900/80 border border-black/5 dark:border-white/10 rounded-2xl backdrop-blur-sm
                  hover:bg-gradient-to-br hover:from-blue-50/95 hover:to-purple-50/95 dark:hover:from-blue-900/35 dark:hover:to-purple-900/35
                  hover:border-blue-300/30 dark:hover:border-purple-400/30
                  transition-colors duration-200 overflow-hidden"
          role="article"
          aria-label={`Read ${entry.data.title}`}
        >
            {/* Decorative corner accent */}
            <div class="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-400/8 dark:to-purple-400/8 rounded-bl-full opacity-0 group-hover:opacity-40 transition-opacity duration-200"></div>
            
            <div class="relative h-full flex flex-col">
              {/* Header with meta */}
              <div class="flex items-center justify-between mb-4">
                {pill && (
                  <div class="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-400/20 dark:to-purple-400/20 text-blue-700 dark:text-blue-300 border border-blue-300/30 dark:border-purple-400/30">
                    {entry.collection === "blog" ? "Post" : "Project"}
                  </div>
                )}
                <time class="text-xs font-medium text-black/40 dark:text-white/40 tracking-wide uppercase">
                  {formatDate(entry.data.date)}
                </time>
              </div>
              
              {/* Title */}
              <h3 class="text-xl font-bold text-black dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 leading-tight">
                {entry.data.title}
              </h3>

              {/* Summary */}
              <p class="text-base text-black/60 dark:text-white/60 line-clamp-3 mb-4 leading-relaxed flex-grow">
                {entry.data.summary}
              </p>
              
              {/* Tags */}
              {entry.data.tags && entry.data.tags.length > 0 && (
                <div class="flex flex-wrap gap-1.5 mb-4">
                  {entry.data.tags.slice(0, 3).map((tag: string) => (
                    <span class="text-xs font-semibold uppercase tracking-wide py-1 px-2.5 rounded-md bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 text-black/60 dark:text-white/60 hover:bg-black/8 dark:hover:bg-white/12 transition-colors">
                      {tag}
                    </span>
                  ))}
                  {entry.data.tags.length > 3 && (
                    <span class="text-xs font-semibold uppercase tracking-wide py-1 px-2.5 rounded-md bg-gradient-to-r from-black/5 to-black/10 dark:from-white/5 dark:to-white/10 border border-black/10 dark:border-white/20 text-black/40 dark:text-white/40">
                      +{entry.data.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Footer with arrow */}
              <div class="flex items-center justify-between mt-auto">
                <span class="text-sm font-semibold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Continue reading
                </span>
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600 dark:text-blue-400">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </a>
      </article>
       )
    }
