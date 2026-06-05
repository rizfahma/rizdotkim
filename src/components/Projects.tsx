import type { CollectionEntry } from "astro:content"
import { createEffect, createSignal, For } from "solid-js"
import ArrowCard from "@components/ArrowCard"
import { cn } from "@lib/utils"

type Props = { tags: string[]; data: CollectionEntry<"projects">[] }

export default function Projects({ data, tags }: Props) {
  const [filter, setFilter] = createSignal(new Set<string>())
  const [projects, setProjects] = createSignal<CollectionEntry<"projects">[]>([])

  createEffect(() => {
    setProjects(data.filter((entry) =>
      Array.from(filter()).every((value) =>
        entry.data.tags.some((tag: string) => tag.toLowerCase() === String(value).toLowerCase())
      )
    ))
  })

  function toggleTag(tag: string) {
    setFilter((prev) => new Set(prev.has(tag) ? [...prev].filter((t) => t !== tag) : [...prev, tag]))
  }

  return (
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-8">
      <div class="sm:col-span-1">
        <div class="sticky top-6">
          <div class="text-xs uppercase tracking-[0.12em] text-slate-500 mb-4">Filter by tag</div>
          <div class="flex flex-wrap sm:flex-col gap-2">
            <For each={tags}>
              {(tag) => (
                <button onClick={() => toggleTag(tag)} class={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors duration-200 border",
                  filter().has(tag)
                    ? "bg-blue-50 text-blue-600 border-blue-200"
                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-slate-900"
                )}>
                  <svg class={cn("size-3.5", filter().has(tag) ? "text-blue-500" : "text-slate-400")} fill="currentColor" viewBox="0 0 24 24">
                    {filter().has(tag) 
                      ? <path d="M10 20l-6-6 1.414-1.414L10 17.172l8.586-8.586L20 10z"/>
                      : <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                    }
                  </svg>
                  <span class="truncate">{tag}</span>
                </button>
              )}
            </For>
          </div>
        </div>
      </div>
      <div class="sm:col-span-3">
        <div class="text-xs uppercase tracking-[0.12em] text-slate-500 mb-4">
          Showing {projects().length} of {data.length} projects
        </div>
        <ul class="flex flex-col gap-4">
          {projects().map((project) => (<li><ArrowCard entry={project} /></li>))}
        </ul>
      </div>
    </div>
  )
}
