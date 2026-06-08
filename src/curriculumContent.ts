import type { Lesson, Module } from "./curriculumTypes";
import beliefsJson from "./content/beliefs.json";
import siteJson from "./content/site.json";
import onboardingJson from "./content/onboarding.json";
import m1 from "./content/modules/M1.json";
import m2 from "./content/modules/M2.json";
import m3 from "./content/modules/M3.json";
import m4 from "./content/modules/M4.json";
import m5 from "./content/modules/M5.json";
import m6 from "./content/modules/M6.json";
import m7 from "./content/modules/M7.json";

function stripDiscriminator<T extends { type?: string }>(doc: T): Omit<T, "type"> {
  const { type: _t, ...rest } = doc;
  return rest as Omit<T, "type">;
}

const modulesRaw = [m1, m2, m3, m4, m5, m6, m7].map(stripDiscriminator) as Module[];

export const JOURNEY: Module[] = [...modulesRaw].sort((a, b) =>
  a.code.localeCompare(b.code, undefined, { numeric: true }),
);

const site = stripDiscriminator(siteJson) as {
  pillars: (typeof siteJson)["pillars"];
  path: (typeof siteJson)["path"];
  tabs: (typeof siteJson)["tabs"];
};

export const PILLARS = site.pillars;
export const PATH = site.path;
export const TABS = site.tabs;

export const ONBOARDING_LESSONS = onboardingJson.lessons as Lesson[];
export const BELIEF_LESSONS = beliefsJson.lessons as Lesson[];

export type { Lesson, Level, Module } from "./curriculumTypes";
