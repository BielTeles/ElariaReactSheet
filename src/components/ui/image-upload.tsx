import React, { useRef, useState } from 'react';
import { Upload, X, User, Camera } from 'lucide-react';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (imageData: string | null) => void;
  size?: 'small' | 'medium' | 'large';
  label?: string;
  placeholder?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImage,
  onImageChange,
  size = 'medium',
  label = 'Imagem do Personagem',
  placeholder = 'Clique para adicionar uma imagem'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);

  const sizeClasses = {
    small: 'w-20 h-20',
    medium: 'w-32 h-32',
    large: 'w-48 h-48'
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageChange(result);
      setLoading(false);
    };
    reader.onerror = () => {
      alert('Erro ao carregar a imagem.');
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRemoveImage = () => {
    onImageChange(null);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div
        className={`${sizeClasses[size]} mx-auto relative rounded-lg border-2 border-dashed transition-all duration-200 ${
          dragOver 
            ? 'border-blue-400 bg-blue-50' 
            : currentImage 
            ? 'border-gray-300 bg-gray-50' 
            : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
        } cursor-pointer group`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : currentImage ? (
          <>
            <img
              src={currentImage}
              alt="Imagem do personagem"
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openFileDialog();
                  }}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  title="Alterar imagem"
                >
                  <Camera size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="Remover imagem"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            {dragOver ? (
              <>
                <Upload className="w-8 h-8 text-blue-500 mb-2" />
                <p className="text-sm text-blue-600 font-medium">Solte a imagem aqui</p>
              </>
            ) : (
              <>
                <User className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-xs text-gray-600 font-medium">{placeholder}</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG até 5MB</p>
              </>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {currentImage && (
        <div className="text-center">
          <button
            onClick={handleRemoveImage}
            className="text-sm text-red-600 hover:text-red-700 font-medium underline"
          >
            Remover imagem
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 