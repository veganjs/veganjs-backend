export type UploadFileOptions = {
  destination?: string
  allowedMimetypes?: string[]
  maxFileSize?: number
  rename?: (fileName: string) => string
}
