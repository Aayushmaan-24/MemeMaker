"use client"

import type React from "react"

import { forwardRef, useEffect, useImperativeHandle, useRef, useState, useCallback } from "react"

interface TextEntry {
  id: number
  text: string
  font: string
  color: string
  size: number
  x: number
  y: number
}

interface MemeCanvasProps {
  imageSrc: string
  textEntries: TextEntry[]
  onTextEntriesChange: (entries: TextEntry[]) => void
}

interface DragState {
  isDragging: boolean
  draggedTextId: number | null
  startX: number
  startY: number
  offsetX: number
  offsetY: number
}

const MemeCanvas = forwardRef<HTMLCanvasElement, MemeCanvasProps>(
  ({ imageSrc, textEntries, onTextEntriesChange }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const imageRef = useRef<HTMLImageElement | null>(null)
    const [dragState, setDragState] = useState<DragState>({
      isDragging: false,
      draggedTextId: null,
      startX: 0,
      startY: 0,
      offsetX: 0,
      offsetY: 0,
    })
    const [hoveredTextId, setHoveredTextId] = useState<number | null>(null)
    const [canvasDimensions, setCanvasDimensions] = useState({ width: 500, height: 500 })
    const [isCanvasReady, setIsCanvasReady] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)

    // Forward the canvas ref
    useImperativeHandle(ref, () => canvasRef.current!)

    // Memoized text drawing function
    const drawText = useCallback(
      (ctx: CanvasRenderingContext2D, entry: TextEntry, canvasWidth: number, canvasHeight: number) => {
        try {
          // Configure text style
          ctx.textAlign = "center"
          ctx.textBaseline = "top"
          ctx.font = `bold ${entry.size}px ${entry.font}, Impact, Arial, sans-serif`
          ctx.fillStyle = entry.color
          ctx.lineWidth = Math.max(1, entry.size / 20)
          ctx.strokeStyle = entry.color === "#FFFFFF" || entry.color === "#ffffff" ? "#000000" : "#FFFFFF"

          // Add hover effect
          if (hoveredTextId === entry.id) {
            ctx.shadowColor = "rgba(0, 123, 255, 0.5)"
            ctx.shadowBlur = 10
          } else {
            ctx.shadowColor = "transparent"
            ctx.shadowBlur = 0
          }

          // Split text by line breaks
          const lines = entry.text.split("\n")
          const lineHeight = entry.size * 1.2

          lines.forEach((line, index) => {
            const yPosition = entry.y + index * lineHeight

            // Only draw if within canvas bounds
            if (yPosition >= 0 && yPosition <= canvasHeight && line.trim()) {
              // Draw stroke for better visibility
              ctx.strokeText(line, entry.x, yPosition)
              // Draw fill text
              ctx.fillText(line, entry.x, yPosition)
            }
          })

          // Reset shadow
          ctx.shadowColor = "transparent"
          ctx.shadowBlur = 0
        } catch (error) {
          console.error("Error drawing text:", error)
        }
      },
      [hoveredTextId],
    )

    // Optimized canvas drawing function
    const drawCanvas = useCallback(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      if (imageRef.current && imageLoaded) {
        try {
          const image = imageRef.current
          // Set canvas dimensions
          const canvasWidth = 500
          const aspectRatio = image.width / image.height
          const canvasHeight = canvasWidth / aspectRatio

          // Only update dimensions if they changed
          if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
            canvas.width = canvasWidth
            canvas.height = canvasHeight
            setCanvasDimensions({ width: canvasWidth, height: canvasHeight })
          }

          // Clear canvas
          ctx.clearRect(0, 0, canvasWidth, canvasHeight)

          // Draw image
          ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight)

          // Draw all text entries
          textEntries.forEach((entry) => {
            if (entry.text.trim()) {
              drawText(ctx, entry, canvasWidth, canvasHeight)
            }
          })

          if (!isCanvasReady) {
            setIsCanvasReady(true)
          }
        } catch (error) {
          console.error("Error drawing canvas:", error)
        }
      }
    }, [imageLoaded, textEntries, drawText, isCanvasReady])

    // Load image when imageSrc changes
    useEffect(() => {
      setImageLoaded(false)
      setIsCanvasReady(false)

      const image = new Image()
      image.crossOrigin = "anonymous"

      image.onload = () => {
        imageRef.current = image
        setImageLoaded(true)
      }

      image.onerror = () => {
        console.error("Failed to load image:", imageSrc)
        // Create a placeholder image
        const canvas = document.createElement("canvas")
        canvas.width = 500
        canvas.height = 500
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.fillStyle = "#f3f4f6"
          ctx.fillRect(0, 0, 500, 500)
          ctx.fillStyle = "#9ca3af"
          ctx.font = "20px system-ui"
          ctx.textAlign = "center"
          ctx.fillText("Image not found", 250, 250)
        }

        const placeholderImage = new Image()
        placeholderImage.src = canvas.toDataURL()
        placeholderImage.onload = () => {
          imageRef.current = placeholderImage
          setImageLoaded(true)
        }
      }

      image.src = imageSrc
    }, [imageSrc])

    // Draw canvas when image loads or text changes
    useEffect(() => {
      if (imageLoaded) {
        // Use requestAnimationFrame to prevent ResizeObserver issues
        const timeoutId = setTimeout(() => {
          requestAnimationFrame(drawCanvas)
        }, 0)

        return () => clearTimeout(timeoutId)
      }
    }, [imageLoaded, drawCanvas])

    const getCanvasCoordinates = useCallback(
      (clientX: number, clientY: number) => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return { x: 0, y: 0 }

        const rect = container.getBoundingClientRect()
        const scaleX = canvasDimensions.width / rect.width
        const scaleY = canvasDimensions.height / rect.height

        return {
          x: (clientX - rect.left) * scaleX,
          y: (clientY - rect.top) * scaleY,
        }
      },
      [canvasDimensions],
    )

    const getTextAtPosition = useCallback(
      (x: number, y: number): TextEntry | null => {
        // Check in reverse order (top to bottom in rendering)
        for (let i = textEntries.length - 1; i >= 0; i--) {
          const entry = textEntries[i]
          if (!entry.text.trim()) continue

          const lines = entry.text.split("\n")
          const lineHeight = entry.size * 1.2

          // Create a rough bounding box for the text
          const textWidth = entry.size * 0.6 * Math.max(...lines.map((line) => line.length)) // Approximate
          const textHeight = lines.length * lineHeight

          const left = entry.x - textWidth / 2
          const right = entry.x + textWidth / 2
          const top = entry.y
          const bottom = entry.y + textHeight

          if (x >= left && x <= right && y >= top && y <= bottom) {
            return entry
          }
        }
        return null
      },
      [textEntries],
    )

    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        if (!isCanvasReady) return

        const coords = getCanvasCoordinates(e.clientX, e.clientY)
        const textAtPosition = getTextAtPosition(coords.x, coords.y)

        if (textAtPosition) {
          setDragState({
            isDragging: true,
            draggedTextId: textAtPosition.id,
            startX: coords.x,
            startY: coords.y,
            offsetX: coords.x - textAtPosition.x,
            offsetY: coords.y - textAtPosition.y,
          })
        }
      },
      [isCanvasReady, getCanvasCoordinates, getTextAtPosition],
    )

    const handleMouseMove = useCallback(
      (e: React.MouseEvent) => {
        if (!isCanvasReady) return

        const coords = getCanvasCoordinates(e.clientX, e.clientY)

        if (dragState.isDragging && dragState.draggedTextId) {
          // Update the position of the dragged text
          const newX = coords.x - dragState.offsetX
          const newY = coords.y - dragState.offsetY

          // Constrain to canvas bounds
          const constrainedX = Math.max(0, Math.min(canvasDimensions.width, newX))
          const constrainedY = Math.max(0, Math.min(canvasDimensions.height, newY))

          const updatedEntries = textEntries.map((entry) =>
            entry.id === dragState.draggedTextId ? { ...entry, x: constrainedX, y: constrainedY } : entry,
          )
          onTextEntriesChange(updatedEntries)
        } else {
          // Handle hover effects
          const textAtPosition = getTextAtPosition(coords.x, coords.y)
          setHoveredTextId(textAtPosition?.id || null)
        }
      },
      [
        isCanvasReady,
        getCanvasCoordinates,
        dragState,
        canvasDimensions,
        textEntries,
        onTextEntriesChange,
        getTextAtPosition,
      ],
    )

    const handleMouseUp = useCallback(() => {
      setDragState({
        isDragging: false,
        draggedTextId: null,
        startX: 0,
        startY: 0,
        offsetX: 0,
        offsetY: 0,
      })
    }, [])

    const handleMouseLeave = useCallback(() => {
      setHoveredTextId(null)
      handleMouseUp()
    }, [handleMouseUp])

    // Touch events for mobile support
    const handleTouchStart = useCallback(
      (e: React.TouchEvent) => {
        if (!isCanvasReady) return

        e.preventDefault()
        const touch = e.touches[0]
        const coords = getCanvasCoordinates(touch.clientX, touch.clientY)
        const textAtPosition = getTextAtPosition(coords.x, coords.y)

        if (textAtPosition) {
          setDragState({
            isDragging: true,
            draggedTextId: textAtPosition.id,
            startX: coords.x,
            startY: coords.y,
            offsetX: coords.x - textAtPosition.x,
            offsetY: coords.y - textAtPosition.y,
          })
        }
      },
      [isCanvasReady, getCanvasCoordinates, getTextAtPosition],
    )

    const handleTouchMove = useCallback(
      (e: React.TouchEvent) => {
        if (!isCanvasReady) return

        e.preventDefault()
        if (dragState.isDragging && dragState.draggedTextId) {
          const touch = e.touches[0]
          const coords = getCanvasCoordinates(touch.clientX, touch.clientY)

          const newX = coords.x - dragState.offsetX
          const newY = coords.y - dragState.offsetY

          const constrainedX = Math.max(0, Math.min(canvasDimensions.width, newX))
          const constrainedY = Math.max(0, Math.min(canvasDimensions.height, newY))

          const updatedEntries = textEntries.map((entry) =>
            entry.id === dragState.draggedTextId ? { ...entry, x: constrainedX, y: constrainedY } : entry,
          )
          onTextEntriesChange(updatedEntries)
        }
      },
      [isCanvasReady, dragState, getCanvasCoordinates, canvasDimensions, textEntries, onTextEntriesChange],
    )

    const handleTouchEnd = useCallback(
      (e: React.TouchEvent) => {
        e.preventDefault()
        handleMouseUp()
      },
      [handleMouseUp],
    )

    return (
      <div className="flex flex-col items-center">
        <div
          ref={containerRef}
          className="relative w-full max-w-md mx-auto"
          style={{ cursor: hoveredTextId ? "move" : "default" }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-auto border rounded-md shadow-md"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: "none" }}
          />
          {!isCanvasReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-md">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </div>
            </div>
          )}
        </div>
      </div>
    )
  },
)

MemeCanvas.displayName = "MemeCanvas"

export default MemeCanvas
