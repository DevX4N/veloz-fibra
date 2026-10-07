import { stats } from "@/data/content";
import { CountUp } from "@/components/ui/CountUp";

export function Stats() {
  return (
    <section className="stats" aria-label="Números da Veloz Fibra">
      <div className="container">
        <dl className="stats__list">
          {stats.map((s) => (
            <div key={s.label} className="stats__item">
              <dt className="stats__label">{s.label}</dt>
              <dd className="stats__value">
                <CountUp value={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
        <p className="stats__note">Números demonstrativos.</p>
      </div>
    </section>
  );
}
