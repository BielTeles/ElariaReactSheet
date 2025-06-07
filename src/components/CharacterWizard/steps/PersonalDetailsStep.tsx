import React, { useState } from 'react';
import { CharacterCreation } from '../../../types/character';
import { User, FileText, Smile, BookOpen } from 'lucide-react';
import { ImageUpload } from '../../ui';

interface PersonalDetailsStepProps {
  data: CharacterCreation;
  onUpdate: (data: CharacterCreation) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const PersonalDetailsStep: React.FC<PersonalDetailsStepProps> = ({ data, onUpdate, onNext, onPrevious }) => {
  const [details, setDetails] = useState(data.personalDetails || {});

  const handleChange = (field: string, value: string) => {
    const newDetails = { ...details, [field]: value };
    setDetails(newDetails);
    onUpdate({
      ...data,
      personalDetails: newDetails
    });
  };

  const handleImageChange = (imageData: string | null) => {
    const newDetails = { ...details, portraitImage: imageData || undefined };
    setDetails(newDetails);
    onUpdate({
      ...data,
      personalDetails: newDetails
    });
  };

  const canProceed = !!details.name?.trim();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Cabeçalho */}
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-3">Detalhes Pessoais</h3>
        <p className="text-slate-600">
          Dê vida ao seu personagem com uma identidade única
        </p>
      </div>

      {/* Formulário */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Upload de Imagem */}
        <div className="flex justify-center mb-8">
          <ImageUpload
            currentImage={details.portraitImage}
            onImageChange={handleImageChange}
            size="large"
            label="Retrato do Personagem"
            placeholder="Adicionar imagem"
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Nome */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <User className="w-4 h-4" />
              Nome do Personagem *
            </label>
            <input
              type="text"
              value={details.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Digite o nome do seu personagem..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Este será o nome pelo qual seu personagem será conhecido
            </p>
          </div>
          
          {/* Aparência */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <FileText className="w-4 h-4" />
              Aparência
            </label>
            <input
              type="text"
              value={details.appearance || ''}
              onChange={(e) => handleChange('appearance', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Altura, peso, cor dos olhos, cabelo..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Descreva brevemente a aparência física
            </p>
          </div>
          
          {/* Personalidade */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <Smile className="w-4 h-4" />
              Personalidade
            </label>
            <input
              type="text"
              value={details.personality || ''}
              onChange={(e) => handleChange('personality', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Corajoso, cauteloso, carismático..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Principais traços de personalidade
            </p>
          </div>
        </div>
        
        {/* História Pessoal */}
        <div className="mt-6">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <BookOpen className="w-4 h-4" />
            História Pessoal
          </label>
          <textarea
            value={details.background || ''}
            onChange={(e) => handleChange('background', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            placeholder="Conte a história do seu personagem... De onde veio? O que o motivou a se tornar um aventureiro? Quais são seus objetivos?"
          />
          <p className="text-xs text-gray-500 mt-1">
            A história ajuda o Mestre a integrar seu personagem na narrativa
          </p>
        </div>

        {/* Dica */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-blue-600 text-xl">💡</span>
            <div>
              <h5 className="font-semibold text-blue-800 mb-2">Dicas para Criação</h5>
              <div className="text-blue-700 text-sm space-y-1">
                <p>• <strong>Nome:</strong> Considere a cultura da sua raça escolhida</p>
                <p>• <strong>Aparência:</strong> Lembre-se dos traços da sua raça</p>
                <p>• <strong>Personalidade:</strong> Como suas origens moldaram seu caráter?</p>
                <p>• <strong>História:</strong> Conecte sua origem, classe e patrono escolhidos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <div className="flex justify-between items-center pt-6">
        <button 
          onClick={onPrevious}
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          Anterior
        </button>
        
        <div className="text-center">
          {!canProceed && (
            <p className="text-sm text-orange-600 mb-2">
              O nome do personagem é obrigatório
            </p>
          )}
          <p className="text-sm text-gray-600">
            Apenas o nome é obrigatório
          </p>
        </div>
        
        <button 
          onClick={onNext}
          disabled={!canProceed}
          className={`px-6 py-3 rounded-lg transition-colors ${
            canProceed
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Próximo
        </button>
      </div>
    </div>
  );
};

export default PersonalDetailsStep; 