import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { CharacterCreation } from '../../types/character';
import AttributesStep from './steps/AttributesStep';
import RaceStep from './steps/RaceStep';
import ClassStep from './steps/ClassStep';
import SubclassStep from './steps/SubclassStep';
import SubclassAbilitiesStep from './steps/SubclassAbilitiesStep';
import OriginStep from './steps/OriginStep';
import DeityStep from './steps/DeityStep';
import SkillsStep from './steps/SkillsStep';
import PersonalDetailsStep from './steps/PersonalDetailsStep';
import SummaryStep from './steps/SummaryStep';

const WizardContainer: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  const [characterData, setCharacterData] = useState<CharacterCreation>({
    step: 1,
    attributes: {},
    selectedSkills: [],
    equipment: [],
    personalDetails: {}
  });

  const steps = [
    { id: 1, name: 'Atributos', component: AttributesStep },
    { id: 2, name: 'Raça', component: RaceStep },
    { id: 3, name: 'Classe', component: ClassStep },
    { id: 4, name: 'Subclasse', component: SubclassStep },
    { id: 5, name: 'Habilidades', component: SubclassAbilitiesStep },
    { id: 6, name: 'Origem', component: OriginStep },
    { id: 7, name: 'Divindade', component: DeityStep },
    { id: 8, name: 'Perícias', component: SkillsStep },
    { id: 9, name: 'Detalhes', component: PersonalDetailsStep },
    { id: 10, name: 'Resumo', component: SummaryStep }
  ];

  const getCurrentStepComponent = () => {
    const step = steps.find(s => s.id === currentStep);
    if (!step) return null;
    
    const StepComponent = step.component;
    return (
      <StepComponent
        data={characterData}
        onUpdate={setCharacterData}
        onNext={() => nextStep()}
        onPrevious={() => previousStep()}
      />
    );
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      setCharacterData(prev => ({ ...prev, step: currentStep + 1 }));
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setCharacterData(prev => ({ ...prev, step: currentStep - 1 }));
    }
  };

  const canProceed = () => {
    // Validação básica por etapa
    switch (currentStep) {
      case 1: // Atributos
        return Object.values(characterData.attributes).length === 6;
      case 2: // Raça
        return !!characterData.race;
      case 3: // Classe
        return !!characterData.mainClass;
      case 4: // Subclasse
        return !!characterData.subclass;
      case 5: // Habilidades de Subclasse
        return characterData.selectedSubclassAbilities?.length === 2;
      case 6: // Origem
        return !!characterData.origin;
      case 7: // Divindade (opcional)
        return true;
      case 8: // Perícias
        return characterData.selectedSkills.length > 0;
      case 9: // Detalhes
        return !!characterData.personalDetails.name;
      default:
        return true;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-fantasy font-bold text-slate-800">
            Criar Personagem - {steps.find(s => s.id === currentStep)?.name}
          </h2>
          <span className="text-sm text-slate-500">
            Etapa {currentStep} de {steps.length}
          </span>
        </div>
        
        {/* Step indicators */}
        <div className="flex justify-between mb-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex flex-col items-center cursor-pointer transition-all duration-200 ${
                step.id <= currentStep ? 'opacity-100' : 'opacity-50'
              }`}
              onClick={() => step.id < currentStep && setCurrentStep(step.id)}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step.id < currentStep
                    ? 'bg-natureza-500 text-white'
                    : step.id === currentStep
                    ? 'bg-agua-500 text-white'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {step.id < currentStep ? <Check size={16} /> : step.id}
              </div>
              <span className="text-xs mt-1 text-center font-medium">{step.name}</span>
            </div>
          ))}
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-agua-500 to-natureza-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[500px]">
        {getCurrentStepComponent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
        <button
          onClick={() => currentStep === 1 ? navigate('/characters') : previousStep()}
          className="btn-secondary flex items-center space-x-2"
        >
          <ArrowLeft size={20} />
          <span>{currentStep === 1 ? 'Cancelar' : 'Anterior'}</span>
        </button>

        <div className="text-sm text-slate-500">
          {!canProceed() && currentStep < steps.length && 'Preencha os campos obrigatórios para continuar'}
        </div>

        <button
          onClick={currentStep === steps.length ? () => console.log('Finalizar') : nextStep}
          disabled={!canProceed()}
          className={`flex items-center space-x-2 ${
            canProceed() ? 'btn-primary' : 'btn-secondary opacity-50 cursor-not-allowed'
          }`}
        >
          <span>{currentStep === steps.length ? 'Finalizar' : 'Próximo'}</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default WizardContainer; 