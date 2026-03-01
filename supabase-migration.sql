-- ================================================
-- SCRIPT DE MIGRAÇÃO — Loja 3D Print
-- Execute no Supabase Dashboard → SQL Editor
-- ================================================

-- =======================================
-- CATEGORIAS
-- =======================================
CREATE TABLE IF NOT EXISTS categorias (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        text NOT NULL,
  slug        text NOT NULL UNIQUE,
  descricao   text,
  icone       text,
  ativo       boolean DEFAULT true,
  criado_em   timestamptz DEFAULT now()
);

-- =======================================
-- PRODUTOS
-- =======================================
CREATE TABLE IF NOT EXISTS produtos (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id    uuid REFERENCES categorias(id) ON DELETE SET NULL,
  nome            text NOT NULL,
  slug            text NOT NULL UNIQUE,
  descricao_curta text,
  descricao       text,
  material        text,
  peso_gramas     numeric(10,2),
  comprimento_mm  numeric(10,2),
  largura_mm      numeric(10,2),
  altura_mm       numeric(10,2),
  preco_base      numeric(10,2) NOT NULL,
  setup_valor     numeric(10,2) DEFAULT 0,
  quantidade_minima int DEFAULT 1,
  ativo           boolean DEFAULT true,
  destaque        boolean DEFAULT false,
  criado_em       timestamptz DEFAULT now(),
  atualizado_em   timestamptz DEFAULT now()
);

-- =======================================
-- VARIAÇÕES DE CORES
-- =======================================
CREATE TABLE IF NOT EXISTS produto_cores (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id  uuid NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  nome        text NOT NULL,
  hex         text NOT NULL,
  ativo       boolean DEFAULT true,
  criado_em   timestamptz DEFAULT now()
);

-- =======================================
-- IMAGENS DO PRODUTO
-- =======================================
CREATE TABLE IF NOT EXISTS produto_imagens (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id  uuid NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  cor_id      uuid REFERENCES produto_cores(id) ON DELETE SET NULL,
  url         text NOT NULL,
  ordem       int DEFAULT 0,
  principal   boolean DEFAULT false,
  criado_em   timestamptz DEFAULT now()
);

-- =======================================
-- TAGS
-- =======================================
CREATE TABLE IF NOT EXISTS tags (
  id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome    text NOT NULL UNIQUE,
  slug    text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS produto_tags (
  produto_id  uuid REFERENCES produtos(id) ON DELETE CASCADE,
  tag_id      uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (produto_id, tag_id)
);

-- =======================================
-- PEDIDOS
-- =======================================
CREATE TABLE IF NOT EXISTS pedidos (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero              bigint GENERATED ALWAYS AS IDENTITY UNIQUE,
  status              text DEFAULT 'pendente'
                      CHECK (status IN ('pendente','pago','producao','enviado','entregue','cancelado')),
  cliente_nome        text NOT NULL,
  cliente_email       text NOT NULL,
  cliente_cpf_cnpj    text,
  cliente_telefone    text,
  endereco_cep        text NOT NULL,
  endereco_logradouro text NOT NULL,
  endereco_numero     text,
  endereco_complemento text,
  endereco_bairro     text,
  endereco_cidade     text NOT NULL,
  endereco_uf         char(2) NOT NULL,
  subtotal            numeric(10,2) NOT NULL,
  frete_valor         numeric(10,2) DEFAULT 0,
  desconto            numeric(10,2) DEFAULT 0,
  total               numeric(10,2) NOT NULL,
  forma_pagamento     text CHECK (forma_pagamento IN ('pix','cartao')),
  pagamento_status    text DEFAULT 'aguardando',
  pagamento_id        text,
  observacoes         text,
  criado_em           timestamptz DEFAULT now(),
  atualizado_em       timestamptz DEFAULT now()
);

-- =======================================
-- ITENS DO PEDIDO
-- =======================================
CREATE TABLE IF NOT EXISTS pedido_itens (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id       uuid NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  produto_id      uuid NOT NULL REFERENCES produtos(id),
  cor_id          uuid REFERENCES produto_cores(id),
  quantidade      int NOT NULL CHECK (quantidade > 0),
  preco_unitario  numeric(10,2) NOT NULL,
  setup_valor     numeric(10,2) DEFAULT 0,
  subtotal        numeric(10,2) NOT NULL
);

-- =======================================
-- CONFIGURAÇÕES DA LOJA
-- =======================================
CREATE TABLE IF NOT EXISTS configuracoes (
  chave     text PRIMARY KEY,
  valor     text NOT NULL,
  tipo      text DEFAULT 'string',
  descricao text
);

INSERT INTO configuracoes VALUES
  ('loja_nome',         '3D Print Store', 'string', 'Nome da loja'),
  ('loja_email',        '',               'string', 'Email de contato'),
  ('loja_whatsapp',     '',               'string', 'WhatsApp para suporte'),
  ('frete_api_url',     '',               'string', 'URL da API N8N de frete'),
  ('pagamento_api_url', '',               'string', 'URL da API N8N de pagamento'),
  ('checkout_minimo',   '1',              'number', 'Quantidade mínima global')
ON CONFLICT (chave) DO NOTHING;

-- =======================================
-- ADMIN USERS (emails autorizados)
-- =======================================
CREATE TABLE IF NOT EXISTS admin_users (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email     text NOT NULL UNIQUE,
  criado_em timestamptz DEFAULT now()
);

-- =======================================
-- ÍNDICES PARA PERFORMANCE
-- =======================================
CREATE INDEX IF NOT EXISTS idx_produtos_slug     ON produtos(slug);
CREATE INDEX IF NOT EXISTS idx_produtos_ativo    ON produtos(ativo);
CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_produtos_destaque ON produtos(destaque);
CREATE INDEX IF NOT EXISTS idx_produto_cores_produto ON produto_cores(produto_id);
CREATE INDEX IF NOT EXISTS idx_produto_imagens_produto ON produto_imagens(produto_id);
CREATE INDEX IF NOT EXISTS idx_produto_tags_produto ON produto_tags(produto_id);
CREATE INDEX IF NOT EXISTS idx_produto_tags_tag    ON produto_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_status     ON pedidos(status);
CREATE INDEX IF NOT EXISTS idx_pedidos_email      ON pedidos(cliente_email);

-- =======================================
-- ROW LEVEL SECURITY (RLS)
-- =======================================

-- Categorias
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categorias_publico_leitura" ON categorias FOR SELECT USING (ativo = true);
CREATE POLICY "categorias_admin_tudo"      ON categorias USING (auth.role() = 'authenticated');

-- Produtos
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "produtos_publico_leitura"   ON produtos FOR SELECT USING (ativo = true);
CREATE POLICY "produtos_admin_tudo"        ON produtos USING (auth.role() = 'authenticated');

-- Cores
ALTER TABLE produto_cores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cores_publico_leitura"      ON produto_cores FOR SELECT USING (ativo = true);
CREATE POLICY "cores_admin_tudo"           ON produto_cores USING (auth.role() = 'authenticated');

-- Imagens
ALTER TABLE produto_imagens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "imagens_publico_leitura"    ON produto_imagens FOR SELECT USING (true);
CREATE POLICY "imagens_admin_tudo"         ON produto_imagens USING (auth.role() = 'authenticated');

-- Tags
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tags_publico_leitura"       ON tags FOR SELECT USING (true);
CREATE POLICY "tags_admin_tudo"            ON tags USING (auth.role() = 'authenticated');

ALTER TABLE produto_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "produto_tags_publico"       ON produto_tags FOR SELECT USING (true);
CREATE POLICY "produto_tags_admin"         ON produto_tags USING (auth.role() = 'authenticated');

-- Pedidos (qualquer um pode criar, só admin lê/edita)
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pedidos_publico_insere"     ON pedidos FOR INSERT WITH CHECK (true);
CREATE POLICY "pedidos_admin_tudo"         ON pedidos USING (auth.role() = 'authenticated');

ALTER TABLE pedido_itens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "itens_publico_insere"       ON pedido_itens FOR INSERT WITH CHECK (true);
CREATE POLICY "itens_admin_tudo"           ON pedido_itens USING (auth.role() = 'authenticated');

-- Configurações (apenas admin)
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "config_admin"               ON configuracoes USING (auth.role() = 'authenticated');

-- Admin users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_users_admin"          ON admin_users USING (auth.role() = 'authenticated');

-- =======================================
-- STORAGE BUCKETS
-- =======================================
-- Execute via Supabase Dashboard → Storage → New Bucket:
-- 1. Nome: "produtos" → Public: SIM
-- 2. Nome: "admin-assets" → Public: NÃO
--
-- Ou via SQL:
INSERT INTO storage.buckets (id, name, public)
VALUES ('produtos', 'produtos', true)
ON CONFLICT DO NOTHING;

-- =======================================
-- DADOS DE EXEMPLO (para testar)
-- =======================================
INSERT INTO categorias (nome, slug, descricao, icone) VALUES
  ('Porta Copos', 'porta-copos', 'Porta copos decorativos em 3D', '🥛'),
  ('Brinquedos', 'brinquedos', 'Brinquedos impressos em 3D', '🧸'),
  ('Decoração', 'decoracao', 'Objetos decorativos para casa', '🏠'),
  ('Utilidades', 'utilidades', 'Objetos úteis do dia a dia', '🔧')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tags (nome, slug) VALUES
  ('porta-copo', 'porta-copo'),
  ('decoracao', 'decoracao'),
  ('brinquedo', 'brinquedo'),
  ('utilidade', 'utilidade'),
  ('PLA', 'pla'),
  ('PETG', 'petg'),
  ('ABS', 'abs'),
  ('presente', 'presente'),
  ('casa', 'casa'),
  ('escritorio', 'escritorio')
ON CONFLICT (slug) DO NOTHING;
