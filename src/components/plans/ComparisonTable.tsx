import Link from "next/link";
import { comparisonRows, residentialPlans } from "@/data/plans";
import { formatPrice } from "@/utils/format";

/** Comparativo lado a lado. No mobile vira rolagem horizontal contida (sem estourar a página). */
export function ComparisonTable() {
  return (
    <div className="compare" role="region" aria-label="Comparativo de planos" tabIndex={0}>
      <table className="compare__table">
        <caption className="sr-only">Comparativo dos planos residenciais</caption>
        <thead>
          <tr>
            <th scope="col">Recurso</th>
            {residentialPlans.map((p) => (
              <th key={p.id} scope="col" className={p.featured ? "is-featured" : ""}>
                <span className="compare__plan">{p.name}</span>
                {p.price !== null && <span className="compare__price">{formatPrice(p.price)}/mês</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparisonRows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              {residentialPlans.map((p) => (
                <td key={p.id} className={p.featured ? "is-featured" : ""}>
                  {row.value(p)}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <th scope="row">
              <span className="sr-only">Contratar</span>
            </th>
            {residentialPlans.map((p) => (
              <td key={p.id} className={p.featured ? "is-featured" : ""}>
                <Link href={`/assine?plano=${p.id}`} className={`btn btn--sm ${p.featured ? "btn--primary" : "btn--secondary"}`}>
                  Assinar {p.name}
                </Link>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
