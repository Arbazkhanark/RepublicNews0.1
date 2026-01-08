"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, ImageIcon, Video, File } from "lucide-react";

interface MediaUploaderProps {
  onUpload: (url: string) => void;
}

export function MediaUploader({ onUpload }: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      // In a real app, you would upload to your storage service
      // For now, we'll create a mock URL
      setUploading(true);

      // Simulate upload delay
      setTimeout(() => {
        const mockUrl = `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(
          file.name
        )}`;
        onUpload(mockUrl);
        setUploading(false);
      }, 1000);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="space-y-4">
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Upload className="h-12 w-12 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-medium">
                Drop files here or click to upload
              </p>
              <p className="text-sm text-muted-foreground">
                Supports images (JPG, PNG, GIF) and videos (MP4, MOV)
              </p>
            </div>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Choose Files"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
        <div className="flex items-center space-x-1">
          <ImageIcon className="h-4 w-4" />
          <span>Images</span>
        </div>
        <div className="flex items-center space-x-1">
          <Video className="h-4 w-4" />
          <span>Videos</span>
        </div>
        <div className="flex items-center space-x-1">
          <File className="h-4 w-4" />
          <span>Max 10MB per file</span>
        </div>
      </div>
    </div>
  );
}
