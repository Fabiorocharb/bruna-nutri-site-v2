# Dra. Bruna Pires — site institucional

Site responsivo em HTML, CSS e JavaScript. Textos, ícones, botões, faixas, cartões, frases manuscritas e navegação são elementos reais da página. As fotos não contêm texto nem controles da interface.

## Visualizar

Abra `index.html` diretamente ou execute `npm start` (requer Python) e acesse http://127.0.0.1:4173.

## Editar

- `index.html`: conteúdo e estrutura semântica, incluindo os ícones SVG incorporados.
- `css/style.css`: tipografia, cores, componentes e adaptação a celular/tablet.
- `js/script.js`: menu, navegação ativa, detalhes dos serviços e palestras, contatos e player opcional.
- `js/config.js`: WhatsApp, telefone, e-mail, endereço, Google Maps e vídeos confirmados.
- `assets/img/`: fotografias, independentes do layout.

O site funciona sem build e sem dependências JavaScript externas em produção. As fontes são carregadas pelo Google Fonts com fontes alternativas locais.

## Contatos e vídeos

O link de compartilhamento que anteriormente aparecia como WhatsApp foi removido. Sem número confirmado, os botões de agendamento levam ao contato, que usa o Instagram já existente no projeto. Ao preencher `whatsapp` em `js/config.js`, os botões passam automaticamente a abrir uma conversa direta com mensagem de consulta/palestra. Telefone e e-mail só aparecem quando configurados. O endereço confirmado habilita o link correspondente no Google Maps.

Os cartões de palestras abrem a descrição do tema. Não simulam vídeos com durações fictícias. Para disponibilizar um vídeo, preencha a URL HTTPS de um MP4/WebM no campo correspondente de `videos`; o diálogo carregará o player nativo sob demanda.

Números de atendimento e depoimentos foram preservados da referência e precisam ser validados antes da publicação. A foto principal usa o retrato fornecido da Dra. Bruna, com blazer editado para rosa e fundo ampliado por IA. As demais fotografias são ilustrações provisórias, não comprovação da identidade da profissional ou do local.

## Trocar as fotos

Substitua os arquivos abaixo mantendo os nomes. Não é necessário editar estilos nem remover atributos especiais:

- `hero-bruna-rose.webp`: foto horizontal principal (1536 × 1024), baseada no retrato fornecido, com blazer rosa. O PNG correspondente é o original da edição; o arquivo anterior `hero-clean.webp` foi preservado.
- `about-clean.webp`: retrato da apresentação (quadrado ou vertical).
- `clinic-clean.webp`: foto do consultório.
- `lecture-clean.webp`: foto provisória dos três temas; cada `src` pode ser alterado separadamente no HTML.
- `family-placeholder.webp`: fotografia de família.

As imagens principais estão em WebP; a foto principal tem aproximadamente 97 KB. Os PNGs correspondentes são originais de edição; não são carregados pela página. Os antigos recortes do mockup permanecem na pasta, mas não são usados pela interface (exceto a fotografia de família, que não contém controles).

## Ícones

Ícones de interface da biblioteca Lucide; marcas Instagram/WhatsApp do Font Awesome. SVGs incorporados no HTML para funcionarem inclusive ao abrir o arquivo local. Licenças em `assets/icons/`. O monograma foi desenhado em SVG editável e deve ser substituído pela marca oficial, caso exista.

Para reconstruir somente os ícones: `npm install` e `npm run icons`.

## Verificação

Com as dependências instaladas e Microsoft Edge disponível, execute `npm run check`. Verifica oito larguras entre 320 e 1440 px, ausência de rolagem horizontal, carregamento de imagens e ícones, menu, teclado, retorno de foco, diálogos de serviços/palestras e contatos configurados. Também captura a página com as fotos ocultas para comprovar a independência dos componentes.

Capturas e cópias de segurança estão em `.work/`, que não deve ser publicada. Para publicar, basta enviar `index.html`, `css/`, `js/` e os arquivos usados de `assets/`.
