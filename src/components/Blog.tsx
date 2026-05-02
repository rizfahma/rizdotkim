import type { CollectionEntry } from "astro:content"
import { createSignal, createMemo, For } from "solid-js"
import ArrowCard from "@components/ArrowCard"
import { cn } from "@lib/utils"

type Props = {
  data: CollectionEntry<"blog">[]
}

const POSTS_PER_PAGE = 8

export default function Blog({ data }: Props) {
  const [currentPage, setCurrentPage] = createSignal(1)
  const [pageInput, setPageInput] = createSignal("")
  const totalPages = Math.ceil(data.length / POSTS_PER_PAGE)

  const paginatedPosts = createMemo(() => {
    const start = (currentPage() - 1) * POSTS_PER_PAGE
    const end = start + POSTS_PER_PAGE
    return data.slice(start, end)
  })

  const pageNumbers = createMemo(() => {
    const current = currentPage()
    const pages = []
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
      return pages
    }
    
    pages.push(1)
    
    if (current > 3) {
      pages.push(-1)
    }
    
    const start = Math.max(2, current - 1)
    const end = Math.min(totalPages - 1, current + 1)
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    if (current < totalPages - 2) {
      pages.push(-1)
    }
    
    if (totalPages > 1) {
      pages.push(totalPages)
    }
    
    return pages
  })

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      setPageInput("")
    }
  }

  const handlePageInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    const value = target.value
    setPageInput(value)
    
    const page = parseInt(value)
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      goToPage(page)
    }
  }

  const handlePageInputKey = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      const page = parseInt(pageInput())
      if (!isNaN(page)) {
        goToPage(page)
      }
    }
  }

  return (
    <div class="flex flex-col gap-6">
      <div class="text-sm uppercase tracking-wider text-black/60 dark:text-white/60 mb-6">
        Showing {paginatedPosts().length} of {data.length} posts
      </div>
      <div class="flex flex-col gap-6">
        <ul class="flex flex-col gap-3">
          <For each={paginatedPosts()}>
            {(post) => (
              <li>
                <ArrowCard entry={post} />
              </li>
            )}
          </For>
        </ul>
        
        <div class="flex flex-col items-center gap-4 pt-8">
          <div class="text-sm text-black/60 dark:text-white/60">
            Page {currentPage()} of {totalPages}
          </div>
          
          <div class="flex items-center gap-2 flex-wrap justify-center">
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage() === 1}
              class={cn(
                "px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium",
                "bg-black/5 dark:bg-white/10 hover:bg-black/10 hover:dark:bg-white/15",
                "disabled:opacity-30 disabled:cursor-not-allowed",
                "flex items-center gap-1"
              )}
              title="First page"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7M18 19l-7-7 7-7"/>
              </svg>
              First
            </button>
            
            <div class="hidden sm:flex items-center gap-1">
              <For each={pageNumbers()}>
                {(page) => (
                  page === -1 ? (
                    <span class="px-2 py-2 text-black/40 dark:text-white/40">...</span>
                  ) : (
                    <button
                      onClick={() => goToPage(page)}
                      class={cn(
                        "w-10 h-10 rounded-lg transition-all duration-300 text-sm font-medium",
                        currentPage() === page
                          ? "bg-black dark:bg-white text-white dark:text-black shadow-lg scale-105"
                          : "bg-black/5 dark:bg-white/10 hover:bg-black/10 hover:dark:bg-white/15"
                      )}
                    >
                      {page}
                    </button>
                  )
                )}
              </For>
            </div>

            <div class="flex sm:hidden items-center gap-2">
              <input
                type="number"
                value={pageInput() || currentPage()}
                onInput={handlePageInput}
                onKeyDown={handlePageInputKey}
                min={1}
                max={totalPages}
                class="w-16 px-2 py-2 text-center rounded-lg text-sm font-medium
                       bg-black/5 dark:bg-white/10 border border-black/20 dark:border-white/20
                       text-black dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-black/30 dark:focus:ring-white/30
                       [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder={currentPage().toString()}
              />
              <span class="text-sm text-black/60 dark:text-white/60">/ {totalPages}</span>
            </div>
            
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage() === totalPages}
              class={cn(
                "px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium",
                "bg-black/5 dark:bg-white/10 hover:bg-black/10 hover:dark:bg-white/15",
                "disabled:opacity-30 disabled:cursor-not-allowed",
                "flex items-center gap-1"
              )}
              title="Last page"
            >
              Last
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M6 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

          <div class="flex items-center gap-2 text-sm">
            <span class="text-black/60 dark:text-white/60">Go to:</span>
            <input
              type="number"
              value={pageInput()}
              onInput={handlePageInput}
              onKeyDown={handlePageInputKey}
              min={1}
              max={totalPages}
              placeholder="Page #"
              class="w-20 px-3 py-2 rounded-lg text-sm font-medium
                     bg-black/5 dark:bg-white/10 border border-black/20 dark:border-white/20
                     text-black dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-black/30 dark:focus:ring-white/30
                     [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
