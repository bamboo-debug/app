import { ClubSignupForm } from "@/components/club-signup-form";
import { welcomeMessage } from "@/lib/mock-data";

export default function JoinPage() {
  return (
    <main className="section">
      <div className="container two-col">
        <section className="grid">
          <div>
            <span className="pill">Club de innovación Bamboo</span>
            <h1>{welcomeMessage.title}</h1>

            {welcomeMessage.body.map((paragraph) => (
              <p key={paragraph} className="muted" style={{ lineHeight: 1.8 }}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className="card panel accent-panel">
            <strong style={{ fontSize: "1.05rem" }}>{welcomeMessage.cta}</strong>
            <p style={{ marginBottom: 0, lineHeight: 1.7 }}>
              Dejá tus datos para formar parte del club. El formulario guarda las inscripciones en
              Google Sheets a través de Apps Script para que el equipo organizador pueda centralizar
              el interés desde una sola base.
            </p>
          </div>

          <div className="card panel">
            <h2 style={{ marginTop: 0 }}>Qué vas a encontrar en Bamboo</h2>
            <ul className="list-clean">
              <li className="item-row">
                <span>Lecciones mensuales con progreso visible</span>
                <strong>Ruta por niveles</strong>
              </li>
              <li className="item-row">
                <span>Talleres, cursos y retos que suman puntos</span>
                <strong>Gamificación real</strong>
              </li>
              <li className="item-row">
                <span>Blog para compartir aprendizaje aplicado</span>
                <strong>Visibilidad interna</strong>
              </li>
              <li className="item-row">
                <span>Formación transversal para cualquier área</span>
                <strong>Crecimiento de carrera</strong>
              </li>
            </ul>
          </div>
        </section>

        <aside>
          <ClubSignupForm />
        </aside>
      </div>
    </main>
  );
}
