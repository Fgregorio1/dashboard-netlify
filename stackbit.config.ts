import path from "node:path";
import { fileURLToPath } from "node:url";
import { GitContentSource } from "@stackbit/cms-git";
import { defineStackbitConfig } from "@stackbit/types";
import type { DocumentWithSource, Field, SiteMapEntry } from "@stackbit/types";

function documentSitemapLabel(doc: DocumentWithSource): string {
  const title = doc.fields.title;
  if (title && "value" in title && typeof title.value === "string" && title.value.trim()) {
    return title.value.trim();
  }
  const code = doc.fields.code;
  if (code && "value" in code && typeof code.value === "string" && code.value.trim()) {
    return `${doc.modelName} (${code.value.trim()})`;
  }
  return `${doc.modelName} · ${doc.id}`;
}

const rootPath = path.dirname(fileURLToPath(import.meta.url));

const lessonFormFields: Field[] = [
  { name: "id", type: "string", label: "ID", required: true },
  { name: "title", type: "string", label: "Título", required: true },
  {
    name: "level",
    type: "enum",
    label: "Nível",
    required: true,
    options: [
      { label: "Iniciante", value: "Iniciante" },
      { label: "Intermediário", value: "Intermediário" },
      { label: "Todos", value: "Todos" },
    ],
  },
  { name: "duration", type: "string", label: "Duração", required: true },
  { name: "tag", type: "string", label: "Tag / dia" },
  { name: "hook", type: "text", label: "Gancho (abertura)", required: true },
  {
    name: "teach",
    type: "list",
    label: "O que ensinar (ponto a ponto)",
    items: { type: "string" },
  },
  { name: "example", type: "text", label: "Exemplo / história" },
  { name: "task", type: "text", label: "Tarefa do aluno", required: true },
  { name: "closing", type: "text", label: "Frase de encerramento", required: true },
];

export default defineStackbitConfig({
  stackbitVersion: "~0.7.0",
  nodeVersion: "20",
  ssgName: "custom",
  /** Single-page app: all JSON documents map to `/` so the Visual Editor site map loads. */
  sitemap: ({ documents }): SiteMapEntry[] => {
    const home: SiteMapEntry = {
      urlPath: "/",
      label: "Currículo",
      stableId: "latinuspro-spa-home",
      isHomePage: true,
    };
    const byDoc: SiteMapEntry[] = documents.map((doc) => ({
      urlPath: "/",
      label: documentSitemapLabel(doc),
      stableId: `doc:${doc.srcType}:${doc.srcProjectId}:${doc.id}`,
      document: {
        srcType: doc.srcType,
        srcProjectId: doc.srcProjectId,
        modelName: doc.modelName,
        id: doc.id,
      },
    }));
    return [home, ...byDoc];
  },
  devCommand: "npm run dev -- --port {PORT} --host {HOSTNAME}",
  experimental: {
    ssg: {
      name: "Vite",
      logPatterns: {
        up: ["ready in", "Local:", "VITE"],
      },
      passthrough: ["/vite-hmr/**"],
      proxyWebsockets: true,
    },
  },
  contentSources: [
    new GitContentSource({
      rootPath,
      contentDirs: ["src/content"],
      models: [
        {
          name: "module",
          type: "data",
          label: "Módulo (currículo)",
          match: "modules/M*.json",
          fields: [
            { name: "type", type: "string", const: "module", hidden: true },
            { name: "code", type: "string", label: "Código (ex. M1)", required: true },
            { name: "title", type: "string", label: "Título do módulo", required: true },
            { name: "goal", type: "text", label: "Objetivo do módulo", required: true },
            {
              name: "lessons",
              type: "list",
              label: "Aulas",
              items: {
                type: "object",
                labelField: "title",
                fields: lessonFormFields,
              },
            },
          ],
        },
        {
          name: "site",
          type: "data",
          label: "Site (pilares, jornada, abas)",
          singleInstance: true,
          filePath: "site.json",
          fields: [
            { name: "type", type: "string", const: "site", hidden: true },
            {
              name: "pillars",
              type: "list",
              label: "Pilares",
              items: {
                type: "object",
                labelField: "title",
                fields: [
                  { name: "n", type: "string", label: "Nº", required: true },
                  { name: "title", type: "string", label: "Título", required: true },
                  { name: "subtitle", type: "string", label: "Subtítulo", required: true },
                  { name: "body", type: "text", label: "Descrição", required: true },
                  { name: "science", type: "text", label: "Nota científica", required: true },
                ],
              },
            },
            {
              name: "path",
              type: "list",
              label: "Jornada (tabela)",
              items: {
                type: "object",
                labelField: "title",
                fields: [
                  { name: "step", type: "string", label: "Passo", required: true },
                  { name: "title", type: "string", label: "Título", required: true },
                  { name: "note", type: "text", label: "Nota", required: true },
                ],
              },
            },
            {
              name: "tabs",
              type: "list",
              label: "Abas de navegação",
              items: {
                type: "object",
                labelField: "label",
                fields: [
                  { name: "id", type: "string", label: "ID", required: true },
                  { name: "label", type: "string", label: "Rótulo", required: true },
                ],
              },
            },
          ],
        },
        {
          name: "onboarding",
          type: "data",
          label: "Onboarding (primeiros 7 dias)",
          singleInstance: true,
          filePath: "onboarding.json",
          fields: [
            { name: "type", type: "string", const: "onboarding", hidden: true },
            {
              name: "lessons",
              type: "list",
              label: "Dias",
              items: {
                type: "object",
                labelField: "title",
                fields: lessonFormFields,
              },
            },
          ],
        },
        {
          name: "beliefs",
          type: "data",
          label: "Quebra de crenças",
          singleInstance: true,
          filePath: "beliefs.json",
          fields: [
            { name: "type", type: "string", const: "beliefs", hidden: true },
            {
              name: "lessons",
              type: "list",
              label: "Aulas",
              items: {
                type: "object",
                labelField: "title",
                fields: lessonFormFields,
              },
            },
          ],
        },
      ],
    }),
  ],
});
