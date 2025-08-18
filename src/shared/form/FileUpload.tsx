import { UploadIcon, WarningCircleIcon, XIcon } from '@phosphor-icons/react';
import React, { useCallback, useState } from 'react';

import { Attachment } from '@/types';

interface FileUploadProps {
  accept?: string;
  className?: string;
  maxFiles?: number;
  maxSize?: number; // in MB
  onChange: (files: Attachment[]) => void;
  value: Attachment[];
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept = '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png',
  className = '',
  maxFiles = 5,
  maxSize = 10,
  onChange,
  value = [],
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validateFile = (file: File): null | string => {
    if (file.size > maxSize * 1024 * 1024) {
      return `File ${file.name} is too large (max ${maxSize}MB)`;
    }

    const extension = file.name.toLowerCase().split('.').pop();
    const allowedExtensions = accept.split(',').map((ext) => ext.trim().replace('.', ''));

    if (extension && !allowedExtensions.includes(extension)) {
      return `File ${file.name} has unsupported format`;
    }

    return null;
  };

  const handleFiles = useCallback(
    async (files: FileList) => {
      const newErrors: string[] = [];
      const validFiles: File[] = [];

      // Check total files limit
      if (value.length + files.length > maxFiles) {
        newErrors.push(`Maximum ${maxFiles} files allowed`);
        setErrors(newErrors);
        return;
      }

      // Validate each file
      Array.from(files).forEach((file) => {
        const error = validateFile(file);
        if (error) {
          newErrors.push(error);
        } else {
          validFiles.push(file);
        }
      });

      if (newErrors.length > 0) {
        setErrors(newErrors);
        return;
      }

      // Convert files to base64 and create attachments
      const attachmentPromises = validFiles.map(async (file): Promise<Attachment> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            resolve({
              base64Content: base64.split(',')[1], // Remove data URL prefix
              fileName: file.name,
              fileSize: file.size,
              id: `temp_${Date.now()}_${Math.random()}`,
              mimeType: file.type,
              uploadedAt: new Date().toISOString(),
              uploadedBy: 'current_user', // You might want to get this from context
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      try {
        const newAttachments = await Promise.all(attachmentPromises);
        onChange([...value, ...newAttachments]);
        setErrors([]);
      } catch (error) {
        setErrors(['Failed to process files']);
      }
    },
    [value, onChange, maxFiles, maxSize, accept],
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles],
  );

  const removeFile = (id: string) => {
    onChange(value.filter((file) => file.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDrag}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
      >
        <UploadIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 mb-2">
          Drag and drop files here, or{' '}
          <label className="text-blue-600 hover:text-blue-700 cursor-pointer underline">
            browse
            <input
              type="file"
              accept={accept}
              className="hidden"
              multiple
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
          </label>
        </p>
        <p className="text-xs text-gray-500">
          Max {maxSize}MB per file, up to {maxFiles} files
        </p>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          {errors.map((error, index) => (
            <div key={index} className="flex items-center text-sm text-red-600">
              <WarningCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          ))}
        </div>
      )}

      {/* File List */}
      {value.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Attached Files:</h4>
          {value.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
            >
              <div className="flex items-center min-w-0 flex-1">
                <FileTextIcon className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{file.fileName}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.fileSize)}</p>
                </div>
              </div>
              <button
                className="ml-3 p-1 text-gray-400 hover:text-red-500 transition-colors"
                onClick={() => removeFile(file.id)}
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
