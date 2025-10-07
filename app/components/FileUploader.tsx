import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { formatSize } from '../lib/utils'

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;
        onFileSelect?.(file);
    }, [onFileSelect]);

    const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

    const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf'] },
        maxSize: maxFileSize,
    });

    const file = acceptedFiles[0] || null;

    return (
        <div className="w-full gradient-border p-1 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,0,0.4)]">
            <div 
                {...getRootProps()} 
                className={`cursor-pointer rounded-xl transition-all duration-300 min-h-[200px] flex items-center justify-center ${
                    isDragActive
                        ? 'bg-[rgba(0,255,0,0.1)] border-2 border-green-400 shadow-[0_0_20px_rgba(0,255,0,0.2)]'
                        : 'bg-black border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] hover:shadow-[0_0_15px_rgba(0,255,0,0.1)]'
                }`}
            >
                <input {...getInputProps()} />

                <div className="space-y-4 p-4 md:p-6 flex flex-col items-center">
                    {file ? (
                        <div 
                            className="flex flex-col sm:flex-row items-center sm:justify-between p-4 rounded-xl border border-[rgba(0,255,0,0.3)] bg-[rgba(0,255,0,0.05)] w-full transition-all duration-300 hover:bg-[rgba(0,255,0,0.1)] hover:shadow-[0_0_15px_rgba(0,255,0,0.15)] hover:border-[rgba(0,255,0,0.4)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img src="/images/pdf.png" alt="pdf" className="w-12 h-12 sm:w-10 sm:h-10" />
                            <div className="flex items-center space-x-3 flex-1 px-4 min-w-0">
                                <div>
                                    <p className="text-sm font-medium text-[var(--color-text-primary)] truncate max-w-xs">
                                        {file.name}
                                    </p>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        {formatSize(file.size)}
                                    </p>
                                </div>
                            </div>
                            <button 
                                className="p-2 hover:bg-[rgba(255,255,255,0.1)] rounded-full transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onFileSelect?.(null)
                                }}
                            >
                                <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="py-8 flex flex-col items-center">
                            <div className="mx-auto w-24 h-24 flex items-center justify-center mb-4 glass-effect rounded-full transition-all duration-300 hover:scale-105">
                                <img src="/icons/info.svg" alt="upload" className="w-14 h-14 opacity-50" />
                            </div>
                            <p className="text-lg text-[var(--color-text-secondary)] text-center">
                                <span className="font-semibold text-[var(--color-text-primary)]">
                                    Click to upload
                                </span> or drag and drop
                            </p>
                            <p className="text-sm md:text-lg text-[var(--color-text-secondary)] text-center mt-2">
                                PDF (max {formatSize(maxFileSize)})
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FileUploader
