"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, Trash2, Move, Type, Palette, Hash } from "lucide-react"

interface TextEntry {
  id: number
  text: string
  font: string
  color: string
  size: number
  x: number
  y: number
}

interface TextEditorProps {
  textEntries: TextEntry[]
  onTextEntriesChange: (entries: TextEntry[]) => void
}

const POPULAR_FONTS = [
  "Impact",
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Georgia",
  "Verdana",
  "Comic Sans MS",
  "Trebuchet MS",
  "Arial Black",
  "Courier New",
]

export default function TextEditor({ textEntries, onTextEntriesChange }: TextEditorProps) {
  const addTextEntry = () => {
    const newEntry: TextEntry = {
      id: Date.now(),
      text: "",
      font: "Impact",
      color: "#FFFFFF",
      size: 32,
      x: 250,
      y: 100 + textEntries.length * 60,
    }
    onTextEntriesChange([...textEntries, newEntry])
  }

  const updateTextEntry = (id: number, updates: Partial<TextEntry>) => {
    onTextEntriesChange(textEntries.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry)))
  }

  const deleteTextEntry = (id: number) => {
    if (textEntries.length > 1) {
      onTextEntriesChange(textEntries.filter((entry) => entry.id !== id))
    }
  }

  const incrementSize = (id: number) => {
    const entry = textEntries.find((e) => e.id === id)
    if (entry && entry.size < 64) {
      updateTextEntry(id, { size: entry.size + 2 })
    }
  }

  const decrementSize = (id: number) => {
    const entry = textEntries.find((e) => e.id === id)
    if (entry && entry.size > 8) {
      updateTextEntry(id, { size: entry.size - 2 })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Type className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold">Text Elements</h2>
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 text-blue-700 dark:text-blue-300 border-0"
          >
            {textEntries.length} Active
          </Badge>
        </div>
        <Button
          onClick={addTextEntry}
          size="sm"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Text
        </Button>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 mb-6">
        <div className="flex items-center space-x-3 text-blue-700 dark:text-blue-300">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Move className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-medium">Interactive Positioning</p>
            <p className="text-sm opacity-80">Drag text directly on the preview to reposition!</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
        {textEntries.map((entry, index) => (
          <Card
            key={entry.id}
            className="relative border-0 shadow-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-in fade-in slide-in-from-left"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  <CardTitle className="text-sm">Text Element {index + 1}</CardTitle>
                </div>
                {textEntries.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTextEntry(entry.id)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-300 hover:scale-110"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Text Area */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Hash className="h-3 w-3" />
                  Text Content
                </label>
                <Textarea
                  placeholder="Enter your meme text here..."
                  value={entry.text}
                  onChange={(e) => updateTextEntry(entry.id, { text: e.target.value })}
                  className="min-h-[80px] resize-none border-2 focus:border-purple-300 dark:focus:border-purple-600 transition-all duration-300"
                  style={{ fontFamily: entry.font }}
                />
              </div>

              {/* Font Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Type className="h-3 w-3" />
                  Font Family
                </label>
                <Select value={entry.font} onValueChange={(value) => updateTextEntry(entry.id, { font: value })}>
                  <SelectTrigger className="border-2 focus:border-purple-300 dark:focus:border-purple-600 transition-all duration-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-0 shadow-2xl">
                    {POPULAR_FONTS.map((font) => (
                      <SelectItem
                        key={font}
                        value={font}
                        style={{ fontFamily: font }}
                        className="hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
                      >
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Color and Size Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Color Picker */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Palette className="h-3 w-3" />
                    Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="relative group">
                      <input
                        type="color"
                        value={entry.color}
                        onChange={(e) => updateTextEntry(entry.id, { color: e.target.value })}
                        className="w-12 h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"></div>
                    </div>
                    <div className="flex-1">
                      <span className="text-xs text-muted-foreground font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                        {entry.color.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Size Controls */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Font Size</label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => decrementSize(entry.id)}
                      disabled={entry.size <= 8}
                      className="h-10 w-10 p-0 border-2 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 hover:scale-110 disabled:opacity-50"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 text-center">
                      <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {entry.size}px
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => incrementSize(entry.id)}
                      disabled={entry.size >= 64}
                      className="h-10 w-10 p-0 border-2 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 hover:scale-110 disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
