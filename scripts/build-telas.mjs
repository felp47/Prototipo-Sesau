/**
 * Gera public/telas/<tela>/code.html a partir dos HTMLs originais do Stitch em telas/.
 *
 * Os originais não são alterados. As cópias públicas recebem apenas:
 *  - o script /telas/bridge.js (integração com o portal Next.js);
 *  - ids/atributos de dados que permitem exibir trechos da Home em subtelas
 *    e tornar os cards de notícia clicáveis;
 *  - a remoção da numeração dos módulos (textos "1.0", "Módulo 1.1", "3.1").
 *    Nenhuma classe/estilo é alterado.
 *
 * Uso: node scripts/build-telas.mjs
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const source = join(root, "telas");
const target = join(root, "public", "telas");
const BRIDGE = '<script src="/telas/bridge.js" defer></script>';

function transformHome(html) {
  const mainIndex = html.indexOf("<main");
  let head = html.slice(0, mainIndex);
  let body = html.slice(mainIndex);

  const sectionIds = ["inicio-destaque", "eixos", "servicos-prioritarios", "noticias", "carta-servicos"];
  let sectionCount = 0;
  body = body.replace(/<section(?![^>]*\bid=)/g, (match) => {
    const id = sectionIds[sectionCount++];
    return id ? `<section id="${id}"` : match;
  });
  if (sectionCount !== sectionIds.length) throw new Error(`Home: esperado ${sectionIds.length} seções, encontrado ${sectionCount}`);

  const newsLinks = ["noticia-vacinacao", "noticia-dengue", "noticia-odontomovel"];
  let articleCount = 0;
  body = body.replace(/<article /g, (match) => {
    const link = newsLinks[articleCount++];
    return link ? `<article data-bridge-link="${link}" role="link" tabindex="0" ` : match;
  });
  if (articleCount !== newsLinks.length) throw new Error(`Home: esperado ${newsLinks.length} notícias, encontrado ${articleCount}`);

  const searchButton = `onclick="document.getElementById('search-feedback').classList.remove('hidden')"`;
  if (!body.includes(searchButton)) throw new Error("Home: botão de busca não encontrado");
  body = body.replace(searchButton, `${searchButton} data-bridge-search`);

  return head + body;
}

/**
 * Remove a numeração dos módulos ("1.0 Prevenção", "Módulo 1.2", selo "3.1"):
 * o portal não exibe mais códigos nos menus nem nos títulos dos blocos.
 */
function stripModuleNumbers(html, name) {
  let count = 0;
  const out = html
    // selos "Módulo 1.1" (Prevenção)
    .replace(/<span[^>]*>\s*Módulo [1-5]\.[0-9]\s*<\/span>\s*/g, () => (count++, ""))
    // selos circulares "3.1" / "3.2" ao lado dos títulos (Farmácia)
    .replace(/<span class="w-8 h-8[^"]*">\s*[1-5]\.[0-9]\s*<\/span>\s*/g, () => (count++, ""))
    // prefixo numérico de rótulos ("2.1 Acesso e Funcionamento", "3.0 Assistência ...")
    .replace(/>(\s*)[1-5]\.[0-9] (?=[A-ZÀ-Ú])/g, (_, space) => (count++, `>${space}`));
  console.log(`  ${name}: ${count} numerações removidas`);
  return out;
}

/** Prevenção: id no grid de notícias do bloco 1.2 para separar "Últimas Notícias" de "Campanhas de Vacina" */
function transformPrevencao(html) {
  const marker = "<!-- Bento Grid: Campanhas em Vigor & Calendário Oficial -->\n<div ";
  const normalized = html.replace(/\r\n/g, "\n");
  if (!normalized.includes(marker)) throw new Error("Prevenção: grid de notícias do bloco 1.2 não encontrado");
  return normalized.replace(marker, `${marker}id="noticias-vacinacao" `);
}

const transforms = {
  portal_da_sa_de_sesau_cama_ari_home: transformHome,
  "1.0_preven_o_e_imuniza_o_sesau_cama_ari": transformPrevencao,
};

for (const dir of readdirSync(source, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  const from = join(source, dir.name);
  const to = join(target, dir.name);
  mkdirSync(to, { recursive: true });

  for (const file of readdirSync(from)) {
    if (file === "code.html") {
      let html = readFileSync(join(from, file), "utf8");
      const transform = transforms[dir.name];
      if (transform) html = transform(html);
      html = stripModuleNumbers(html, dir.name);
      if (!html.includes("</body>")) throw new Error(`${dir.name}: </body> não encontrado`);
      html = html.replace("</body>", `${BRIDGE}</body>`);
      writeFileSync(join(to, file), html);
    } else if (!existsSync(join(to, file)) || file.endsWith(".md")) {
      copyFileSync(join(from, file), join(to, file));
    }
  }
  console.log(`✓ ${dir.name}`);
}
