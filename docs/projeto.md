# J3D Store — Documentação Técnica do Projeto

Bem-vindo à documentação oficial do projeto **J3D Store**. Este arquivo foi criado para orientar desenvolvedores, designers e gestores sobre a arquitetura técnica, as escolhas de design e as integrações presentes no ecossistema da nossa loja de impressões 3D.

---

## 🚀 1. O Que É a J3D Store?
A **J3D Store** é um e-commerce minimalista e moderno construído sob medida para a venda de artigos produzidos por impressão 3D (como brinquedos articulados, suportes úteis e itens de decoração). 

O sistema não se resume apenas a uma vitrine; ele é composto por:
*   **A Loja Pública (Vitrine Frontend)**: Layout limpo (flat e minimal) visando total destaque do produto recém impresso, carrinho de compras state-based e painel de informações técnicas embutido.
*   **O Painel Administrativo (Backend Interno)**: Uma área dedicada para manutenção de estoques, upload de mídia, edição de especificações técnicas (peso, dimensões) e manuseio de variações de cor — tudo protegido por autenticação.

---

## 🛠️ 2. Stack Tecnológico e Ferramentas
Desenvolvemos o projeto prezando pela escabilidade e pela facilidade de manutenção sem inflar o código. As tecnologias de ponta selecionadas são:

*   **Framework Principal**: [Next.js 15 (React 19)](https://nextjs.org/) utilizando o sistema **App Router** (`/app`).
*   **Linguagem**: TypeScript (com total tipagem estrita via `/lib/types`).
*   **Ícones SVG**: [Lucide React](https://lucide.dev/) (leves, unilineares, se adaptam bem ao design flat).
*   **Banco de Dados (BaaS)**: [Supabase](https://supabase.com/)
    *   **PostgreSQL**: Base robusta guardando as entidades relacionais (Categorias > Produtos > Imagens > Tags).
    *   **Storage**: Serviço de bucket responsável pelas mídias estáticas e otimizadas dos produtos em formato `.webp` ou `.jpg`.
    *   **Auth**: Manto de segurança limitando o uso de painéis `/admin/*` unicamente à equipe diretora (roles).

---

## 🎨 3. Tipologia & Sistema de Design (CSS)
Ao invés de dependermos de libs gigantes de design como Tailwind, Chakra ou Material UI, rodamos **CSS Modules puros (`*.module.css`)** abastecidos por **variáveis de ambiente globais CSS** (`app/globals.css`). 
Isso nos permite ter um "Design System" próprio que pode sofrer um *rebrand* alterando apenas um arquivo.

### ✒️ Tipografia Otimizada de Google Fonts:
1.  **Inter**: Utilizada para conteúdos densos e parágrafos informativos (tabela de especificações, descrições, etiquetas de botões) — máxima acessibilidade e legibilidade.
2.  **Syne**: Utilizada em cabeçalhos (Headings) importantes, trazendo impacto robusto e uma pegada "industrial e precisa".
3.  **Fredoka**: Adicionada estrategicamente na Home e áreas com pegada mais *"Toy-Art"* para trazer um formato de título mais arredondado, convidativo e amigável.

### 🎨 Paleta de Cores (Tokens CSS):
*   🟢 **`--color-primary` (#22C55E)**: O Verde principal da marca focado nos botões de conversão (Adicionar ao Carrinho) — transmite positividade, avanço.
*   🟠 **`--color-accent` (#F97316)**: Um Laranja vívido usado para alertas, Destaques, Filtros e botões de `Comprar Agora` diretos.
*   ⚪ **`--color-surface` (#FFFFFF)**: O branco limpo dos cartões, modais e layouts sem borda.
*   🧊 **`--color-bg` (#F8F9FA)**: Um fundo cinza claro/neve para dar destaque tridimensional às imagens (`surface`) dos produtos em contraste.

---

## 🔗 4. Integrações de Negócio Planejadas
O `.env.local` mostra que a loja foi pensada para ser automatizada por *Agentes / Workflows*:

*   **N8N (Integrações Externas)**: Planejamos usar Webhooks do N8N ou endpoints de funções nativas Node.js para os fluxos pesados e cruciais:
    *   **Orquestração de Fretes**: Uma API no lado do servidor que buscará por CEP e calculará de forma síncrona/dinâmica preços via portadores externos antes do fechamento.
    *   **Gateways de Pagamento (PIX/Cartão)**: Integração via endpoints locais mapeando transações do carrinho (gerenciamento local e de terceiros).
*   **WhatsApp Comercial**: Conexão simples nativa nos botões (`Flutuante` e `Rodapé`) formatada via variável `NEXT_PUBLIC_WHATSAPP`.

---

## 📂 5. Estrutura de Diretórios Destaque
Qualquer desenvolvedor futuro deve se atentar aos seguintes caminhos críticos na montagem de novos recursos:

*   `/app`: Todo o sistema de rotas (layout.tsx globais, page.tsx das rotas públicas, subpastas para `/admin`).
*   `/components`: A raiz visual do sistema (Botões, Carrinho, Navegação, Barra de Tags, ProdutoDetalhe).
*   `/lib/supabase`: O coração das transações do banco de dados (Querys tipadas como `getProdutos()`, `getProdutoById()`, autenticação e cliente).
*   `/lib/hooks`: Gerenciamento de estado complexo extraído para Hooks puros do React (como o Carrinho de Compras global salvando em LocalStorage).
*   `/scripts`: Abrigamos utilitários MJS essenciais via CLI, como `criar-admin.mjs` (gera novos credenciados pro admin) e `seed-produtos` (mock/dados iniciais).

---
*Gerado automatizamente após ciclos intensos de aprimoramento UX/UI e Backend de e-commerce!*
