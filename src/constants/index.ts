// ===================================================================
// CONSTANTES CENTRALIZADAS - ELARIA RPG
// ===================================================================

/**
 * Versão atual da aplicação
 */
export const APP_VERSION = '1.1.0';

/**
 * Chaves para localStorage
 */
export const STORAGE_KEYS = {
  CHARACTERS: 'elaria-characters',
  BACKUP: 'elaria-characters-backup',
  CONFIG: 'elaria-config',
  HISTORY_PREFIX: 'elaria-characters-history-',
  USER_DATA: 'elaria-user-data',
  SESSION_TOKEN: 'elaria-session-token',
} as const;

/**
 * Configuração padrão de auto-salvamento
 */
export const AUTO_SAVE_CONFIG = {
  ENABLED: true,
  INTERVAL: 30000, // 30 segundos
  MAX_VERSIONS: 5,
} as const;

/**
 * Limites e validações de personagem
 */
export const CHARACTER_LIMITS = {
  MIN_ATTRIBUTE_VALUE: -1,
  MAX_ATTRIBUTE_VALUE: 15,
  INITIAL_ATTRIBUTE_POINTS: 6,
  BONUS_ATTRIBUTE_POINTS: 7, // Com penalidade opcional
  MIN_RESOURCE_VALUE: 0,
  MAX_NAME_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 1000,
} as const;

/**
 * Atributos do sistema Elaria
 */
export const ATTRIBUTES = {
  FORCA: 'forca',
  DESTREZA: 'destreza', 
  CONSTITUICAO: 'constituicao',
  INTELIGENCIA: 'inteligencia',
  SABEDORIA: 'sabedoria',
  CARISMA: 'carisma',
} as const;

/**
 * Labels legíveis dos atributos
 */
export const ATTRIBUTE_LABELS = {
  [ATTRIBUTES.FORCA]: 'Força',
  [ATTRIBUTES.DESTREZA]: 'Destreza',
  [ATTRIBUTES.CONSTITUICAO]: 'Constituição',
  [ATTRIBUTES.INTELIGENCIA]: 'Inteligência',
  [ATTRIBUTES.SABEDORIA]: 'Sabedoria',
  [ATTRIBUTES.CARISMA]: 'Carisma',
} as const;

/**
 * Essências primordiais vinculadas aos atributos
 */
export const ATTRIBUTE_ESSENCES = {
  [ATTRIBUTES.FORCA]: 'Vontade Indomável',
  [ATTRIBUTES.DESTREZA]: 'Fluxo Incessante',
  [ATTRIBUTES.CONSTITUICAO]: 'Resiliência Eterna',
  [ATTRIBUTES.INTELIGENCIA]: 'Olhar Penetrante',
  [ATTRIBUTES.SABEDORIA]: 'Sentir Profundo',
  [ATTRIBUTES.CARISMA]: 'Chama Interior',
} as const;

/**
 * Raças disponíveis
 */
export const RACES = {
  ALARI: 'alari',
  ROKNAR: 'roknar',
  KAIN: 'kain',
  FAELAN: 'faelan',
  CELERES: 'celeres',
  AURIEN: 'aurien',
  VESPERI: 'vesperi',
} as const;

/**
 * Classes principais
 */
export const MAIN_CLASSES = {
  EVOCADOR: 'evocador',
  TITÃ: 'titã',
  SENTINELA: 'sentinela',
  ELO: 'elo',
} as const;

/**
 * Elementos/Caminhos Elementais para Evocadores
 */
export const ELEMENTS = {
  TERRA: 'terra',
  AGUA: 'agua',
  AR: 'ar',
  FOGO: 'fogo',
  LUZ: 'luz',
  SOMBRA: 'sombra',
} as const;

/**
 * Divindades/Patronos
 */
export const DEITIES = {
  IGNIS: 'ignis',
  ONDINA: 'ondina', 
  TERRUS: 'terrus',
  ZEPHYRUS: 'zephyrus',
  LUMINA: 'lumina',
  NOCTUS: 'noctus',
} as const;

/**
 * Tipos de teste de resistência
 */
export const RESISTANCE_TYPES = {
  FORTITUDE: 'fortitude',
  REFLEXOS: 'reflexos',
  VONTADE: 'vontade',
} as const;

/**
 * Graus de sucesso
 */
export const SUCCESS_GRADES = {
  EXTREME_FAILURE: 'extreme_failure',
  NORMAL_FAILURE: 'normal_failure',
  NORMAL_SUCCESS: 'normal_success',
  GOOD_SUCCESS: 'good_success',
  EXTREME_SUCCESS: 'extreme_success',
} as const;

/**
 * Tipos de equipamento
 */
export const EQUIPMENT_TYPES = {
  WEAPON: 'weapon',
  ARMOR: 'armor',
  ITEM: 'item',
} as const;

/**
 * Configurações de interface
 */
export const UI_CONFIG = {
  MAX_MOBILE_WIDTH: 768,
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 300,
  AUTO_HIDE_DELAY: 3000,
} as const;

/**
 * Mensagens de erro comuns
 */
export const ERROR_MESSAGES = {
  REQUIRED_NAME: 'Nome do personagem é obrigatório',
  INVALID_ATTRIBUTE: 'Valor inválido para atributo',
  ATTRIBUTE_TOO_LOW: 'Valor muito baixo para atributo',
  ATTRIBUTE_TOO_HIGH: 'Valor muito alto para atributo', 
  NEGATIVE_RESOURCES: 'Valores de recursos não podem ser negativos',
  CORRUPTED_DATA: 'Dados corrompidos detectados',
  SAVE_FAILED: 'Falha ao salvar personagem',
  LOAD_FAILED: 'Falha ao carregar personagem',
  INVALID_JSON: 'Formato JSON inválido',
} as const;

/**
 * Mensagens de sucesso
 */
export const SUCCESS_MESSAGES = {
  CHARACTER_SAVED: 'Personagem salvo com sucesso',
  CHARACTER_DELETED: 'Personagem excluído com sucesso',
  CHARACTER_IMPORTED: 'Personagem importado com sucesso',
  BACKUP_RESTORED: 'Backup restaurado com sucesso',
  DATA_EXPORTED: 'Dados exportados com sucesso',
} as const;

/**
 * Configurações de validação de imagem
 */
export const IMAGE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  COMPRESSION_QUALITY: 0.8,
  MAX_DIMENSIONS: { width: 800, height: 800 },
} as const;

/**
 * Rotas da aplicação
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  CHARACTERS: '/characters',
  CHARACTER_NEW: '/characters/new',
  CHARACTER_DETAIL: '/characters/:id',
  CHARACTER_SHEET: '/character-sheet',
  REFERENCE: '/reference',
} as const;

/**
 * Configurações de autenticação
 */
export const AUTH_CONFIG = {
  SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 horas em millisegundos
  REMEMBER_ME_DURATION: 30 * 24 * 60 * 60 * 1000, // 30 dias em millisegundos
  MIN_PASSWORD_LENGTH: 6,
  MAX_USERNAME_LENGTH: 20,
  PASSWORD_PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
} as const;

/**
 * Mensagens de erro de autenticação
 */
export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Email ou senha incorretos',
  USER_NOT_FOUND: 'Usuário não encontrado',
  EMAIL_ALREADY_EXISTS: 'Este email já está em uso',
  USERNAME_ALREADY_EXISTS: 'Este nome de usuário já está em uso',
  WEAK_PASSWORD: 'A senha deve ter pelo menos 6 caracteres, incluindo uma letra maiúscula, uma minúscula e um número',
  PASSWORDS_DONT_MATCH: 'As senhas não coincidem',
  REQUIRED_EMAIL: 'Email é obrigatório',
  REQUIRED_PASSWORD: 'Senha é obrigatória',
  REQUIRED_USERNAME: 'Nome de usuário é obrigatório',
  INVALID_EMAIL: 'Email inválido',
  SESSION_EXPIRED: 'Sessão expirada. Faça login novamente',
  LOGIN_REQUIRED: 'Você precisa estar logado para acessar esta página',
} as const;

/**
 * Mensagens de sucesso de autenticação
 */
export const AUTH_SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login realizado com sucesso',
  REGISTER_SUCCESS: 'Conta criada com sucesso',
  LOGOUT_SUCCESS: 'Logout realizado com sucesso',
  PROFILE_UPDATED: 'Perfil atualizado com sucesso',
} as const; 