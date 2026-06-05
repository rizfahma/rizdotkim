import type { CollectionEntry } from "astro:content"
import { createSignal, createMemo, For, Show } from "solid-js"
import ArrowCard from "@components/ArrowCard"
import { cn } from "@lib/utils"

type Props = { data: CollectionEntry<"blog">[] }

const POSTS_PER_PAGE = 8

export default function Blog({ data }: Props) {
  const [currentPage, setCurrentPage] = createSignal(1)
  const [pageInput, setPageInput] = createSignal("")
  const totalPages = Math.max(1, Math.ceil(data.length / POSTS_PER_PAGE))

  const paginatedPosts = createMemo(() => {
    const start = (currentPage() - 1) * POSTS_PER_PAGE
    const end = start + POSTS_PER_PAGE
    return data.slice(start, end)
  })

  const pageNumbers = createMemo(() => {
    const current = currentPage()
    const pages = []
    if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) pages.push(i); return pages }
    pages.push(1)
    if (current > 3) pages.push(-1)
    const start = Math.max(2, current - 1)
    const end = Math.min(totalPages - 1, current + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (current < totalPages - 2) pages.push(-1)
    if (totalPages > 1) pages.push(totalPages)
    return pages
  })

  const goToPage = (page: number) => { if (page >= 1 && page <= totalPages) { setCurrentPage(page); setPageInput(""); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }) } }
  const handlePageInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    setPageInput(target.value)
    const page = parseInt(target.value)
    if (!isNaN(page) && page >= 1 && page <= totalPages) goToPage(page)
  }
  const handlePageInputKey = (e: KeyboardEvent) => { if (e.key === "Enter") { const page = parseInt(pageInput()); if (!isNaN(page)) goToPage(page) } }

  return (
    <div class="flex flex-col gap-10">
      <div class="flex items-center justify-between text-[0.625rem] uppercase tracking-[0.25em] text-slate-400">
        <div class="flex items-center gap-3">
          <span>entries</span>
          <span class="font-mono text-slate-300">/</span>
          <span class="font-mono text-slate-500">{(currentPage() - 1) * POSTS_PER_PAGE + 1}–{Math.min(currentPage() * POSTS_PER_PAGE, data.length)} of {data.length}</span>
        </div>
        <Show when={totalPages > 1}>
          <div class="font-mono text-slate-400">
            page {currentPage()} / {totalPages}
          </div>
        </Show>
      </div>

      <ul class="flex flex-col gap-4">
        <For each={paginatedPosts()}>{(post) => (<li><ArrowCard entry={post} pill={true} /></li>)}</For>
      </ul>

      <Show when={totalPages > 1}>
        <div class="flex flex-col items-center gap-6 pt-12 border-t border-slate-200">
          <div class="text-[0.625rem] uppercase tracking-[0.25em] text-slate-400">
            continue reading
          </div>

          <div class="flex items-center gap-3 flex-wrap justify-center">
            <button onClick={() => goToPage(1)} disabled={currentPage() === 1} class={cn("icon-btn !w-10 !h-10 disabled:opacity-20 disabled:cursor-not-allowed")} title="First page">
              <svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7M18 19l-7-7 7-7"/></svg>
            </button>
            <button onClick={() => goToPage(currentPage() - 1)} disabled={currentPage() === 1} class={cn("icon-btn !w-10 !h-10 disabled:opacity-20 disabled:cursor-not-allowed")} title="Previous">
              <svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </button>

            <div class="hidden sm:flex items-center gap-1.5">
              <For each={pageNumbers()}>{(page) => (
                page === -1 ? (<span class="px-2 text-slate-300 font-mono">···</span>) : (
                  <button onClick={() => goToPage(page)} class={cn(
                    "min-w-10 h-10 px-3 rounded-lg text-sm font-mono font-medium transition-colors duration-200 border",
                    currentPage() === page
                      ? "bg-blue-50 text-blue-600 border-blue-200"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-transparent"
                  )}>{page}</button>
                )
              )}</For>
            </div>

            <div class="flex sm:hidden items-center gap-2">
              <input type="number" value={pageInput() || currentPage()} onInput={handlePageInput} onKeyDown={handlePageInputKey} min={1} max={totalPages} class="w-14 px-2 py-1.5 text-center text-sm font-mono bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder={currentPage().toString()} />
              <span class="text-xs text-slate-400 font-mono">/ {totalPages}</span>
            </div>

            <button onClick={() => goToPage(currentPage() + 1)} disabled={currentPage() === totalPages} class={cn("icon-btn !w-10 !h-10 disabled:opacity-20 disabled:cursor-not-allowed")} title="Next">
              <svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
            <button onClick={() => goToPage(totalPages)} disabled={currentPage() === totalPages} class={cn("icon-btn !w-10 !h-10 disabled:opacity-20 disabled:cursor-not-allowed")} title="Last page">
              <svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M6 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </Show>
    </div>
  )
}
