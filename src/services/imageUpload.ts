const IMGBB_API_KEY = 'f6f560dbdcf0c91aea57b3cd55097799'
const IMGBB_API_URL = 'https://api.imgbb.com/1/upload'

export interface ImageUploadResult {
  success: boolean
  url?: string
  deleteUrl?: string
  displayUrl?: string
  thumbUrl?: string
  error?: string
}

export interface ImageUploadOptions {
  maxSizeMB?: number
  allowedTypes?: string[]
  quality?: number
  maxWidth?: number
  maxHeight?: number
}

export interface ImageMetadata {
  size: number
  type: string
  width?: number
  height?: number
  uploadedAt: string
  originalName: string
}

const DEFAULT_OPTIONS: ImageUploadOptions = {
  maxSizeMB: 32,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'],
  quality: 0.9,
  maxWidth: 2048,
  maxHeight: 2048
}

export const photoService = {
  async validateImage(file: File, options: ImageUploadOptions = {}): Promise<void> {
    const opts = { ...DEFAULT_OPTIONS, ...options }

    if (!file.type.startsWith('image/')) {
      throw new Error('Please select a valid image file')
    }

    if (opts.allowedTypes && !opts.allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed. Allowed types: ${opts.allowedTypes.join(', ')}`)
    }

    const maxSize = (opts.maxSizeMB || 32) * 1024 * 1024
    if (file.size > maxSize) {
      throw new Error(`Image size must be less than ${opts.maxSizeMB}MB`)
    }
  },

  async compressImage(file: File, options: ImageUploadOptions = {}): Promise<Blob> {
    const opts = { ...DEFAULT_OPTIONS, ...options }

    if (file.type === 'image/gif') {
      return file
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e) => {
        const img = new Image()
        img.src = e.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          if (opts.maxWidth && width > opts.maxWidth) {
            height = (height * opts.maxWidth) / width
            width = opts.maxWidth
          }

          if (opts.maxHeight && height > opts.maxHeight) {
            width = (width * opts.maxHeight) / height
            height = opts.maxHeight
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, width, height)

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob)
              } else {
                resolve(file)
              }
            },
            file.type,
            opts.quality
          )
        }
        img.onerror = () => reject(new Error('Failed to load image'))
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
    })
  },

  async uploadImage(
    file: File,
    options: ImageUploadOptions & { name?: string; compress?: boolean } = {}
  ): Promise<ImageUploadResult> {
    try {
      await this.validateImage(file, options)

      let imageToUpload: Blob = file
      if (options.compress !== false && file.type !== 'image/gif') {
        imageToUpload = await this.compressImage(file, options)
      }

      const formData = new FormData()
      formData.append('key', IMGBB_API_KEY)
      formData.append('image', imageToUpload)

      if (options.name) {
        formData.append('name', options.name)
      }

      const response = await fetch(IMGBB_API_URL, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        return {
          success: true,
          url: result.data.url,
          displayUrl: result.data.display_url,
          thumbUrl: result.data.thumb?.url,
          deleteUrl: result.data.delete_url
        }
      } else {
        throw new Error(result.error?.message || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Image upload error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload image'
      }
    }
  },

  async uploadMultipleImages(
    files: FileList | File[],
    options: ImageUploadOptions & { namePrefix?: string; compress?: boolean } = {}
  ): Promise<ImageUploadResult[]> {
    const fileArray = Array.from(files)
    const results: ImageUploadResult[] = []

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i]
      const name = options.namePrefix ? `${options.namePrefix}-${i + 1}` : undefined
      const result = await this.uploadImage(file, { ...options, name })
      results.push(result)
    }

    return results
  },

  async uploadImageFromUrl(imageUrl: string, name?: string): Promise<ImageUploadResult> {
    try {
      const formData = new FormData()
      formData.append('key', IMGBB_API_KEY)
      formData.append('image', imageUrl)

      if (name) {
        formData.append('name', name)
      }

      const response = await fetch(IMGBB_API_URL, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        return {
          success: true,
          url: result.data.url,
          displayUrl: result.data.display_url,
          thumbUrl: result.data.thumb?.url,
          deleteUrl: result.data.delete_url
        }
      } else {
        throw new Error(result.error?.message || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Image upload from URL error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload image from URL'
      }
    }
  },

  async uploadBase64Image(base64String: string, name?: string): Promise<ImageUploadResult> {
    try {
      const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '')

      const formData = new FormData()
      formData.append('key', IMGBB_API_KEY)
      formData.append('image', base64Data)

      if (name) {
        formData.append('name', name)
      }

      const response = await fetch(IMGBB_API_URL, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        return {
          success: true,
          url: result.data.url,
          displayUrl: result.data.display_url,
          thumbUrl: result.data.thumb?.url,
          deleteUrl: result.data.delete_url
        }
      } else {
        throw new Error(result.error?.message || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Base64 image upload error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload base64 image'
      }
    }
  },

  validateImageUrl(url: string): boolean {
    try {
      const urlObj = new URL(url)
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
    } catch {
      return false
    }
  },

  getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e) => {
        const img = new Image()
        img.src = e.target?.result as string
        img.onload = () => {
          resolve({ width: img.width, height: img.height })
        }
        img.onerror = () => reject(new Error('Failed to load image'))
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
    })
  },

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }
}

export default photoService
