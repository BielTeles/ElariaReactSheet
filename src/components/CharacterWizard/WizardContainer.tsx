import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { CharacterCreation } from '../../types/character';
import { classes } from '../../data/classes';
import AttributesStep from './steps/AttributesStep';
import RaceStep from './steps/RaceStep';
import ClassStep from './steps/ClassStep';
import SubclassStep from './steps/SubclassStep';
import SubclassAbilitiesStep from './steps/SubclassAbilitiesStep';
import OriginStep from './steps/OriginStep';
import DeityStep from './steps/DeityStep';
import SkillsStep from './steps/SkillsStep';
import CombatSkillsStep from './steps/CombatSkillsStep';
import EquipmentStep from './steps/EquipmentStep';
import PersonalDetailsStep from './steps/PersonalDetailsStep';
import SummaryStep from './steps/SummaryStep';

const WizardContainer: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  const [characterData, setCharacterData] = useState<CharacterCreation>({
    attributes: {}
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
    { id: 9, name: 'Combate', component: CombatSkillsStep },
    { id: 10, name: 'Equipamento', component: EquipmentStep },
    { id: 11, name: 'Detalhes', component: PersonalDetailsStep },
    { id: 12, name: 'Resumo', component: SummaryStep }
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

  const finalizeCharacter = () => {
    // O SummaryStep irá lidar com a finalização
    // Este método pode ser usado para validações finais se necessário
    console.log('Finalizando personagem:', characterData);
  };

  const goToStep = (stepId: number) => {
    if (stepId < currentStep) {
      setCurrentStep(stepId);
      setCharacterData(prev => ({ ...prev, step: stepId }));
    }
  };

  const handleCancel = () => {
    // Rolar para o topo antes de navegar
    scrollToTop();
    // Pequeno delay para permitir o scroll antes da navegação
    setTimeout(() => {
      navigate('/characters');
    }, 200);
  };

  const canProceed = () => {
    // Validação básica por etapa
    switch (currentStep) {
      case 1: // Atributos
        // Verificar se todos os 6 atributos foram definidos e se os pontos foram distribuídos
        const hasAllAttributes = Object.keys(characterData.attributes || {}).length === 6;
        const allAttributesValid = Object.values(characterData.attributes || {}).every(val => 
          typeof val === 'number' && val >= -1 && val <= 10 // Máximo realista com 6-7 pontos
        );
        return hasAllAttributes && allAttributesValid;
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
        return true; // Sempre pode prosseguir (é opcional)
      case 8: // Perícias
        const classData = characterData.mainClass ? classes[characterData.mainClass] : null;
        const skillChoices = classData?.skillChoices || 0;
        const selectedClassSkills = characterData.selectedClassSkills?.length || 0;
        const isKain = characterData.race === 'kain';
        const selectedRaceSkills = characterData.selectedRaceSkills?.length || 0;
        return selectedClassSkills === skillChoices && (!isKain || selectedRaceSkills === 2);
      case 9: // Equipamento
        return !!characterData.initialGold; // Deve ter rolado os Elfens
      case 10: // Detalhes Pessoais
        return !!characterData.personalDetails?.name;
      case 11: // Resumo
        const isKainWithoutBonus = characterData.race === 'kain' && !characterData.selectedAttributeBonus;
        return !isKainWithoutBonus; // Kain deve ter escolhido o bônus de atributo
      default:
        return true;
    }
  };

  // Função utilitária para scroll mais robusta
  const scrollToTop = () => {
    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    console.log(`📏 Posição atual do scroll: ${currentScrollY}px`);
    
    // Tentar múltiplas abordagens para garantir que o scroll funcione
    try {
      // Método 1: window.scrollTo com behavior smooth
      window.scrollTo({ top: 0, behavior: 'smooth' });
      console.log('✅ window.scrollTo executado');
    } catch (e) {
      // Fallback: scroll instantâneo se smooth não funcionar
      window.scrollTo(0, 0);
      console.log('⚡ Fallback scroll instantâneo executado');
    }
    
    // Método 2: tentar rolar o body
    try {
      document.body.scrollTop = 0;
      console.log('✅ body.scrollTop = 0 executado');
    } catch (e) {
      // Ignorar se não funcionar
      console.log('❌ body.scrollTop falhou');
    }
    
    // Método 3: tentar rolar o document element
    try {
      document.documentElement.scrollTop = 0;
      console.log('✅ documentElement.scrollTop = 0 executado');
    } catch (e) {
      // Ignorar se não funcionar
      console.log('❌ documentElement.scrollTop falhou');
    }
    
    // Método 4: tentar encontrar o container principal
    try {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.scrollTop = 0;
        console.log('✅ main.scrollTop = 0 executado');
      } else {
        console.log('❌ Elemento main não encontrado');
      }
    } catch (e) {
      // Ignorar se não funcionar
      console.log('❌ main.scrollTop falhou');
    }
    
    // Verificar após tentativas
    setTimeout(() => {
      const newScrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      console.log(`📏 Nova posição do scroll: ${newScrollY}px`);
    }, 50);
  };

  useEffect(() => {
    // Rolar para o topo da página quando o componente é renderizado
    scrollToTop();
  }, []);

  // UseEffect para rolar para o topo sempre que mudar de step
  useEffect(() => {
    console.log(`🔄 Mudança de step detectada: ${currentStep}`);
    
    // Usar setTimeout para garantir que o DOM foi atualizado
    const timer = setTimeout(() => {
      console.log(`📜 Executando scroll para o topo (step ${currentStep})`);
      scrollToTop();
    }, 150); // Aumentei o delay para 150ms

    return () => clearTimeout(timer);
  }, [currentStep]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-800">
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
              onClick={() => goToStep(step.id)}
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
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
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
          onClick={() => currentStep === 1 ? handleCancel() : previousStep()}
          className="btn-secondary flex items-center space-x-2"
        >
          <ArrowLeft size={20} />
          <span>{currentStep === 1 ? 'Cancelar' : 'Anterior'}</span>
        </button>

        <div className="text-sm text-slate-500">
          {!canProceed() && currentStep < steps.length && 'Preencha os campos obrigatórios para continuar'}
        </div>

        <button
          onClick={currentStep === steps.length ? finalizeCharacter : nextStep}
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