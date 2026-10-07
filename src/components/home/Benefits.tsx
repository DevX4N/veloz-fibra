import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

export function Benefits({
  id = "beneficios",
  title = "Muito mais que velocidade",
  text = "Uma internet preparada para tudo que faz parte da sua rotina.",
  items,
  columns = 3,
}: {
  id?: string;
  title?: string;
  text?: string;
  items: { icon: IconName; title: string; text: string }[];
  columns?: 3 | 4;
}) {
  return (
    <section id={id} className="section section--white section--line" aria-labelledby={`${id}-title`}>
      <div className="container">
        <div className="section-head section-head--row">
          <div>
            <h2 id={`${id}-title`} className="h-2">
              {title}
            </h2>
          </div>
          <p className="lead" style={{ maxWidth: 420 }}>
            {text}
          </p>
        </div>
        <ul className={`benefits benefits--${columns}`}>
          {items.map((b, i) => (
            <Reveal as="li" key={b.title} className="benefit" delay={(i % columns) * 70}>
              <Icon name={b.icon} size={24} className="benefit__icon" />
              <h3 className="h-4">{b.title}</h3>
              <p>{b.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
