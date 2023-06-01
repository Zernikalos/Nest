export interface FileFormats {
  label: string
  value: "gltf" | "obj"
  extensions: string[]
}

export interface FormatFile {
  path: string
  name: string
  format: "gltf" | "obj"
}
