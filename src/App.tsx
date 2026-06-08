import { useState } from "react";
import "./App.css";
import {
  BELIEF_LESSONS,
  JOURNEY,
  ONBOARDING_LESSONS,
  PATH,
  PILLARS,
  TABS,
  type Lesson,
} from "./curriculumContent";

type TabId = (typeof TABS)[number]["id"];

function findLesson(id: string): { lesson: Lesson; sourceLabel: string } | null {
  for (const m of JOURNEY) {
    const found = m.lessons.find((l) => l.id === id);
    if (found) return { lesson: found, sourceLabel: `${m.code} · ${m.title}` };
  }
  const onb = ONBOARDING_LESSONS.find((l) => l.id === id);
  if (onb) return { lesson: onb, sourceLabel: "Onboarding · Primeiros 7 Dias" };
  const bel = BELIEF_LESSONS.find((l) => l.id === id);
  if (bel) return { lesson: bel, sourceLabel: "Módulo · Quebra de Crenças" };
  return null;
}

function levelClass(level: Lesson["level"]): string {
  if (level === "Iniciante") return "badge success";
  if (level === "Intermediário") return "badge info";
  return "badge neutral";
}

function LessonDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const found = findLesson(id);
  if (!found) return null;
  const { lesson, sourceLabel } = found;
  return (
    <div className="stack">
      <div className="row">
        <button type="button" className="btn" onClick={onBack}>
          ← Voltar
        </button>
        <span className="badge neutral">{sourceLabel}</span>
        {lesson.tag && <span className="badge neutral">{lesson.tag}</span>}
        {lesson.level !== "Todos" && (
          <span className={levelClass(lesson.level)}>{lesson.level}</span>
        )}
        <span className="badge neutral">{lesson.duration}</span>
      </div>
      <h2>{lesson.title}</h2>
      <p className="muted">Roteiro de gravação — leia, adapte ao seu jeito e grave.</p>
      <div className="callout">
        <div className="callout-title">Abertura / Gancho (primeiros 15 segundos)</div>
        <div>{lesson.hook}</div>
      </div>
      <div className="card">
        <div className="card-header">O que ensinar (ponto a ponto)</div>
        <div className="card-body">
          <ol className="teach-list">
            {lesson.teach.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ol>
        </div>
      </div>
      {lesson.example && (
        <div className="card">
          <div className="card-header">Exemplo / História para contar</div>
          <div className="card-body">{lesson.example}</div>
        </div>
      )}
      <div className="callout success">
        <div className="callout-title">Tarefa do aluno (o que pedir no fim da aula)</div>
        <div>{lesson.task}</div>
      </div>
      <div>
        <p className="muted" style={{ marginBottom: 4 }}>
          Frase de encerramento
        </p>
        <p style={{ fontStyle: "italic" }}>&ldquo;{lesson.closing}&rdquo;</p>
      </div>
    </div>
  );
}

function Overview() {
  return (
    <div className="stack">
      <h2>Os 4 pilares</h2>
      <p className="muted">
        75% metodologia/mentalidade, 25% fundamentos. O sistema de recompensa (streaks,
        vocabulário, pods, marcos) é transversal.
      </p>
      <div className="grid-2">
        {PILLARS.map((p) => (
          <div key={p.n} className="card">
            <div className="card-header">
              <span>
                Pilar {p.n} · {p.title}
              </span>
              <span className="muted" style={{ fontSize: "0.75rem" }}>
                {p.subtitle}
              </span>
            </div>
            <div className="card-body">
              <p>{p.body}</p>
              <div className="callout">
                <div>{p.science}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="divider" />
      <div className="callout success">
        <div className="callout-title">Um caminho, dois pontos de partida</div>
        <p>
          Não existem trilhas separadas. Todo aluno segue a mesma jornada; o nível só muda o
          material de imersão e quais aulas de gramática pegar.
        </p>
      </div>
      <h2>Organização do Classroom (a jornada única)</h2>
      <table className="data">
        <thead>
          <tr>
            <th>#</th>
            <th>Módulo</th>
            <th>O que é</th>
          </tr>
        </thead>
        <tbody>
          {PATH.map((p) => (
            <tr key={p.step}>
              <td>{p.step}</td>
              <td>{p.title}</td>
              <td>{p.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Onboarding({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="stack">
      <h2>Primeiros 7 Dias — a vitória rápida</h2>
      <p className="muted">
        Clique em &quot;Ver roteiro&quot; para o script completo de cada dia.
      </p>
      <div className="callout success">
        <div className="callout-title">Meta da semana 1</div>
        Sistema de imersão, tracker, primeira sessão, vitória pública e meta de 90 dias.
      </div>
      <div className="stack">
        {ONBOARDING_LESSONS.map((l) => (
          <div key={l.id} className="card">
            <div className="card-header">
              <span>{l.title}</span>
              {l.tag && <span className="badge neutral">{l.tag}</span>}
            </div>
            <div className="card-body">
              <div className="lesson-row">
                <p className="muted" style={{ flex: 1, margin: 0 }}>
                  {l.task}
                </p>
                <button type="button" className="btn" onClick={() => onOpen(l.id)}>
                  Ver roteiro
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Journey({ onOpen }: { onOpen: (id: string) => void }) {
  const totalLessons = JOURNEY.reduce((s, m) => s + m.lessons.length, 0);
  return (
    <div className="stack">
      <h2>A Jornada do Aluno (currículo único)</h2>
      <p className="muted">Clique em &quot;Ver roteiro&quot; em qualquer aula.</p>
      <div className="grid-3">
        <div className="stat">
          <div className="stat-value">{JOURNEY.length}</div>
          <div className="stat-label">Módulos</div>
        </div>
        <div className="stat">
          <div className="stat-value">{totalLessons}</div>
          <div className="stat-label">Aulas com roteiro</div>
        </div>
        <div className="stat">
          <div className="stat-value">90 dias</div>
          <div className="stat-label">1ª conversa real</div>
        </div>
      </div>
      <p className="muted" style={{ fontSize: "0.8rem" }}>
        <span className="badge success">Iniciante</span>{" "}
        <span className="badge info">Intermediário</span> — sem marca = todos
      </p>
      {JOURNEY.map((m) => (
        <details key={m.code} className="module">
          <summary>
            {m.code} · {m.title}{" "}
            <span className="badge info" style={{ float: "right" }}>
              {m.lessons.length} aulas
            </span>
          </summary>
          <div className="lesson-list">
            <p className="goal-italic">{m.goal}</p>
            {m.lessons.map((l, i) => (
              <div key={l.id} className="lesson-row">
                <span className="muted">{i + 1}.</span>
                <span style={{ flex: 1 }}>{l.title}</span>
                {l.level !== "Todos" && (
                  <span className={levelClass(l.level)}>{l.level}</span>
                )}
                <button type="button" className="btn" onClick={() => onOpen(l.id)}>
                  Ver roteiro
                </button>
              </div>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}

function Beliefs({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="stack">
      <h2>Quebra de Crenças</h2>
      <p className="muted">Mito → Realidade → Ação. Clique em &quot;Ver roteiro&quot;.</p>
      {BELIEF_LESSONS.map((b) => (
        <div key={b.id} className="card">
          <div className="card-header">
            <span>&ldquo;{b.title}&rdquo;</span>
            {b.tag && <span className="badge warning">{b.tag}</span>}
          </div>
          <div className="card-body">
            <div className="lesson-row">
              <p className="muted" style={{ flex: 1, margin: 0 }}>
                {b.hook}
              </p>
              <button type="button" className="btn" onClick={() => onOpen(b.id)}>
                Ver roteiro
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Calls() {
  return (
    <div className="stack">
      <h2>Calls semanais & rituais de engajamento</h2>
      <p className="muted">Duas calls por semana. Retenção vem de progresso e pertencimento.</p>
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            Call 1 · Fundamentos <span className="badge info">Pilar 04</span>
          </div>
          <div className="card-body">
            <p>Gramática sob demanda, tema rotativo, Q&A. Gravada no Vault.</p>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            Call 2 · Conversation Club <span className="badge success">Pilar 03</span>
          </div>
          <div className="card-body">
            <p>Fala em inglês em grupos por nível. Abre com vitórias + accountability.</p>
          </div>
        </div>
      </div>
      <h3>Rituais que combatem o churn</h3>
      <div className="grid-2">
        <div className="callout neutral">
          <div className="callout-title">Streak de imersão</div>
          Log diário/semanal na comunidade.
        </div>
        <div className="callout neutral">
          <div className="callout-title">Pods de accountability</div>
          Grupos pequenos por nível.
        </div>
        <div className="callout neutral">
          <div className="callout-title">Matchmaking de parceiro</div>
          Diretório interno.
        </div>
        <div className="callout neutral">
          <div className="callout-title">Marcos celebrados</div>
          1ª conversa, 1.000 palavras, etc.
        </div>
      </div>
      <div className="callout warning">
        <div className="callout-title">Atenção no lançamento</div>
        Comunidade vazia mata conversão — semeie atividade e matches manuais no início.
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState<TabId>("overview");
  const [openLesson, setOpenLesson] = useState<string | null>(null);
  const [returnTab, setReturnTab] = useState<TabId>("overview");

  function openFrom(t: TabId) {
    return (id: string) => {
      setReturnTab(t);
      setOpenLesson(id);
    };
  }

  return (
    <div className="app">
      <h1>LatinusPro — Currículo da Comunidade</h1>
      <p className="muted">
        Comunidade Skool para brasileiros: método, imersão e conexão real. Entrega em português,
        prática em inglês.
      </p>
      <div className="stats">
        <div className="stat">
          <div className="stat-value">R$297</div>
          <div className="stat-label">por mês</div>
        </div>
        <div className="stat">
          <div className="stat-value">1</div>
          <div className="stat-label">caminho (níveis)</div>
        </div>
        <div className="stat">
          <div className="stat-value">2</div>
          <div className="stat-label">calls / semana</div>
        </div>
        <div className="stat">
          <div className="stat-value">90 dias</div>
          <div className="stat-label">1ª conversa real</div>
        </div>
      </div>

      {openLesson ? (
        <LessonDetail
          id={openLesson}
          onBack={() => {
            setOpenLesson(null);
            setTab(returnTab);
          }}
        />
      ) : (
        <>
          <div className="tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={tab === t.id ? "pill active" : "pill"}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="divider" />
          {tab === "overview" && <Overview />}
          {tab === "onboarding" && <Onboarding onOpen={openFrom("onboarding")} />}
          {tab === "journey" && <Journey onOpen={openFrom("journey")} />}
          {tab === "beliefs" && <Beliefs onOpen={openFrom("beliefs")} />}
          {tab === "calls" && <Calls />}
        </>
      )}

      <p className="footer-note">
        Conteúdo editável em <code>src/content/</code> (Git CMS / Netlify Visual Editor). Build:{" "}
        <code>npm run build</code>.
      </p>
    </div>
  );
}
