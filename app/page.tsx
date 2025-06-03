"use client"

import type React from "react"

import { useState, useRef } from "react"
import TemplateGallery from "@/components/template-gallery"
import MemeCanvas from "@/components/meme-canvas"
import TextEditor from "@/components/text-editor"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Zap, Palette, Github, Linkedin, ShoppingBag, Download } from "lucide-react"

// Template data structure for easy management
import { memeTemplates } from "@/data/meme-templates"

interface TextEntry {
  id: number
  text: string
  font: string
  color: string
  size: number
  x: number
  y: number
}

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>(memeTemplates[0].url)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [textEntries, setTextEntries] = useState<TextEntry[]>([
    {
      id: 1,
      text: "",
      font: "Impact",
      color: "#FFFFFF",
      size: 32,
      x: 250,
      y: 50,
    },
  ])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleTemplateSelect = (templateUrl: string) => {
    setSelectedTemplate(templateUrl)
    setUploadedImage(null)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDownloadClick = () => {
    if (canvasRef.current) {
      const link = document.createElement("a")
      link.download = `epic-meme-${Date.now()}.png`
      link.href = canvasRef.current.toDataURL("image/png")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const currentImageSrc = uploadedImage || selectedTemplate

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-40 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <main className="relative container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-1000">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg animate-pulse-slow">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold gradient-text">Meme Generator</h1>
            <div
              className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg animate-pulse-slow"
              style={{ animationDelay: "1s" }}
            >
              <Zap className="h-8 w-8 text-white" />
            </div>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Create viral memes with our powerful editor. Drag, drop, customize, and share your creativity with the
            world.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <div className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full text-green-700 dark:text-green-300 text-sm font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Free Forever
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium">
              <Palette className="w-3 h-3" />
              No Watermarks
            </div>
            <a
              href="http://tee.pub/lic/062WiYH1FLI"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-700 dark:text-purple-300 text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-800/30 transition-colors"
            >
              <ShoppingBag className="w-3 h-3" />
              My merch
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Panel */}
          <div className="space-y-6 animate-in fade-in slide-in-from-left duration-1000 delay-300">
            <Card className="overflow-hidden border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl hover-lift">
              <Tabs defaultValue="templates" className="w-full">
                <TabsList className="grid w-full grid-cols-2 m-4 mb-0 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
                  <TabsTrigger
                    value="templates"
                    className="rounded-lg transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:scale-105"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Templates
                  </TabsTrigger>
                  <TabsTrigger
                    value="upload"
                    className="rounded-lg transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:scale-105"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Upload
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="templates" className="m-0">
                  <CardContent className="p-6">
                    <TemplateGallery
                      templates={memeTemplates}
                      onSelectTemplate={handleTemplateSelect}
                      selectedTemplate={selectedTemplate}
                    />
                  </CardContent>
                </TabsContent>

                <TabsContent value="upload" className="m-0">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                      <div className="group relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-2xl mb-6 p-6 transition-all duration-300 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer w-full h-full flex flex-col items-center justify-center"
                        >
                          <div className="flex flex-col items-center transition-all duration-300 group-hover:scale-110">
                            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1">
                              Drop your image here
                            </p>
                            <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
                          </div>
                          <input
                            id="image-upload"
                            type="file"
                            className="hidden"
                            accept="image/png, image/jpeg"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                      {uploadedImage && (
                        <div className="relative w-full max-w-xs animate-in fade-in zoom-in duration-500">
                          <img
                            src={uploadedImage || "/placeholder.svg"}
                            alt="Uploaded"
                            className="w-full h-auto rounded-xl object-cover shadow-lg"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 rounded-full w-8 h-8 p-0 shadow-lg hover:scale-110 transition-all duration-300"
                            onClick={() => setUploadedImage(null)}
                          >
                            ×
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </TabsContent>
              </Tabs>
            </Card>

            <Card className="overflow-hidden border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl hover-lift">
              <CardContent className="p-6">
                <TextEditor textEntries={textEntries} onTextEntriesChange={setTextEntries} />
              </CardContent>
            </Card>
          </div>

          {/* Right Panel */}
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-1000 delay-500">
            <Card className="overflow-hidden border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                    <Palette className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold">Live Preview</h2>
                  <div className="ml-auto px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full text-green-700 dark:text-green-300 text-xs font-medium">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      Live
                    </div>
                  </div>
                </div>
                <MemeCanvas
                  imageSrc={currentImageSrc}
                  textEntries={textEntries}
                  onTextEntriesChange={setTextEntries}
                  ref={canvasRef}
                />
              </CardContent>
            </Card>

            <div className="flex justify-center animate-in fade-in slide-in-from-bottom duration-1000 delay-700">
              <Button
                onClick={handleDownloadClick}
                className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 px-8 py-6 text-lg font-semibold rounded-2xl group animate-gradient"
                style={{ backgroundSize: "200% 200%" }}
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="relative flex items-center gap-3">
                  <Download className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  Download Meme
                  <Sparkles className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 flex flex-col items-center animate-in fade-in duration-1000 delay-1000">
          <div className="flex items-center justify-center gap-6 mb-4">
            <a
              href="https://github.com/Aayushmaan-24/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full hover:scale-110 transition-transform duration-300 hover:shadow-lg"
            >
              <Github className="h-6 w-6 text-slate-700 dark:text-slate-300" />
            </a>
            <a
              href="https://www.linkedin.com/in/aayushmaanchakraborty/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full hover:scale-110 transition-transform duration-300 hover:shadow-lg"
            >
              <Linkedin className="h-6 w-6 text-slate-700 dark:text-slate-300" />
            </a>
          </div>
          <p className="text-muted-foreground">Made with ❤️ for meme creators worldwide</p>
        </div>
      </main>
    </div>
  )
}
