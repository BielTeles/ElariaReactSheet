-- ===================================================================
-- APLICAR MIGRAÇÕES DO SISTEMA DE CAMPANHAS
-- Execute este script no SQL Editor do Supabase
-- ===================================================================

-- Primeiro, vamos verificar se as tabelas já existem
-- Se existirem, vamos removê-las para recriar

-- Remover tabelas se existirem (ordem inversa das dependências)
DROP TABLE IF EXISTS public.campaign_backups CASCADE;
DROP TABLE IF EXISTS public.campaign_sessions CASCADE;
DROP TABLE IF EXISTS public.combat_trackers CASCADE;
DROP TABLE IF EXISTS public.campaign_characters CASCADE;
DROP TABLE IF EXISTS public.campaign_invites CASCADE;

-- Tabela para convites de campanha
CREATE TABLE public.campaign_invites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
    invite_code TEXT UNIQUE NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    max_uses INTEGER DEFAULT NULL, -- NULL = ilimitado
    current_uses INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para relacionamento many-to-many entre campanhas e personagens
CREATE TABLE public.campaign_characters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
    character_id UUID REFERENCES public.characters(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    permissions JSONB DEFAULT '{
        "master_can_view": true,
        "master_can_edit": false,
        "public_in_campaign": true
    }',
    linked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(campaign_id, character_id)
);

-- Tabela para rastreadores de combate
CREATE TABLE public.combat_trackers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    current_round INTEGER DEFAULT 1,
    current_turn INTEGER DEFAULT 0,
    participants JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para sessões de campanha
CREATE TABLE public.campaign_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    duration INTEGER, -- em minutos
    participants JSONB DEFAULT '[]', -- array de user_ids
    events JSONB DEFAULT '[]',
    notes TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para backups de campanha
CREATE TABLE public.campaign_backups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
    backup_data JSONB NOT NULL,
    backup_type TEXT DEFAULT 'auto' CHECK (backup_type IN ('auto', 'manual', 'before_update')),
    size_bytes INTEGER,
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================================
-- ÍNDICES PARA PERFORMANCE
-- ===================================================================

-- Índices para convites
CREATE INDEX idx_campaign_invites_campaign_id ON public.campaign_invites(campaign_id);
CREATE INDEX idx_campaign_invites_invite_code ON public.campaign_invites(invite_code);
CREATE INDEX idx_campaign_invites_expires_at ON public.campaign_invites(expires_at);
CREATE INDEX idx_campaign_invites_is_active ON public.campaign_invites(is_active);

-- Índices para personagens da campanha
CREATE INDEX idx_campaign_characters_campaign_id ON public.campaign_characters(campaign_id);
CREATE INDEX idx_campaign_characters_character_id ON public.campaign_characters(character_id);
CREATE INDEX idx_campaign_characters_user_id ON public.campaign_characters(user_id);
CREATE INDEX idx_campaign_characters_is_active ON public.campaign_characters(is_active);

-- Índices para rastreadores de combate
CREATE INDEX idx_combat_trackers_campaign_id ON public.combat_trackers(campaign_id);
CREATE INDEX idx_combat_trackers_is_active ON public.combat_trackers(is_active);
CREATE INDEX idx_combat_trackers_created_by ON public.combat_trackers(created_by);

-- Índices para sessões de campanha
CREATE INDEX idx_campaign_sessions_campaign_id ON public.campaign_sessions(campaign_id);
CREATE INDEX idx_campaign_sessions_started_at ON public.campaign_sessions(started_at);
CREATE INDEX idx_campaign_sessions_created_by ON public.campaign_sessions(created_by);

-- Índices para backups de campanha
CREATE INDEX idx_campaign_backups_campaign_id ON public.campaign_backups(campaign_id);
CREATE INDEX idx_campaign_backups_created_at ON public.campaign_backups(created_at);

-- ===================================================================
-- TRIGGERS PARA UPDATED_AT
-- ===================================================================

-- Trigger para combat_trackers
CREATE TRIGGER update_combat_trackers_updated_at 
    BEFORE UPDATE ON public.combat_trackers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para campaign_sessions
CREATE TRIGGER update_campaign_sessions_updated_at 
    BEFORE UPDATE ON public.campaign_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================================================
-- FUNÇÕES AUXILIARES
-- ===================================================================

-- Função para gerar códigos de convite únicos
CREATE OR REPLACE FUNCTION generate_invite_code() 
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists_code BOOLEAN;
BEGIN
    LOOP
        -- Gerar código de 8 caracteres: 4 letras + 4 números
        code := upper(
            substring(md5(random()::text) from 1 for 4) ||
            lpad(floor(random() * 10000)::text, 4, '0')
        );
        
        -- Verificar se o código já existe
        SELECT EXISTS(
            SELECT 1 FROM public.campaign_invites 
            WHERE invite_code = code
        ) INTO exists_code;
        
        -- Se não existir, retornar o código
        IF NOT exists_code THEN
            RETURN code;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Função para limpeza automática de convites expirados
CREATE OR REPLACE FUNCTION cleanup_expired_invites() 
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Desativar convites expirados
    UPDATE public.campaign_invites 
    SET is_active = false 
    WHERE expires_at < NOW() 
    AND is_active = true;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ===================================================================
-- POLÍTICAS RLS (Row Level Security)
-- ===================================================================

-- Habilitar RLS nas tabelas
ALTER TABLE public.campaign_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.combat_trackers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_backups ENABLE ROW LEVEL SECURITY;

-- Políticas para campaign_invites
CREATE POLICY "Users can view invites for their campaigns" ON public.campaign_invites
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.campaigns 
            WHERE id = campaign_id 
            AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Campaign owners can create invites" ON public.campaign_invites
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.campaigns 
            WHERE id = campaign_id 
            AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Campaign owners can update their invites" ON public.campaign_invites
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.campaigns 
            WHERE id = campaign_id 
            AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Campaign owners can delete their invites" ON public.campaign_invites
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.campaigns 
            WHERE id = campaign_id 
            AND owner_id = auth.uid()
        )
    );

-- Políticas para campaign_characters
CREATE POLICY "Users can view characters in their campaigns" ON public.campaign_characters
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.campaigns 
            WHERE id = campaign_id 
            AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can link their characters to campaigns" ON public.campaign_characters
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their character links" ON public.campaign_characters
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can remove their character links" ON public.campaign_characters
    FOR DELETE USING (user_id = auth.uid());

-- Políticas para combat_trackers
CREATE POLICY "Campaign members can view combat trackers" ON public.combat_trackers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.campaigns 
            WHERE id = campaign_id 
            AND (owner_id = auth.uid() OR auth.uid() = ANY(members::uuid[]))
        )
    );

CREATE POLICY "Campaign owners can manage combat trackers" ON public.combat_trackers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.campaigns 
            WHERE id = campaign_id 
            AND owner_id = auth.uid()
        )
    );

-- Políticas para campaign_sessions
CREATE POLICY "Campaign members can view sessions" ON public.campaign_sessions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.campaigns 
            WHERE id = campaign_id 
            AND (owner_id = auth.uid() OR auth.uid() = ANY(members::uuid[]))
        )
    );

CREATE POLICY "Campaign owners can manage sessions" ON public.campaign_sessions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.campaigns 
            WHERE id = campaign_id 
            AND owner_id = auth.uid()
        )
    );

-- Políticas para campaign_backups
CREATE POLICY "Campaign owners can view backups" ON public.campaign_backups
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.campaigns 
            WHERE id = campaign_id 
            AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Campaign owners can create backups" ON public.campaign_backups
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.campaigns 
            WHERE id = campaign_id 
            AND owner_id = auth.uid()
        )
    );

-- ===================================================================
-- VERIFICAÇÃO FINAL
-- ===================================================================

-- Verificar se todas as tabelas foram criadas
SELECT 
    schemaname,
    tablename,
    tableowner,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE tablename IN (
    'campaign_invites',
    'campaign_characters', 
    'combat_trackers',
    'campaign_sessions',
    'campaign_backups'
)
ORDER BY tablename;

-- Verificar políticas RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd
FROM pg_policies 
WHERE tablename IN (
    'campaign_invites',
    'campaign_characters', 
    'combat_trackers',
    'campaign_sessions',
    'campaign_backups'
)
ORDER BY tablename, policyname; 