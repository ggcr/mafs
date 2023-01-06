import * as React from "react"
import katex from "katex"
import { vec, Vector2 } from "../vec"
import { useScaleContext } from "../view/ScaleContext"
import { useTransformContext } from "./Transform"

interface LatexProps {
  tex: string
  at: Vector2
  macros?: Record<string, string>
}

export function LaTeX({ at: center, tex, macros }: LatexProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const { pixelMatrix } = useScaleContext()
  const transformContext = useTransformContext()

  const transform = vec.matrixMult(pixelMatrix, transformContext)

  // TODO: there's gotta be a better way to do this lol
  const width = 10000
  const height = 10000

  React.useEffect(() => {
    if (!ref.current) return
    const start = performance.now()
    katex.render(tex, ref.current, { macros })
    const durationMs = performance.now() - start
    console.log(`Rendered LaTeX in ${durationMs}ms`)
  }, [tex])

  const pixelCenter = vec.add(vec.transform(center, transform), [-width / 2, -height / 2])

  return (
    <foreignObject
      x={pixelCenter[0]}
      y={pixelCenter[1]}
      width={width}
      height={height}
      pointerEvents="none"
    >
      <div
        style={{
          fontSize: "1.3em",
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
        }}
      >
        <span ref={ref} />
      </div>
    </foreignObject>
  )
}
