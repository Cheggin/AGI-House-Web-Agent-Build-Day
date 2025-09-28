import React, { useCallback, useState } from 'react';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  accept?: string;
  maxSize?: number;
  minimal?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileUpload,
  accept = ".json",
  maxSize = 5 * 1024 * 1024,
  minimal = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const validateFile = useCallback((file: File): boolean => {
    setError(null);

    if (!file.name.endsWith('.json')) {
      setError('Please upload a JSON file');
      return false;
    }

    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      return false;
    }

    return true;
  }, [maxSize]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        if (validateFile(files[0])) {
          setFileName(files[0].name);
          onFileUpload(files[0]);
        }
      }
    },
    [onFileUpload, validateFile]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      if (validateFile(files[0])) {
        setFileName(files[0].name);
        onFileUpload(files[0]);
      }
    }
  };

  if (minimal) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
            isDragging
              ? 'border-emerald-500 bg-emerald-500/10'
              : 'border-gray-800 hover:border-gray-700 bg-gray-950/50'
          }`}
        >
          <input
            type="file"
            id="file-upload"
            className="sr-only"
            accept={accept}
            onChange={handleFileChange}
          />

          {fileName ? (
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-gray-400 font-mono">{fileName}</span>
            </div>
          ) : (
            <>
              <svg
                className="mx-auto h-12 w-12 text-gray-600 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>

              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center px-6 py-3 text-sm font-medium text-black bg-emerald-500 rounded-full hover:bg-emerald-400 transition-all transform hover:scale-105"
              >
                Choose file
              </label>
              <p className="mt-3 text-sm text-gray-500">
                or drag and drop
              </p>
            </>
          )}

          <p className="mt-4 text-xs text-gray-600 font-mono">
            JSON • MAX {maxSize / (1024 * 1024)}MB
          </p>

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragging
            ? 'border-orange-500 bg-orange-500/10'
            : 'border-gray-800 hover:border-gray-700 bg-gray-950'
        }`}
      >
        <input
          type="file"
          id="file-upload"
          className="sr-only"
          accept={accept}
          onChange={handleFileChange}
        />

        <svg
          className="mx-auto h-12 w-12 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>

        <div className="mt-4">
          {fileName ? (
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-gray-400">{fileName}</span>
            </div>
          ) : (
            <>
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center px-6 py-3 text-sm font-medium text-black bg-emerald-500 rounded-full hover:bg-emerald-400 transition-all transform hover:scale-105"
              >
                Choose file
              </label>
              <p className="mt-2 text-sm text-gray-500">
                or drag and drop your JSON file here
              </p>
            </>
          )}
        </div>

        <p className="mt-2 text-xs text-gray-600 font-mono">
          JSON files up to {maxSize / (1024 * 1024)}MB
        </p>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;