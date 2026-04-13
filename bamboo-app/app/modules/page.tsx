import { ModuleCard } from '@/components/module-card';
import { modules } from '@/lib/mock-data';
export default function ModulesPage() {
  return <main className="section"><div className="container"><span className="pill">Ruta de aprendizaje</span><h1>Módulos Bamboo</h1><p className="muted" style={{ lineHeight: 1.8 }}>Diseñados para cualquier área de una agencia. El objetivo no es solo enseñar conceptos, sino empujar a que cada persona gane más criterio, más valentía y más capacidad de mover ideas hacia adelante.</p><div className="module-track" style={{ marginTop: 28 }}>{modules.map((module) => <ModuleCard key={module.id} module={module} />)}</div></div></main>;
}
