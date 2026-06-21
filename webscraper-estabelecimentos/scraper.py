"""
Scraper do Google Maps usando Playwright.

Extrai Nome, Telefone, Cidade - UF e CEP dos estabelecimentos,
retornando APENAS aqueles que NAO possuem website.

A funcao principal `scrape_maps` e um gerador que emite eventos:
    ("progress", "mensagem...")          -> texto de andamento
    ("result", {dict com os dados})      -> um estabelecimento sem site
    ("skipped", "mensagem...")           -> item ignorado (tinha site / sem telefone)
    ("error", "mensagem...")             -> erro recuperavel
    ("done", {"total": n, "found": m})   -> fim
"""

import re
import urllib.parse

from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

# ----------------------------------------------------------------------------
# Regex de parsing de endereco (formato brasileiro do Google Maps)
# Ex.: "Av. Paulista, 1000 - Bela Vista, Sao Paulo - SP, 01310-100, Brasil"
# ----------------------------------------------------------------------------
CEP_RE = re.compile(r"\b(\d{5})-?(\d{3})\b")
CITY_UF_RE = re.compile(r",\s*([^,]+?)\s*-\s*([A-Z]{2})\b")


def _parse_endereco(endereco: str):
    """Retorna (cidade_uf, cep) extraidos de um endereco completo."""
    cidade_uf = ""
    cep = ""

    if not endereco:
        return cidade_uf, cep

    m_cep = CEP_RE.search(endereco)
    if m_cep:
        cep = f"{m_cep.group(1)}-{m_cep.group(2)}"

    # Pega a ultima ocorrencia "Cidade - UF" (mais proxima do CEP)
    matches = CITY_UF_RE.findall(endereco)
    if matches:
        cidade, uf = matches[-1]
        cidade_uf = f"{cidade.strip()} - {uf.strip()}"

    return cidade_uf, cep


def _aceitar_consentimento(page):
    """Lida com a tela de consentimento de cookies do Google, se aparecer."""
    textos = [
        "Aceitar tudo", "Aceito tudo", "Concordo", "Rejeitar tudo",
        "Accept all", "Reject all", "I agree",
    ]
    for txt in textos:
        try:
            botao = page.get_by_role("button", name=re.compile(txt, re.I))
            if botao.count() > 0:
                botao.first.click(timeout=2500)
                page.wait_for_timeout(1500)
                return
        except Exception:
            continue


def _extrair_detalhe(page):
    """Extrai dados do painel de detalhe atualmente aberto."""
    dados = {"nome": "", "telefone": "", "cidade_uf": "", "cep": "",
             "endereco": "", "tem_site": False}

    # Nome
    try:
        dados["nome"] = page.locator("h1.DUwDvf").first.inner_text(timeout=6000).strip()
    except Exception:
        try:
            dados["nome"] = page.locator("h1").first.inner_text(timeout=2000).strip()
        except Exception:
            pass

    # Website (se existir, o estabelecimento sera ignorado)
    try:
        if page.locator('a[data-item-id="authority"]').count() > 0:
            dados["tem_site"] = True
    except Exception:
        pass

    # Telefone
    try:
        btn = page.locator('button[data-item-id^="phone:tel:"]').first
        if btn.count() > 0:
            item_id = btn.get_attribute("data-item-id") or ""
            dados["telefone"] = item_id.replace("phone:tel:", "").strip()
            if not dados["telefone"]:
                aria = btn.get_attribute("aria-label") or ""
                dados["telefone"] = re.sub(r"(?i)telefone:?\s*", "", aria).strip()
    except Exception:
        pass

    # Endereco
    try:
        btn = page.locator('button[data-item-id="address"]').first
        if btn.count() > 0:
            aria = btn.get_attribute("aria-label") or ""
            dados["endereco"] = re.sub(r"(?i)endereco:?\s*", "", aria).strip()
    except Exception:
        pass

    dados["cidade_uf"], dados["cep"] = _parse_endereco(dados["endereco"])
    return dados


def _chave_dedup(dados):
    """Chave para deduplicar o mesmo estabelecimento entre buscas diferentes."""
    nome = re.sub(r"\s+", " ", (dados.get("nome") or "")).strip().lower()
    tel = re.sub(r"\D", "", dados.get("telefone") or "")
    return f"{nome}|{tel}"


def _run_query(page, query, max_results, exigir_telefone, vistos, chaves):
    """Executa UMA busca na `page` ja aberta. Gera eventos e, ao final,
    um evento ("__proc", n) com a quantidade de itens processados."""
    url = "https://www.google.com/maps/search/" + urllib.parse.quote(query) + "?hl=pt-BR"
    processados = 0

    yield ("progress", f"Abrindo: \"{query}\"")
    page.goto(url, timeout=60000, wait_until="domcontentloaded")
    _aceitar_consentimento(page)

    feed_sel = 'div[role="feed"]'
    tem_feed = True
    try:
        page.wait_for_selector(feed_sel, timeout=15000)
    except PWTimeout:
        tem_feed = False

    def montar(dados):
        return {
            "nome": dados["nome"],
            "telefone": dados["telefone"],
            "cidade_uf": dados["cidade_uf"],
            "cep": dados["cep"],
            "endereco": dados["endereco"],
        }

    if tem_feed:
        anterior, estavel = -1, 0
        while True:
            cards = page.locator(f'{feed_sel} a.hfpxzc')
            total = cards.count()
            yield ("progress", f"\"{query}\": carregando lista... {total} estabelecimentos")
            if total >= max_results:
                break
            if page.get_by_text(re.compile("Voce chegou ao final|reached the end", re.I)).count() > 0:
                break
            if total == anterior:
                estavel += 1
                if estavel >= 4:
                    break
            else:
                estavel = 0
            anterior = total
            try:
                cards.nth(total - 1).scroll_into_view_if_needed(timeout=4000)
            except Exception:
                pass
            page.mouse.wheel(0, 3000)
            page.wait_for_timeout(1800)

        cards = page.locator(f'{feed_sel} a.hfpxzc')
        total = min(cards.count(), max_results)
        yield ("progress", f"\"{query}\": processando {total} (filtrando os sem site)...")

        for i in range(total):
            try:
                card = page.locator(f'{feed_sel} a.hfpxzc').nth(i)
                href = card.get_attribute("href") or f"{query}#{i}"
                if href in vistos:
                    continue
                vistos.add(href)
                processados += 1
                card.click(timeout=8000)
                page.wait_for_selector("h1.DUwDvf", timeout=8000)
                page.wait_for_timeout(900)
                dados = _extrair_detalhe(page)
            except Exception as e:
                yield ("error", f"Falha ao ler item {i+1} de \"{query}\": {type(e).__name__}")
                continue

            nome = dados.get("nome") or "(sem nome)"
            if dados["tem_site"]:
                yield ("skipped", f"Ignorado (tem site): {nome}")
                continue
            if exigir_telefone and not dados["telefone"]:
                yield ("skipped", f"Ignorado (sem telefone): {nome}")
                continue
            chave = _chave_dedup(dados)
            if chave in chaves:
                yield ("skipped", f"Ignorado (duplicado): {nome}")
                continue
            chaves.add(chave)
            yield ("result", montar(dados))
    else:
        # Resultado unico: o Maps abre direto o detalhe
        try:
            page.wait_for_selector("h1.DUwDvf", timeout=8000)
            dados = _extrair_detalhe(page)
            processados = 1
            ok = (not dados["tem_site"]) and (dados["telefone"] or not exigir_telefone)
            chave = _chave_dedup(dados)
            if ok and chave not in chaves:
                chaves.add(chave)
                yield ("result", montar(dados))
        except Exception:
            yield ("progress", f"\"{query}\": nenhum resultado.")

    yield ("__proc", processados)


def scrape_batch(queries, max_results=40, headless=True, exigir_telefone=True):
    """Executa varias buscas reusando o mesmo navegador, deduplicando entre elas."""
    queries = [q.strip() for q in queries if q and q.strip()]
    if not queries:
        yield ("error", "Nenhuma busca informada.")
        yield ("done", {"processados": 0, "encontrados": 0, "buscas": 0})
        return

    vistos = set()       # hrefs ja visitados (evita reprocessar entre buscas)
    chaves = set()       # nome|telefone ja incluidos (dedup de resultados)
    proc_total = 0
    found_total = 0

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=headless)
        context = browser.new_context(
            locale="pt-BR",
            viewport={"width": 1366, "height": 900},
            user_agent=("Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                        "AppleWebKit/537.36 (KHTML, like Gecko) "
                        "Chrome/131.0.0.0 Safari/537.36"),
        )
        page = context.new_page()
        try:
            for qi, query in enumerate(queries, 1):
                yield ("progress", f"[Busca {qi}/{len(queries)}] {query}")
                try:
                    for tipo, dado in _run_query(page, query, max_results,
                                                 exigir_telefone, vistos, chaves):
                        if tipo == "__proc":
                            proc_total += dado
                        elif tipo == "result":
                            found_total += 1
                            yield (tipo, dado)
                        else:
                            yield (tipo, dado)
                except Exception as e:
                    yield ("error", f"Busca \"{query}\" falhou: {type(e).__name__}: {e}")
                # Pausa entre buscas para reduzir risco de bloqueio
                if qi < len(queries):
                    page.wait_for_timeout(2500)
        finally:
            browser.close()

    yield ("done", {"processados": proc_total, "encontrados": found_total,
                    "buscas": len(queries)})


def scrape(query, max_results=40, headless=True, exigir_telefone=True):
    """Compatibilidade: uma unica busca."""
    yield from scrape_batch([query], max_results=max_results,
                            headless=headless, exigir_telefone=exigir_telefone)


if __name__ == "__main__":
    # Teste rapido pela linha de comando (uma ou mais buscas separadas por ';')
    import sys
    termo = sys.argv[1] if len(sys.argv) > 1 else "advogados em Sao Paulo"
    buscas = [t for t in termo.split(";")]
    for tipo, dado in scrape_batch(buscas, max_results=10, headless=False):
        print(tipo, "->", dado)
