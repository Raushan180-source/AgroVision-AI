import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, ImageIcon } from 'lucide-react'

export default function ImageUploader({ onImageSelect, preview, onClear }) {
  const onDrop = useCallback((accepted) => {
    if (accepted[0]) onImageSelect(accepted[0])
  }, [onImageSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })

  if (preview) {
    return (
      <div className="relative rounded-2xl overflow-hidden border-2 border-primary-200 dark:border-primary-800">
        <img src={preview} alt="Crop preview" className="w-full h-72 object-cover" />
        <button
          onClick={onClear}
          className="absolute top-3 right-3 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <p className="text-white text-sm font-medium flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Image ready for analysis
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
        isDragActive
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
          : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
          isDragActive ? 'bg-primary-100 dark:bg-primary-900/40' : 'bg-gray-100 dark:bg-gray-800'
        }`}>
          <Upload className={`w-7 h-7 ${isDragActive ? 'text-primary-600' : 'text-gray-400'}`} />
        </div>
        <div>
          <p className="font-semibold text-gray-700 dark:text-gray-300">
            {isDragActive ? 'Drop your image here' : 'Drag & drop crop image'}
          </p>
          <p className="text-sm text-gray-500 mt-1">or <span className="text-primary-600 font-medium">browse files</span></p>
          <p className="text-xs text-gray-400 mt-2">JPG, PNG, WEBP up to 10MB</p>
        </div>
      </div>
    </div>
  )
}
