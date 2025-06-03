"use client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import type { MemeTemplate } from "@/data/meme-templates"

interface TemplateGalleryProps {
  templates: MemeTemplate[]
  onSelectTemplate: (templateUrl: string) => void
  selectedTemplate: string
}

export default function TemplateGallery({ templates, onSelectTemplate, selectedTemplate }: TemplateGalleryProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-lg font-semibold">Choose Your Template</h2>
        <Badge
          variant="secondary"
          className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 text-purple-700 dark:text-purple-300 border-0"
        >
          {templates.length} Available
        </Badge>
      </div>
      <ScrollArea className="h-[400px] w-full pr-4 custom-scrollbar">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {templates.map((template, index) => (
            <div
              key={template.id}
              className={`group relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-in fade-in zoom-in ${
                selectedTemplate === template.url
                  ? "border-purple-500 ring-4 ring-purple-200 dark:ring-purple-800 shadow-2xl scale-105 glow-purple"
                  : "border-transparent hover:border-purple-300 dark:hover:border-purple-600"
              }`}
              onClick={() => onSelectTemplate(template.url)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={template.url || "/placeholder.svg"}
                  alt={template.name}
                  className="w-full h-32 object-cover transition-all duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

                {/* Category badge */}
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                  <Badge className="bg-white/90 text-slate-700 text-xs font-medium backdrop-blur-sm">
                    {template.category}
                  </Badge>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-3">
                <p className="text-sm font-medium truncate">{template.name}</p>
              </div>

              {/* Selection indicator */}
              {selectedTemplate === template.url && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
