import { createSignal, createMemo, For, Show } from "solid-js"
import Fuse from "fuse.js"
import ArrowCard from "@components/ArrowCard"

type SearchItem = {
  collection: string
  slug: string
  title: string
  summary: string
  tags: string[]
}

type Props = { data: SearchItem[] }

export default function Search({ data }: Props) {
  const [query, setQuery] = createSignal("")

  const fuse = new Fuse(data, {
    keys: [
      { name: "title", weight: 0.5 },
      { name: "summary", weight: 0.3 },
      { name: "tags", weight: 0.2 },
    ],
    includeMatches: true,
    minMatchCharLength: 1,
    threshold: 0.4,
    ignoreLocation: true,
  })

  const liveResults = createMemo(() => {
    const q = query().trim()
    if (q.length < 1) return []
    return fuse.search(q).map((r) => r.item)
  })

  const onInput = (e: Event) => {
    setQuery((e.target as HTMLInputElement).value)
  }

  const onClear = () => {
    setQuery("")
  }

  return (
    <div class="flex flex-col gap-8">
      <div class="relative">
        <input
          name="search"
          type="text"
          value={query()}
          onInput={onInput}
          autocomplete="off"
          spellcheck={false}
          placeholder="Search posts & projects..."
          class="w-full px-5 py-4 pl-12 pr-12 outline-none text-slate-900 bg-white border border-slate-300 rounded-xl focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all duration-200"
        />
        <svg class="absolute size-5 left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0118 0z"/></svg>
        <Show when={query().length > 0}>
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            class="absolute right-3 top-1/2 -translate-y-1/2 size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </Show>
      </div>

      <Show when={query().trim().length > 0}>
        <Show
          when={liveResults().length > 0}
          fallback={
            <div class="text-center py-12">
              <div class="text-slate-400 text-sm font-mono mb-2">∅</div>
              <p class="text-slate-500 text-sm">
                No results for <span class="text-slate-900 font-medium">"{query()}"</span>
              </p>
              <p class="text-slate-400 text-xs mt-1">Try a different keyword.</p>
            </div>
          }
        >
          <div>
            <div class="text-[0.625rem] uppercase tracking-[0.25em] text-slate-400 mb-4 flex items-center gap-2">
              <span>{liveResults().length} {liveResults().length === 1 ? "result" : "results"}</span>
              <span class="flex-1 h-px bg-slate-200"></span>
              <span class="font-mono text-slate-300">for "{query()}"</span>
            </div>
            <ul class="flex flex-col gap-4">
              <For each={liveResults()}>{(result) => (
                <li>
                  <ArrowCard
                    entry={
                      { collection: result.collection, slug: result.slug, data: { title: result.title, summary: result.summary, date: new Date(), tags: result.tags }, body: "" } as any
                    }
                    pill={true}
                  />
                </li>
              )}</For>
            </ul>
          </div>
        </Show>
      </Show>

      <Show when={query().trim().length === 0}>
        <div class="text-center py-8">
          <div class="text-[0.625rem] uppercase tracking-[0.25em] text-slate-400 mb-3">index</div>
          <p class="text-slate-500 text-sm">
            Searching across <span class="text-slate-900 font-medium">{data.length}</span> entries — posts and projects.
          </p>
          <p class="text-slate-400 text-xs mt-1">Type to begin.</p>
        </div>
      </Show>
    </div>
  )
}
