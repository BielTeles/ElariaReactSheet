-- ===================================================================
-- SCHEMA DO BANCO DE DADOS - ELARIA RPG
-- ===================================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================================================
-- TABELA DE PERFIS DE USUÁRIO
-- ===================================================================

CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    preferences JSONB DEFAULT '{
        "theme": "auto",
        "language": "pt-BR",
        "auto_save": true,
        "notifications": true,
        "auto_backup": true,
        "share_characters": false
    }',
    statistics JSONB DEFAULT '{
        "characters_created": 0,
        "total_play_time": 0,
        "favorite_class": null,
        "favorite_race": null,
        "last_character_created": null
    }',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================================
-- TABELA DE PERSONAGENS
-- ===================================================================

CREATE TABLE public.characters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    data JSONB NOT NULL,
    version INTEGER DEFAULT 1,
    is_public BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    backup JSONB DEFAULT '{
        "previous_versions": [],
        "last_backup": null
    }',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================================
-- TABELA DE CAMPANHAS
-- ===================================================================

CREATE TABLE public.campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    members JSONB DEFAULT '[]',
    characters TEXT[] DEFAULT '{}',
    settings JSONB DEFAULT '{
        "is_public": false,
        "allow_character_sharing": true,
        "max_characters_per_player": 3,
        "auto_backup": true,
        "rules": {
            "allow_multiclass": true,
            "starting_level": 1,
            "use_optional_rules": false
        }
    }',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================================
-- TABELA DE LOGS DE ATIVIDADE
-- ===================================================================

CREATE TABLE public.activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET
);

-- ===================================================================
-- ÍNDICES PARA PERFORMANCE
-- ===================================================================

-- Índices para personagens
CREATE INDEX idx_characters_user_id ON public.characters(user_id);
CREATE INDEX idx_characters_is_public ON public.characters(is_public);
CREATE INDEX idx_characters_tags ON public.characters USING GIN(tags);
CREATE INDEX idx_characters_created_at ON public.characters(created_at);

-- Índices para campanhas
CREATE INDEX idx_campaigns_owner_id ON public.campaigns(owner_id);
CREATE INDEX idx_campaigns_is_active ON public.campaigns(is_active);

-- Índices para logs
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_timestamp ON public.activity_logs(timestamp);
CREATE INDEX idx_activity_logs_action ON public.activity_logs(action);

-- ===================================================================
-- FUNÇÕES E TRIGGERS
-- ===================================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON public.characters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================================================
-- ROW LEVEL SECURITY (RLS)
-- ===================================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para characters
CREATE POLICY "Users can view own characters" ON public.characters
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public characters" ON public.characters
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can insert own characters" ON public.characters
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own characters" ON public.characters
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own characters" ON public.characters
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para campaigns
CREATE POLICY "Users can view campaigns they own or are members of" ON public.campaigns
    FOR SELECT USING (
        auth.uid() = owner_id OR 
        auth.uid()::text = ANY(
            SELECT jsonb_array_elements_text(members->'user_id')
        )
    );

CREATE POLICY "Users can insert own campaigns" ON public.campaigns
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own campaigns" ON public.campaigns
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own campaigns" ON public.campaigns
    FOR DELETE USING (auth.uid() = owner_id);

-- Políticas para activity_logs
CREATE POLICY "Users can view own activity logs" ON public.activity_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity logs" ON public.activity_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ===================================================================
-- FUNÇÃO PARA CRIAR PERFIL AUTOMATICAMENTE
-- ===================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, display_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===================================================================
-- FUNÇÃO PARA ATUALIZAR LAST_LOGIN
-- ===================================================================

CREATE OR REPLACE FUNCTION public.update_last_login()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles 
    SET last_login = NOW() 
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizar last_login
CREATE TRIGGER on_auth_user_login
    AFTER INSERT ON auth.sessions
    FOR EACH ROW EXECUTE FUNCTION public.update_last_login(); 