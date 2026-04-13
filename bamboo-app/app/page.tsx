import Link from "next/link";
import { ArrowRight, BookOpen, PenSquare, Trophy, Users } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { XP_RULES } from "@/lib/gamification";
import { welcomeMessage, modules } from "@/lib/mock-data";

const features = [
  {
    icon: BookOpen,
    title: "Aprendizaje modular",
    text:
      "Lecciones mensuales sustanciosas, escritas para cualquier área de una agencia y enfocadas en convertir criterio en acción.",
  },
  {
    icon: Trophy,
    title: "Gamificación real",
    text:
      "XP, niveles, badges, misiones y actividades del club para sostener participación y crecimiento profesional.",
  },
  {
    icon: PenSquare,
    title: "Blog Bamboo",
    text:
      "Escribir artículos suma puntos y también posiciona a quienes transforman experiencia en conocimiento compartido.",
  },
  {
    icon: Users,
    title: "Club conectado",
    text:
      "Cursos, talleres, retos y conversaciones que empujan a la gente a trabajar con más valentía, método e impacto.",
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="pill">Texo · Bamboo · Club de innovación</span>
            <h1>{welcomeMessage.title}</h1>

            {welcomeMessage.body.map((paragraph) => (
              <p key={paragraph} style={{ lineHeight: 1.8 }}>
                {paragraph}
              </p>
            ))}

            <div className="card panel accent-panel" style={{ marginTop: 24 }}>
              <strong>{welcomeMessage.cta}</strong>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
              <Link href="/join" className="btn btn-primary">
                Quiero sumarme al club
              </Link>
              <Link href="/modules" className="btn btn-secondary">
                Explorar contenidos
              </Link>
            </div>

            <div className="grid three-up" style={{ marginTop: 32 }}>
              <StatCard
                label="Módulos iniciales"
                value={String(modules.length)}
                hint="Contenido real para demo"
              />
              <StatCard
                label="Actividades gamificadas"
                value="11"
                hint="Incluye blog y talleres"
              />
              <StatCard
                label="Modo de despliegue"
                value="Vercel"
                hint="GitHub + variables de entorno"
              />
            </div>
          </div>

          <div className="card panel">
            <h2 style={{ marginTop: 0 }}>Qué incluye esta primera versión</h2>

            <div className="feature-list">
              {features.map(({ icon: Icon, title, text }) => (
                <div key={title} className="feature-item">
                  <Icon size={20} />
                  <div>
                    <strong>{title}</strong>
                    <div className="muted">{text}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="subpanel" style={{ marginTop: 20 }}>
              <strong>Para qué sirve Bamboo</strong>
              <p className="muted" style={{ marginBottom: 0, lineHeight: 1.7 }}>
                Para mostrarle al holding que Bamboo no es una idea suelta. Es una forma concreta
                de desarrollar talento, activar cultura y ayudar a que cada persona encuentre
                nuevas maneras de crecer dentro de su carrera.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container two-col">
          <div className="card panel">
            <h2 style={{ marginTop: 0 }}>Reglas de puntos</h2>
            <ul className="list-clean">
              {XP_RULES.map((rule) => (
                <li key={rule.label} className="item-row">
                  <span>{rule.label}</span>
                  <strong>+{rule.points} XP</strong>
                </li>
              ))}
            </ul>
          </div>

          <div className="card panel">
            <h2 style={{ marginTop: 0 }}>Tu primer movimiento</h2>
            <p className="muted" style={{ lineHeight: 1.7 }}>
              Sumarte al club deja trazabilidad desde el arranque. El formulario ya envía nombre,
              apellido, mail, teléfono, agencia y área a Google Sheets usando Apps Script.
            </p>
            <Link href="/join" className="btn btn-primary">
              Ir al formulario <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
