import type { Module } from '@/lib/types';
export function ModuleCard({ module }: { module: Module }) {
  return (
    <article className="card module-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <span className="tag">{module.theme}</span>
        <span className="tag">{module.month}</span>
      </div>
      <div>
        <h3 style={{ margin: '0 0 8px' }}>{module.title}</h3>
        <p className="muted" style={{ margin: '0 0 12px' }}>{module.description}</p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>{module.opening}</p>
      </div>
      <div className="grid" style={{ gap: 14 }}>
        {module.sections.map((section) => (
          <div key={section.heading} className="subpanel">
            <strong style={{ display: 'block', marginBottom: 8 }}>{section.heading}</strong>
            <p className="muted" style={{ margin: 0, lineHeight: 1.7 }}>{section.body}</p>
          </div>
        ))}
      </div>
      <div className="subpanel"><strong>Ejercicio práctico</strong><p style={{ marginBottom: 0, lineHeight: 1.7 }}>{module.exercise}</p></div>
      <div className="subpanel">
        <strong>Chequeo de aprendizaje</strong>
        <p style={{ margin: '8px 0' }}>{module.quiz.question}</p>
        <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>{module.quiz.options.map((option) => <li key={option}>{option}</li>)}</ol>
        <p className="muted" style={{ marginBottom: 0, marginTop: 12 }}>Respuesta esperada: {module.quiz.options[module.quiz.correct]}. {module.quiz.explanation}</p>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><span className="pill">{module.lessons} lecciones</span><span className="pill">+{module.xp_reward} XP</span><span className="pill">Nivel {module.level_required}</span></div>
      <div className="subpanel accent-panel"><strong>Idea fuerza</strong><p style={{ margin: '8px 0 0', lineHeight: 1.7 }}>{module.takeaway}</p></div>
      <div style={{ fontWeight: 700 }}>Estado: {module.status === 'completed' ? 'Completado' : module.status === 'available' ? 'Disponible' : 'Bloqueado'}</div>
    </article>
  );
}
