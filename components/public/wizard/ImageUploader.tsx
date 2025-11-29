"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
    images: string[];
    onChange: (images: string[]) => void;
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            processFiles(Array.from(e.target.files));
        }
    };

    const processFiles = (files: File[]) => {
        const newImages: string[] = [];

        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target?.result) {
                        newImages.push(e.target.result as string);
                        if (newImages.length === files.length) {
                            onChange([...images, ...newImages]);
                        }
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        onChange(newImages);
    };

    return (
        <div className="space-y-4">
            <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging ? "border-yellow-500 bg-yellow-500/10" : "border-white/20 hover:border-white/40 bg-white/5"
                    }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    processFiles(Array.from(e.dataTransfer.files));
                }}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                />
                <div className="flex flex-col items-center gap-4 cursor-pointer">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-yellow-500">
                        <Upload className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Click or Drag Photos Here</h3>
                        <p className="text-white/60 text-sm mt-1">Upload up to 10 photos (JPG, PNG)</p>
                    </div>
                </div>
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((img, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden group border border-white/10">
                            <Image
                                src={img}
                                alt={`Upload ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                            <button
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 rounded-full text-white transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            {index === 0 && (
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs py-1 text-center">
                                    Cover Photo
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
