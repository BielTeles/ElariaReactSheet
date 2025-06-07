// ===================================================================
// UTILITÁRIOS DE VALIDAÇÃO - ELARIA RPG
// ===================================================================

import { CharacterCreation } from '../types/character';
import { CharacterState } from '../types/interactive';
import { 
  CHARACTER_LIMITS, 
  ERROR_MESSAGES, 
  IMAGE_CONFIG,
  ATTRIBUTES 
} from '../constants';

/**
 * Resultado de validação
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Opções de validação
 */
export interface ValidationOptions {
  strict?: boolean; // Validação rigorosa para criação vs. permissiva para edição
  allowEmpty?: boolean; // Permitir campos vazios
}

/**
 * Valida dados completos do personagem
 */
export function validateCharacterData(
  data: CharacterCreation, 
  state: CharacterState,
  options: ValidationOptions = {}
): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  // Validar dados pessoais
  const personalValidation = validatePersonalDetails(data.personalDetails, options);
  result.errors.push(...personalValidation.errors);
  result.warnings.push(...personalValidation.warnings);

  // Validar atributos
  if (data.attributes && Object.keys(data.attributes).length > 0) {
    const attributeValidation = validateAttributes(data.attributes, options);
    result.errors.push(...attributeValidation.errors);
    result.warnings.push(...attributeValidation.warnings);
  }

  // Validar estado do personagem
  const stateValidation = validateCharacterState(state, options);
  result.errors.push(...stateValidation.errors);
  result.warnings.push(...stateValidation.warnings);

  // Validar perícias se presentes
  if (data.skillValues) {
    const skillValidation = validateSkills(data.skillValues, options);
    result.errors.push(...skillValidation.errors);
    result.warnings.push(...skillValidation.warnings);
  }

  result.isValid = result.errors.length === 0;
  return result;
}

/**
 * Valida detalhes pessoais do personagem
 */
export function validatePersonalDetails(
  details: CharacterCreation['personalDetails'],
  options: ValidationOptions = {}
): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  if (!details) {
    if (!options.allowEmpty) {
      result.errors.push(ERROR_MESSAGES.REQUIRED_NAME);
    }
    result.isValid = false;
    return result;
  }

  // Validar nome
  if (!details.name || details.name.trim() === '') {
    if (!options.allowEmpty) {
      result.errors.push(ERROR_MESSAGES.REQUIRED_NAME);
    }
  } else if (details.name.length > CHARACTER_LIMITS.MAX_NAME_LENGTH) {
    result.errors.push(`Nome muito longo (máximo ${CHARACTER_LIMITS.MAX_NAME_LENGTH} caracteres)`);
  }

  // Validar descrições
  const textFields = ['appearance', 'personality', 'background'] as const;
  textFields.forEach(field => {
    const value = details[field];
    if (value && value.length > CHARACTER_LIMITS.MAX_DESCRIPTION_LENGTH) {
      result.errors.push(`${field} muito longo (máximo ${CHARACTER_LIMITS.MAX_DESCRIPTION_LENGTH} caracteres)`);
    }
  });

  // Validar imagem se presente
  if (details.portraitImage) {
    const imageValidation = validateImage(details.portraitImage);
    result.errors.push(...imageValidation.errors);
    result.warnings.push(...imageValidation.warnings);
  }

  result.isValid = result.errors.length === 0;
  return result;
}

/**
 * Valida atributos do personagem
 */
export function validateAttributes(
  attributes: Record<string, number>,
  options: ValidationOptions = {}
): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  const validAttributeKeys = Object.values(ATTRIBUTES);

  for (const [attributeKey, value] of Object.entries(attributes)) {
    // Verificar se é um atributo válido
    if (!validAttributeKeys.includes(attributeKey as any)) {
      result.warnings.push(`Atributo desconhecido: ${attributeKey}`);
      continue;
    }

    // Verificar se é um número
    if (typeof value !== 'number' || isNaN(value)) {
      result.errors.push(`${ERROR_MESSAGES.INVALID_ATTRIBUTE} ${attributeKey}: deve ser um número`);
      continue;
    }

    // Verificar limites
    if (value < CHARACTER_LIMITS.MIN_ATTRIBUTE_VALUE) {
      result.errors.push(
        `${ERROR_MESSAGES.ATTRIBUTE_TOO_LOW} ${attributeKey}: ${value} ` +
        `(mínimo ${CHARACTER_LIMITS.MIN_ATTRIBUTE_VALUE})`
      );
    }

    // Para validação estrita (criação), verificar limites superiores
    if (options.strict && value > 5) {
      result.warnings.push(
        `Valor alto para ${attributeKey}: ${value} - ` +
        'valores acima de 5 são raros na criação inicial'
      );
    } else if (value > CHARACTER_LIMITS.MAX_ATTRIBUTE_VALUE) {
      result.warnings.push(
        `${ERROR_MESSAGES.ATTRIBUTE_TOO_HIGH} ${attributeKey}: ${value} ` +
        `(máximo recomendado ${CHARACTER_LIMITS.MAX_ATTRIBUTE_VALUE})`
      );
    }
  }

  result.isValid = result.errors.length === 0;
  return result;
}

/**
 * Valida estado do personagem (recursos atuais)
 */
export function validateCharacterState(
  state: CharacterState,
  options: ValidationOptions = {}
): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  // Verificar valores negativos
  const resources = ['currentHP', 'currentMP', 'currentVigor'] as const;
  resources.forEach(resource => {
    const value = state[resource];
    if (typeof value === 'number' && value < CHARACTER_LIMITS.MIN_RESOURCE_VALUE) {
      result.errors.push(`${ERROR_MESSAGES.NEGATIVE_RESOURCES}: ${resource}`);
    }
  });

  // Nota: Validação de valores máximos requer contexto dos dados do personagem
  // e será feita no nível de validateCharacterData quando necessário

  result.isValid = result.errors.length === 0;
  return result;
}

/**
 * Valida perícias do personagem
 */
export function validateSkills(
  skills: Record<string, number>,
  options: ValidationOptions = {}
): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  for (const [skillName, value] of Object.entries(skills)) {
    if (typeof value !== 'number' || isNaN(value)) {
      result.errors.push(`Valor inválido para perícia ${skillName}: deve ser um número`);
      continue;
    }

    if (value < 0) {
      result.errors.push(`Valor de perícia não pode ser negativo: ${skillName}`);
    }

    // Valores muito altos podem indicar erro
    if (value > 20) {
      result.warnings.push(`Valor muito alto para perícia ${skillName}: ${value}`);
    }
  }

  result.isValid = result.errors.length === 0;
  return result;
}

/**
 * Valida imagem de retrato
 */
export function validateImage(imageData: string): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  try {
    // Verificar se é base64 válido
    if (!imageData.startsWith('data:image/')) {
      result.errors.push('Formato de imagem inválido - deve ser base64');
      result.isValid = false;
      return result;
    }

    // Extrair tipo MIME
    const mimeMatch = imageData.match(/data:([^;]+);/);
    if (!mimeMatch) {
      result.errors.push('Tipo MIME da imagem não encontrado');
      result.isValid = false;
      return result;
    }

    const mimeType = mimeMatch[1];
    if (!(IMAGE_CONFIG.ACCEPTED_FORMATS as readonly string[]).includes(mimeType)) {
      result.errors.push(
        `Formato de imagem não suportado: ${mimeType}. ` +
        `Formatos aceitos: ${IMAGE_CONFIG.ACCEPTED_FORMATS.join(', ')}`
      );
    }

    // Verificar tamanho aproximado (base64 é ~33% maior que o arquivo original)
    const sizeInBytes = (imageData.length * 3) / 4;
    if (sizeInBytes > IMAGE_CONFIG.MAX_SIZE) {
      result.errors.push(
        `Imagem muito grande: ${Math.round(sizeInBytes / 1024 / 1024)}MB. ` +
        `Máximo permitido: ${Math.round(IMAGE_CONFIG.MAX_SIZE / 1024 / 1024)}MB`
      );
    }

  } catch (error) {
    result.errors.push('Erro ao validar imagem: dados corrompidos');
  }

  result.isValid = result.errors.length === 0;
  return result;
}

/**
 * Valida se um valor está dentro dos limites de atributo
 */
export function isValidAttributeValue(value: number, strict = false): boolean {
  return value >= CHARACTER_LIMITS.MIN_ATTRIBUTE_VALUE && 
         value <= (strict ? 5 : CHARACTER_LIMITS.MAX_ATTRIBUTE_VALUE);
}

/**
 * Valida formato de JSON
 */
export function validateJSON(jsonString: string): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  try {
    JSON.parse(jsonString);
  } catch (error) {
    result.errors.push(ERROR_MESSAGES.INVALID_JSON);
    result.isValid = false;
  }

  return result;
}

/**
 * Sanitiza string removendo caracteres perigosos
 */
export function sanitizeString(input: string): string {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < e >
    .replace(/\s+/g, ' '); // Normaliza espaços
}

/**
 * Valida se um ID é válido
 */
export function validateId(id: string): boolean {
  return typeof id === 'string' && 
         id.length > 0 && 
         id.length <= 100 && 
         /^[a-zA-Z0-9\-_]+$/.test(id);
} 