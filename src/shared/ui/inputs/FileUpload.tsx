import { Dropzone } from '@mantine/dropzone';
import React, { useCallback, useState } from 'react';

import { Attachment } from '@/types';

interface FileUploadProps {
  accept?: string[];
  className?: string;
  files: File[];
  maxFiles?: number;
  maxSize?: number; // in MB
  onChange: (files: Attachment[]) => void;
  value: Attachment[];
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png'],
  className = '',
  files = [],
  maxFiles = 5,
  maxSize = 10,
  onChange,
  value = [],
}) => {
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
    async (files: File[]) => {
      const newErrors: string[] = [];
      const validFiles: File[] = [];

      // Check total files limit
      if (value.length + files.length > maxFiles) {
        newErrors.push(`Maximum ${maxFiles} files allowed`);
        setErrors(newErrors);
        return;
      }

      // Validate each file
      files.forEach((file) => {
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
    [value, maxFiles, validateFile, onChange],
  );

  return (
    <Dropzone
      accept={accept}
      maxSize={maxSize}
      maxFiles={maxFiles}
      className={className}
      multiple={maxFiles !== 1}
      onDrop={(e) => e && handleFiles(e)}
    />
  );
};

export default FileUpload;
