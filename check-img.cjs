const { createClient } = require('@supabase/supabase-js');

const s = createClient(
    process.env.SUPABASE_URL || 'https://nohgkwvcwbcizurkwsji.supabase.co',
    process.env.SUPABASE_SERVICE_KEY || 'Sua_Chave_Service_Role_Aqui'
);

// Mapa: slug do produto -> nome do arquivo no Storage (pasta produtos/)
const produtoImagens = {
    'porta-copo-hexagonal-premium': 'porta_copo_hexagonal',
    'porta-copo-mandala-floral': 'porta_copo_mandala',
    'porta-copo-coracao-romantico': 'porta_copo_coracao',
    'porta-copo-ondas-mar': 'porta_copo_wave',
    'porta-copo-arvore-da-vida': 'porta_copo_arvore',
    'robo-articulado-3d': 'brinquedo_robo',
    'dinossauro-t-rex-miniatura': 'brinquedo_dinossauro',
    'castelo-medieval-miniatura': 'brinquedo_castelo',
    'navio-pirata-3d': 'brinquedo_navio',
    'foguete-espacial-colecionar': 'brinquedo_foguete',
    'vaso-geometrico-diamond': 'vaso_geometrico',
    'vaso-espiral-elegante': 'vaso_espiral',
    'luminaria-meia-lua': 'luminaria_lua',
    'cachepot-triangular-suculentas': 'cachepot_triangular',
    'suporte-livros-montanha': 'suporte_livros',
    'organizador-cabos-desk': 'organizador_cabos',
    'suporte-celular-universal': 'suporte_celular',
    'organizador-mesa-modular': 'suporte_livros',
    'porta-canetas-astronauta': 'brinquedo_foguete',
    'gancho-adesivo-multiuso': 'organizador_cabos',
};

const BASE_URL = 'https://nohgkwvcwbcizurkwsji.supabase.co/storage/v1/object/public/produtos';

async function main() {
    console.log('🔍 Buscando produtos...');
    const { data: produtos, error } = await s.from('produtos').select('id, slug');
    if (error) { console.error('Erro:', error.message); process.exit(1); }
    console.log(`  ${produtos.length} produtos encontrados\n`);

    // Limpar imagens existentes (0 registros, mas por segurança)
    await s.from('produto_imagens').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('🖼️  Inserindo imagens...');
    let ok = 0;
    for (const produto of produtos) {
        const imgKey = produtoImagens[produto.slug];
        if (!imgKey) {
            console.warn(`  ⚠ Nenhuma imagem mapeada para: ${produto.slug}`);
            continue;
        }
        const url = `${BASE_URL}/produtos/${imgKey}.png`;
        const { error: e } = await s.from('produto_imagens').insert({
            produto_id: produto.id,
            url,
            ordem: 0,
            principal: true,
        });
        if (e) {
            console.error(`  ✗ ${produto.slug}:`, e.message);
        } else {
            console.log(`  ✓ ${produto.slug}`);
            ok++;
        }
    }

    console.log(`\n✅ ${ok}/${produtos.length} imagens inseridas.`);

    // Verificar uma URL para confirmar acesso
    const testUrl = `${BASE_URL}/produtos/porta_copo_hexagonal.png`;
    const https = require('https');
    https.get(testUrl, (res) => {
        console.log(`\n🌐 Teste de acesso à imagem: HTTP ${res.statusCode}`);
        console.log(`   URL: ${testUrl}`);
        process.exit(0);
    }).on('error', (e) => {
        console.error('Erro ao acessar imagem:', e.message);
        process.exit(1);
    });
}

main().catch(e => { console.error(e); process.exit(1); });
