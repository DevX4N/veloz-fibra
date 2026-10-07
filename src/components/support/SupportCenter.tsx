"use client";

import { Search, X, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { helpArticles, supportCategories } from "@/data/content";
import { Icon } from "@/components/ui/Icon";
import { Accordion } from "@/components/ui/Accordion";
import { EmptyState } from "@/components/ui/EmptyState";
import { trackEvent } from "@/lib/analytics";

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function SupportSearch() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = norm(query.trim());
    return helpArticles.filter((a) => {
      if (category && a.category !== category) return false;
      if (!q) return true;
      return norm(a.title + " " + a.body.join(" ")).includes(q);
    });
  }, [query, category]);

  const catLabel = supportCategories.find((c) => c.id === category)?.label;

  return (
    <div className="support">
      <form className="support__search" role="search" onSubmit={(e) => { e.preventDefault(); trackEvent("support_started", { via: "search" }); }}>
        <label htmlFor="help-q" className="sr-only">
          Pesquise sua dúvida
        </label>
        <Search size={20} aria-hidden="true" className="support__search-icon" />
        <input
          id="help-q"
          type="search"
          className="support__input"
          placeholder="Pesquise sua dúvida..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
        {query && (
          <button type="button" className="icon-btn" onClick={() => setQuery("")} aria-label="Limpar busca">
            <X size={18} />
          </button>
        )}
      </form>

      <ul className="support__cats" aria-label="Categorias">
        {supportCategories.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              className="support__cat"
              aria-pressed={category === c.id}
              onClick={() => {
                setCategory(category === c.id ? null : c.id);
                trackEvent("support_started", { via: "category", category: c.id });
              }}
            >
              <span className="icon-tile icon-tile--sm">
                <Icon name={c.icon} size={18} />
              </span>
              <span>{c.label}</span>
              <ChevronRight size={16} aria-hidden="true" className="support__cat-chev" />
            </button>
          </li>
        ))}
      </ul>

      <div className="support__results">
        <div className="support__results-head" aria-live="polite">
          <h2 className="h-4">
            {query || category ? `${results.length} ${results.length === 1 ? "resultado" : "resultados"}` : "Artigos mais acessados"}
            {catLabel && <span className="muted"> em {catLabel}</span>}
          </h2>
          {(query || category) && (
            <button type="button" className="text-btn" onClick={() => { setQuery(""); setCategory(null); }}>
              Limpar filtros
            </button>
          )}
        </div>
        {results.length === 0 ? (
          <div className="card">
            <EmptyState
              icon="help"
              title="Nenhum artigo encontrado"
              text={`Não encontramos resultados para “${query}”. Tente outras palavras ou fale com nossa equipe.`}
            />
          </div>
        ) : (
          <div className="card support__list" key={`${query}-${category}`}>
            <Accordion
              items={(query || category ? results : results.slice(0, 7)).map((a) => ({
                id: a.id,
                title: a.title,
                content: (
                  <>
                    {a.body.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </>
                ),
              }))}
            />
          </div>
        )}
      </div>
    </div>
  );
}
