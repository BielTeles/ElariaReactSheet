import React, { useState } from 'react';
import { 
  FileText, Plus, Edit3, Trash2, Save, X, Search, 
  Tag, Calendar, User, Sword, MapPin, BookOpen,
  Filter, ChevronDown, ChevronUp
} from 'lucide-react';
import { CharacterNote } from '../../types/interactive';

interface NotesSystemProps {
  notes: CharacterNote[];
  onAddNote: (note: Omit<CharacterNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateNote: (id: string, note: Partial<CharacterNote>) => void;
  onDeleteNote: (id: string) => void;
}

const NotesSystem: React.FC<NotesSystemProps> = ({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote
}) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

  // Estado do formulário
  const [newNote, setNewNote] = useState<Partial<CharacterNote>>({
    title: '',
    content: '',
    category: 'geral' as CharacterNote['category'],
    tags: [],
    isPrivate: false
  });

  const [editingNote, setEditingNote] = useState<CharacterNote | null>(null);
  const [showPrivateNotes, setShowPrivateNotes] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'geral' as CharacterNote['category'],
    tags: '',
    isPrivate: false
  });

  const categoryConfig = {
    general: { name: 'Geral', icon: FileText, color: 'blue' },
    character: { name: 'Personagem', icon: User, color: 'purple' },
    session: { name: 'Sessão', icon: Calendar, color: 'green' },
    plot: { name: 'Enredo', icon: BookOpen, color: 'indigo' },
    combat: { name: 'Combate', icon: Sword, color: 'red' },
    custom: { name: 'Personalizada', icon: Tag, color: 'gray' }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'geral' as CharacterNote['category'],
      tags: '',
      isPrivate: false
    });
  };

  const handleSaveNote = () => {
    if (!formData.title.trim() || !formData.content.trim()) return;

    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    if (editingNoteId) {
      onUpdateNote(editingNoteId, {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        tags: tagsArray,
        isPrivate: formData.isPrivate,
        updatedAt: new Date()
      });
      setEditingNoteId(null);
    } else {
      onAddNote({
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        tags: tagsArray,
        isPrivate: formData.isPrivate
      });
      setIsAddingNote(false);
    }

    resetForm();
  };

  const handleEditNote = (note: CharacterNote) => {
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category,
      tags: note.tags.join(', '),
      isPrivate: note.isPrivate
    });
    setEditingNoteId(note.id);
    setIsAddingNote(true);
  };

  const handleCancelEdit = () => {
    setIsAddingNote(false);
    setEditingNoteId(null);
    resetForm();
  };

  const toggleNoteExpansion = (noteId: string) => {
    const newExpanded = new Set(expandedNotes);
    if (newExpanded.has(noteId)) {
      newExpanded.delete(noteId);
    } else {
      newExpanded.add(noteId);
    }
    setExpandedNotes(newExpanded);
  };

  // Filtrar notas
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Agrupar notas por categoria
  const groupedNotes = filteredNotes.reduce((acc, note) => {
    if (!acc[note.category]) {
      acc[note.category] = [];
    }
    acc[note.category].push(note);
    return acc;
  }, {} as Record<string, CharacterNote[]>);

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Sistema de Notas ({notes.length})
          </h3>
          <button
            onClick={() => setIsAddingNote(true)}
            className="flex items-center gap-2 px-3 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Nota
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Controles de Busca e Filtro */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            {/* Busca */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar notas, tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por categoria */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Todas as Categorias</option>
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Formulário de Nova Nota / Edição */}
        {isAddingNote && (
          <div className="mb-6 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800">
                {editingNoteId ? 'Editar Nota' : 'Nova Nota'}
              </h4>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Título da nota..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Categoria e Privacidade */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as CharacterNote['category']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {Object.entries(categoryConfig).map(([key, config]) => (
                      <option key={key} value={key}>{config.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPrivate}
                      onChange={(e) => setFormData({...formData, isPrivate: e.target.checked})}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Nota Privada</span>
                  </label>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="combate, importante, história..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Conteúdo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conteúdo *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Escreva o conteúdo da nota..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-vertical"
                />
              </div>

              {/* Botões */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveNote}
                  disabled={!formData.title.trim() || !formData.content.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {editingNoteId ? 'Atualizar' : 'Salvar'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Notas */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">
              {notes.length === 0 ? 'Nenhuma nota criada' : 'Nenhuma nota encontrada'}
            </h3>
            <p className="text-gray-400">
              {notes.length === 0 
                ? 'Crie sua primeira nota para começar a organizar informações importantes!'
                : 'Tente ajustar os filtros ou buscar por outros termos.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedNotes).map(([category, categoryNotes]) => {
              const config = categoryConfig[category as keyof typeof categoryConfig];
              const IconComponent = config.icon;
              
              return (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-3">
                    <IconComponent className={`w-5 h-5 text-${config.color}-600`} />
                    <h4 className={`font-semibold text-${config.color}-800`}>
                      {config.name} ({categoryNotes.length})
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {categoryNotes.map((note) => {
                      const isExpanded = expandedNotes.has(note.id);
                      const previewContent = note.content.length > 150 
                        ? note.content.substring(0, 150) + '...'
                        : note.content;
                      
                      return (
                        <div 
                          key={note.id} 
                          className={`bg-gradient-to-r from-${config.color}-50 to-${config.color}-100 rounded-lg border border-${config.color}-200 p-4`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className={`font-semibold text-${config.color}-800`}>
                                  {note.title}
                                </h5>
                                {note.isPrivate && (
                                  <span className="text-xs bg-gray-500 text-white px-2 py-1 rounded-full">
                                    Privada
                                  </span>
                                )}
                              </div>
                              
                              {/* Tags */}
                              {note.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {note.tags.map((tag, index) => (
                                    <span 
                                      key={index}
                                      className={`text-xs bg-${config.color}-200 text-${config.color}-700 px-2 py-1 rounded-full`}
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleNoteExpansion(note.id)}
                                className={`text-${config.color}-600 hover:text-${config.color}-800 transition-colors`}
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => handleEditNote(note)}
                                className={`text-${config.color}-600 hover:text-${config.color}-800 transition-colors`}
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onDeleteNote(note.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Conteúdo */}
                          <div className={`text-sm text-${config.color}-700 leading-relaxed mb-3`}>
                            {isExpanded ? note.content : previewContent}
                          </div>

                          {/* Metadados */}
                          <div className={`text-xs text-${config.color}-600 flex items-center justify-between`}>
                            <span>
                              Criada: {formatDate(note.createdAt)}
                            </span>
                            {note.updatedAt && note.updatedAt !== note.createdAt && (
                              <span>
                                Editada: {formatDate(note.updatedAt)}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesSystem; 