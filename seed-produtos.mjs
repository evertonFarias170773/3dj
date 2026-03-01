import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── CONFIG ────────────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://nohgkwvcwbcizurkwsji.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || 'Sua_Chave_Service_Role_Aqui';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── IMAGENS LOCAIS ──────────────────────────────────────────────────────
const BRAIN_DIR = 'C:\\Users\\evert\\.gemini\\antigravity\\brain\\96ebb82f-9c06-4c2d-9fc3-33319f5108c4';

const imagemMap = {
    'porta_copo_hexagonal': path.join(BRAIN_DIR, 'porta_copo_hexagonal_1772390912312.png'),
    'brinquedo_robo': path.join(BRAIN_DIR, 'brinquedo_robo_1772390928720.png'),
    'vaso_geometrico': path.join(BRAIN_DIR, 'vaso_geometrico_1772390941563.png'),
    'organizador_cabos': path.join(BRAIN_DIR, 'organizador_cabos_1772390954002.png'),
    'porta_copo_mandala': path.join(BRAIN_DIR, 'porta_copo_mandala_1772390978237.png'),
    'brinquedo_dinossauro': path.join(BRAIN_DIR, 'brinquedo_dinossauro_1772390996696.png'),
    'vaso_espiral': path.join(BRAIN_DIR, 'vaso_espiral_1772391014197.png'),
    'suporte_celular': path.join(BRAIN_DIR, 'suporte_celular_1772391027399.png'),
    'porta_copo_coracao': path.join(BRAIN_DIR, 'porta_copo_coracao_1772391050955.png'),
    'brinquedo_castelo': path.join(BRAIN_DIR, 'brinquedo_castelo_1772391065095.png'),
    'luminaria_lua': path.join(BRAIN_DIR, 'luminaria_lua_1772391079870.png'),
    'porta_copo_wave': path.join(BRAIN_DIR, 'porta_copo_wave_1772391108859.png'),
    'brinquedo_navio': path.join(BRAIN_DIR, 'brinquedo_navio_1772391123394.png'),
    'suporte_livros': path.join(BRAIN_DIR, 'suporte_livros_1772391138855.png'),
    'cachepot_triangular': path.join(BRAIN_DIR, 'cachepot_triangular_1772391152127.png'),
    'porta_copo_arvore': path.join(BRAIN_DIR, 'porta_copo_arvore_1772391175217.png'),
    'brinquedo_foguete': path.join(BRAIN_DIR, 'brinquedo_foguete_1772391191597.png'),
};

// ─── UPLOAD DAS IMAGENS ───────────────────────────────────────────────────
async function uploadImagem(chave) {
    const localPath = imagemMap[chave];
    if (!localPath || !fs.existsSync(localPath)) {
        console.warn(`  ⚠  Arquivo não encontrado para ${chave}`);
        return null;
    }
    const fileContent = fs.readFileSync(localPath);
    const storagePath = `produtos/${chave}.png`;

    const { error } = await supabase.storage
        .from('produtos')
        .upload(storagePath, fileContent, {
            contentType: 'image/png',
            upsert: true,
        });

    if (error) {
        console.error(`  ✗ Erro ao fazer upload de ${chave}:`, error.message);
        return null;
    }

    const { data } = supabase.storage.from('produtos').getPublicUrl(storagePath);
    console.log(`  ✓ Upload OK: ${storagePath}`);
    return data.publicUrl;
}

async function getCategorias() {
    const { data, error } = await supabase.from('categorias').select('id, slug');
    if (error) throw new Error('Erro ao buscar categorias: ' + error.message);
    const map = {};
    data.forEach(c => { map[c.slug] = c.id; });
    return map;
}

async function getTags() {
    const { data, error } = await supabase.from('tags').select('id, slug');
    if (error) throw new Error('Erro ao buscar tags: ' + error.message);
    const map = {};
    data.forEach(t => { map[t.slug] = t.id; });
    return map;
}

// ─── DEFINIÇÃO DOS 20 PRODUTOS ────────────────────────────────────────────
const produtos = [
    {
        nome: 'Porta Copo Hexagonal Premium',
        slug: 'porta-copo-hexagonal-premium',
        categoria: 'porta-copos',
        imagem: 'porta_copo_hexagonal',
        descricao_curta: 'Porta copo geométrico hexagonal em PLA laranja, perfeito para mesas e escritórios.',
        descricao: 'Porta copo com design hexagonal exclusivo, impresso em PLA de alta qualidade. Acabamento liso e resistente, ideal para copos, canecas e garrafas. Protege suas superfícies com estilo.',
        material: 'PLA', peso_gramas: 45,
        comprimento_mm: 100, largura_mm: 100, altura_mm: 5,
        preco_base: 24.90, setup_valor: 5, quantidade_minima: 1, destaque: true,
        tags: ['porta-copo', 'pla', 'casa'],
        cores: [{ nome: 'Laranja', hex: '#FF6B35' }, { nome: 'Verde', hex: '#2ECC71' }, { nome: 'Preto', hex: '#1A1A2E' }],
    },
    {
        nome: 'Porta Copo Mandala Floral',
        slug: 'porta-copo-mandala-floral',
        categoria: 'porta-copos',
        imagem: 'porta_copo_mandala',
        descricao_curta: 'Porta copo artístico com padrão mandala em PLA verde, design exclusivo 3D.',
        descricao: 'Transforme sua mesa com este porta copo mandala impresso em PLA biodegradável. O padrão floral intricado é resultado de impressão 3D de alta precisão, garantindo detalhes incríveis.',
        material: 'PLA', peso_gramas: 42,
        comprimento_mm: 100, largura_mm: 100, altura_mm: 5,
        preco_base: 29.90, setup_valor: 5, quantidade_minima: 1, destaque: false,
        tags: ['porta-copo', 'pla', 'decoracao'],
        cores: [{ nome: 'Verde', hex: '#27AE60' }, { nome: 'Roxo', hex: '#8E44AD' }],
    },
    {
        nome: 'Porta Copo Coração Romântico',
        slug: 'porta-copo-coracao-romantico',
        categoria: 'porta-copos',
        imagem: 'porta_copo_coracao',
        descricao_curta: 'Porta copo em formato de coração, ideal para presentear. Em PLA rosé.',
        descricao: 'Presente perfeito para quem você ama! Porta copo no formato de coração impresso em PLA rosé de alta qualidade. Elegante, resistente e com acabamento suave.',
        material: 'PLA', peso_gramas: 38,
        comprimento_mm: 95, largura_mm: 95, altura_mm: 5,
        preco_base: 19.90, setup_valor: 5, quantidade_minima: 2, destaque: true,
        tags: ['porta-copo', 'pla', 'presente'],
        cores: [{ nome: 'Rosa', hex: '#FF6B9D' }, { nome: 'Vermelho', hex: '#E74C3C' }],
    },
    {
        nome: 'Porta Copo Ondas do Mar',
        slug: 'porta-copo-ondas-mar',
        categoria: 'porta-copos',
        imagem: 'porta_copo_wave',
        descricao_curta: 'Design oceânico com padrão de ondas em PLA azul. Conjunto de 4 unidades.',
        descricao: 'Traga o espírito do mar para sua mesa com conjunto de porta copos estampados com ondas do oceano. Impresso em PLA azul resistente. Vendido em conjunto de 4 unidades.',
        material: 'PLA', peso_gramas: 40,
        comprimento_mm: 100, largura_mm: 100, altura_mm: 5,
        preco_base: 79.90, setup_valor: 0, quantidade_minima: 1, destaque: false,
        tags: ['porta-copo', 'pla', 'casa', 'presente'],
        cores: [{ nome: 'Azul Oceano', hex: '#2980B9' }, { nome: 'Azul Claro', hex: '#3498DB' }],
    },
    {
        nome: 'Porta Copo Árvore da Vida',
        slug: 'porta-copo-arvore-da-vida',
        categoria: 'porta-copos',
        imagem: 'porta_copo_arvore',
        descricao_curta: 'Símbolo da árvore da vida em PLA castanho, design rústico e elegante.',
        descricao: 'Carregue o símbolo da conexão entre natureza e vida neste belo porta copo. Impresso em PLA marrom com acabamento artesanal.',
        material: 'PLA', peso_gramas: 44,
        comprimento_mm: 100, largura_mm: 100, altura_mm: 5,
        preco_base: 27.90, setup_valor: 5, quantidade_minima: 1, destaque: false,
        tags: ['porta-copo', 'pla', 'decoracao', 'presente'],
        cores: [{ nome: 'Castanho', hex: '#6D4C41' }, { nome: 'Bege', hex: '#D7CCC8' }],
    },
    {
        nome: 'Robô Articulado 3D',
        slug: 'robo-articulado-3d',
        categoria: 'brinquedos',
        imagem: 'brinquedo_robo',
        descricao_curta: 'Robô com braços articulados impresso em PLA colorido, divertido para crianças.',
        descricao: 'Brinquedo robô com articulações móveis nos braços e pernas. Impresso em PLA atóxico, seguro para crianças maiores de 3 anos. Cores vibrantes e design moderno.',
        material: 'PLA', peso_gramas: 150,
        comprimento_mm: 80, largura_mm: 60, altura_mm: 180,
        preco_base: 59.90, setup_valor: 10, quantidade_minima: 1, destaque: true,
        tags: ['brinquedo', 'pla', 'presente'],
        cores: [{ nome: 'Vermelho e Azul', hex: '#2980B9' }, { nome: 'Verde e Amarelo', hex: '#27AE60' }],
    },
    {
        nome: 'Dinossauro T-Rex Miniatura',
        slug: 'dinossauro-t-rex-miniatura',
        categoria: 'brinquedos',
        imagem: 'brinquedo_dinossauro',
        descricao_curta: 'Miniatura de T-Rex em PLA verde, detalhes impressionantes para colecionar.',
        descricao: 'Figura de dinossauro T-Rex com detalhes anatômicos impressionantes. Impresso em PLA verde de alta qualidade. Ideal para colecionar ou presentear crianças.',
        material: 'PLA', peso_gramas: 120,
        comprimento_mm: 200, largura_mm: 80, altura_mm: 120,
        preco_base: 49.90, setup_valor: 10, quantidade_minima: 1, destaque: true,
        tags: ['brinquedo', 'pla', 'presente'],
        cores: [{ nome: 'Verde Dinossauro', hex: '#2D6A4F' }, { nome: 'Laranja', hex: '#E76F51' }],
    },
    {
        nome: 'Castelo Medieval Miniatura',
        slug: 'castelo-medieval-miniatura',
        categoria: 'brinquedos',
        imagem: 'brinquedo_castelo',
        descricao_curta: 'Castelo medieval detalhado em PLA cinza, com torres e muralhas.',
        descricao: 'Miniatura de castelo medieval com detalhes arquitetônicos: torres, muralhas, portão e janelas. Perfeito para decoração ou cenário de RPG.',
        material: 'PLA', peso_gramas: 300,
        comprimento_mm: 200, largura_mm: 200, altura_mm: 200,
        preco_base: 129.90, setup_valor: 20, quantidade_minima: 1, destaque: false,
        tags: ['brinquedo', 'pla', 'decoracao'],
        cores: [{ nome: 'Cinza Pedra', hex: '#7F8C8D' }, { nome: 'Preto', hex: '#2C3E50' }],
    },
    {
        nome: 'Navio Pirata 3D',
        slug: 'navio-pirata-3d',
        categoria: 'brinquedos',
        imagem: 'brinquedo_navio',
        descricao_curta: 'Modelo de navio pirata em PLA marrom com mastro e velas detalhados.',
        descricao: 'Navio pirata com detalhes impressionantes: mastro, cordas, velas e canhões. Acabamento marrom envelhecido que remete a madeira real.',
        material: 'PLA', peso_gramas: 250,
        comprimento_mm: 300, largura_mm: 100, altura_mm: 250,
        preco_base: 99.90, setup_valor: 15, quantidade_minima: 1, destaque: false,
        tags: ['brinquedo', 'pla', 'presente'],
        cores: [{ nome: 'Marrom Madeira', hex: '#795548' }, { nome: 'Preto e Bege', hex: '#263238' }],
    },
    {
        nome: 'Foguete Espacial Colecionável',
        slug: 'foguete-espacial-colecionar',
        categoria: 'brinquedos',
        imagem: 'brinquedo_foguete',
        descricao_curta: 'Foguete espacial em PLA prateado, acabamento metálico premium.',
        descricao: 'Miniatura de foguete espacial com acabamento prateado metálico. Design inspirado nos foguetes modernos. Ótimo para decoração de mesa e presente para fãs de astronomia.',
        material: 'PLA', peso_gramas: 180,
        comprimento_mm: 60, largura_mm: 60, altura_mm: 250,
        preco_base: 79.90, setup_valor: 10, quantidade_minima: 1, destaque: true,
        tags: ['brinquedo', 'pla', 'presente', 'decoracao'],
        cores: [{ nome: 'Prata Metálico', hex: '#BDC3C7' }, { nome: 'Branco', hex: '#ECF0F1' }],
    },
    {
        nome: 'Vaso Geométrico Diamond',
        slug: 'vaso-geometrico-diamond',
        categoria: 'decoracao',
        imagem: 'vaso_geometrico',
        descricao_curta: 'Vaso decorativo com padrão de diamantes em PLA branco matte, moderno e elegante.',
        descricao: 'Vaso decorativo contemporâneo com padrão de losangos geométricos. Perfeito para plantas artificiais ou como peça decorativa sozinha. Impresso em PLA branco matte de alta qualidade.',
        material: 'PLA', peso_gramas: 200,
        comprimento_mm: 120, largura_mm: 120, altura_mm: 200,
        preco_base: 69.90, setup_valor: 10, quantidade_minima: 1, destaque: true,
        tags: ['decoracao', 'pla', 'casa', 'presente'],
        cores: [{ nome: 'Branco Matte', hex: '#FAFAFA' }, { nome: 'Cinza', hex: '#95A5A6' }, { nome: 'Preto', hex: '#2C3E50' }],
    },
    {
        nome: 'Vaso Espiral Elegante',
        slug: 'vaso-espiral-elegante',
        categoria: 'decoracao',
        imagem: 'vaso_espiral',
        descricao_curta: 'Vaso alto em espiral translúcido em PETG azul, perfeito para flores secas.',
        descricao: 'Design espiral inspirado na natureza, impresso em PETG translúcido azul. A transparência cria um jogo de luz fascinante. Ideal para flores secas ou ramos decorativos.',
        material: 'PETG', peso_gramas: 220,
        comprimento_mm: 100, largura_mm: 100, altura_mm: 300,
        preco_base: 89.90, setup_valor: 10, quantidade_minima: 1, destaque: false,
        tags: ['decoracao', 'petg', 'casa'],
        cores: [{ nome: 'Azul Translúcido', hex: '#3498DB' }, { nome: 'Âmbar', hex: '#E67E22' }],
    },
    {
        nome: 'Luminária Meia-Lua',
        slug: 'luminaria-meia-lua',
        categoria: 'decoracao',
        imagem: 'luminaria_lua',
        descricao_curta: 'Abajur meia-lua em PLA branco, proporciona luz suave e ambiente aconchegante.',
        descricao: 'Luminária decorativa em formato de meia-lua, impressa em PLA branco que difunde a luz suavemente criando um ambiente aconchegante. Acompanha encaixe para lâmpada LED (não inclusa).',
        material: 'PLA', peso_gramas: 180,
        comprimento_mm: 200, largura_mm: 50, altura_mm: 200,
        preco_base: 119.90, setup_valor: 15, quantidade_minima: 1, destaque: true,
        tags: ['decoracao', 'pla', 'casa', 'presente'],
        cores: [{ nome: 'Branco', hex: '#FAFAFA' }, { nome: 'Marfim', hex: '#FFF8DC' }],
    },
    {
        nome: 'Cachepot Triangular Suculentas',
        slug: 'cachepot-triangular-suculentas',
        categoria: 'decoracao',
        imagem: 'cachepot_triangular',
        descricao_curta: 'Vaso triangular para suculentas em PLA terracota, estilo boho chique.',
        descricao: 'Cachepot geométrico triangular perfeito para suculentas e cactos. Impresso em PLA terracota com acabamento texturizado que imita argila natural.',
        material: 'PLA', peso_gramas: 160,
        comprimento_mm: 100, largura_mm: 100, altura_mm: 120,
        preco_base: 39.90, setup_valor: 5, quantidade_minima: 1, destaque: false,
        tags: ['decoracao', 'pla', 'casa'],
        cores: [{ nome: 'Terracota', hex: '#C0674F' }, { nome: 'Areia', hex: '#D6CDA4' }],
    },
    {
        nome: 'Suporte de Livros Montanha',
        slug: 'suporte-livros-montanha',
        categoria: 'decoracao',
        imagem: 'suporte_livros',
        descricao_curta: 'Aparador de livros em forma de montanha, robusto em PLA cinza escuro.',
        descricao: 'Suporte de livros com design de cadeias de montanhas, impresso em PLA cinza escuro robusto. Vendido como par (2 unidades complementares).',
        material: 'PLA', peso_gramas: 350,
        comprimento_mm: 150, largura_mm: 80, altura_mm: 150,
        preco_base: 89.90, setup_valor: 10, quantidade_minima: 1, destaque: false,
        tags: ['decoracao', 'pla', 'escritorio', 'casa'],
        cores: [{ nome: 'Cinza Escuro', hex: '#455A64' }, { nome: 'Preto', hex: '#1A1A2E' }],
    },
    {
        nome: 'Organizador de Cabos Desk',
        slug: 'organizador-cabos-desk',
        categoria: 'utilidades',
        imagem: 'organizador_cabos',
        descricao_curta: 'Organizador de cabos para mesa em PETG preto, mantém sua mesa arrumada.',
        descricao: 'Organizador com 5 ranhuras para cabos USB, carregadores e fones. Impresso em PETG preto resistente. Base antiderrapante inclusa. Essencial para home office.',
        material: 'PETG', peso_gramas: 80,
        comprimento_mm: 150, largura_mm: 40, altura_mm: 40,
        preco_base: 34.90, setup_valor: 5, quantidade_minima: 1, destaque: true,
        tags: ['utilidade', 'petg', 'escritorio'],
        cores: [{ nome: 'Preto', hex: '#1A1A2E' }, { nome: 'Branco', hex: '#FAFAFA' }],
    },
    {
        nome: 'Suporte para Celular Universal',
        slug: 'suporte-celular-universal',
        categoria: 'utilidades',
        imagem: 'suporte_celular',
        descricao_curta: 'Suporte para celular/tablet ajustável em ABS cinza, compatível com todos os modelos.',
        descricao: 'Suporte universal com ângulo ajustável para celulares e tablets. Impresso em ABS cinza resistente ao calor. Encaixes ergonômicos e base estável.',
        material: 'ABS', peso_gramas: 110,
        comprimento_mm: 130, largura_mm: 100, altura_mm: 130,
        preco_base: 39.90, setup_valor: 5, quantidade_minima: 1, destaque: false,
        tags: ['utilidade', 'abs', 'escritorio'],
        cores: [{ nome: 'Cinza', hex: '#95A5A6' }, { nome: 'Preto', hex: '#2C3E50' }, { nome: 'Branco', hex: '#ECF0F1' }],
    },
    {
        nome: 'Organizador de Mesa Modular',
        slug: 'organizador-mesa-modular',
        categoria: 'utilidades',
        imagem: 'suporte_livros',
        descricao_curta: 'Organizador modular para canetas, clipes e acessórios em PLA branco.',
        descricao: 'Sistema modular de organização de mesa com 3 compartimentos encaixáveis. Perfeito para canetas, clipes e post-its. Impresso em PLA branco com encaixes precisos.',
        material: 'PLA', peso_gramas: 200,
        comprimento_mm: 200, largura_mm: 100, altura_mm: 100,
        preco_base: 54.90, setup_valor: 10, quantidade_minima: 1, destaque: false,
        tags: ['utilidade', 'pla', 'escritorio'],
        cores: [{ nome: 'Branco', hex: '#FAFAFA' }, { nome: 'Cinza', hex: '#BDC3C7' }],
    },
    {
        nome: 'Porta Canetas Astronauta',
        slug: 'porta-canetas-astronauta',
        categoria: 'utilidades',
        imagem: 'brinquedo_foguete',
        descricao_curta: 'Porta canetas no formato de astronauta em PLA branco, exclusivo para mesas criativas.',
        descricao: 'Porta canetas criativo no formato de astronauta com capacete removível. O interior acomoda canetas, lápis e marca-textos. Impresso em PLA branco brilhante.',
        material: 'PLA', peso_gramas: 160,
        comprimento_mm: 80, largura_mm: 80, altura_mm: 180,
        preco_base: 64.90, setup_valor: 10, quantidade_minima: 1, destaque: true,
        tags: ['utilidade', 'pla', 'escritorio', 'presente'],
        cores: [{ nome: 'Branco', hex: '#FAFAFA' }, { nome: 'Azul NASA', hex: '#003087' }],
    },
    {
        nome: 'Gancho Adesivo Multiuso',
        slug: 'gancho-adesivo-multiuso',
        categoria: 'utilidades',
        imagem: 'organizador_cabos',
        descricao_curta: 'Conjunto de 6 ganchos adesivos em PLA resistente, organização prática para paredes.',
        descricao: 'Pack com 6 ganchos para parede impressos em PLA resistente. Cada gancho suporta até 500g. Acompanha fita adesiva 3M de alta qualidade. Ideal para chaves, bolsas e fones.',
        material: 'PLA', peso_gramas: 60,
        comprimento_mm: 30, largura_mm: 20, altura_mm: 50,
        preco_base: 29.90, setup_valor: 0, quantidade_minima: 1, destaque: false,
        tags: ['utilidade', 'pla', 'casa'],
        cores: [{ nome: 'Branco', hex: '#FAFAFA' }, { nome: 'Prata', hex: '#BDC3C7' }, { nome: 'Preto', hex: '#2C3E50' }],
    },
];

// ─── MAIN ─────────────────────────────────────────────────────────────────
async function main() {
    console.log('🚀 Iniciando seed de 20 produtos...\n');

    console.log('📂 Buscando categorias...');
    const catMap = await getCategorias();
    console.log('  Encontradas:', Object.keys(catMap).join(', '));

    console.log('🏷  Buscando tags...');
    const tagMap = await getTags();
    console.log('  Encontradas:', Object.keys(tagMap).join(', '), '\n');

    console.log('📸 Fazendo upload das imagens...');
    const urlMap = {};
    const imagensUnicas = [...new Set(produtos.map(p => p.imagem))];
    for (const imgKey of imagensUnicas) {
        urlMap[imgKey] = await uploadImagem(imgKey);
    }
    console.log('');

    console.log('📦 Inserindo produtos...');
    let inseridos = 0;

    for (const p of produtos) {
        const categoriaId = catMap[p.categoria];
        if (!categoriaId) {
            console.warn(`  ⚠ Categoria '${p.categoria}' não encontrada`);
            continue;
        }

        const { data: prodInserido, error: prodError } = await supabase
            .from('produtos')
            .upsert({
                nome: p.nome,
                slug: p.slug,
                categoria_id: categoriaId,
                descricao_curta: p.descricao_curta,
                descricao: p.descricao,
                material: p.material,
                peso_gramas: p.peso_gramas,
                comprimento_mm: p.comprimento_mm,
                largura_mm: p.largura_mm,
                altura_mm: p.altura_mm,
                preco_base: p.preco_base,
                setup_valor: p.setup_valor,
                quantidade_minima: p.quantidade_minima,
                ativo: true,
                destaque: p.destaque,
            }, { onConflict: 'slug' })
            .select('id')
            .single();

        if (prodError) {
            console.error(`  ✗ Erro ao inserir ${p.nome}:`, prodError.message);
            continue;
        }

        const produtoId = prodInserido.id;

        for (const cor of p.cores) {
            await supabase.from('produto_cores').upsert({
                produto_id: produtoId,
                nome: cor.nome,
                hex: cor.hex,
                ativo: true,
            }, { onConflict: 'produto_id,nome' }).select();
        }

        if (urlMap[p.imagem]) {
            await supabase.from('produto_imagens').upsert({
                produto_id: produtoId,
                url: urlMap[p.imagem],
                ordem: 0,
                principal: true,
            }, { onConflict: 'produto_id,ordem' }).select();
        }

        for (const tagSlug of p.tags) {
            const tagId = tagMap[tagSlug];
            if (tagId) {
                await supabase.from('produto_tags').upsert({
                    produto_id: produtoId,
                    tag_id: tagId,
                }, { onConflict: 'produto_id,tag_id' }).select();
            }
        }

        console.log(`  ✓ [${++inseridos}/20] ${p.nome}`);
    }

    console.log(`\n✅ Seed concluído! ${inseridos} produtos inseridos com sucesso.`);
}

main().catch(err => {
    console.error('❌ Erro fatal:', err);
    process.exit(1);
});
