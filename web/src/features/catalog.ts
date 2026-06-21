import type { FeatureDef } from '../types/features';

/**
 * Known features — new stories can introduce ids not listed here;
 * unknown ids are shown with the id as label until added to catalog.
 */
export const FEATURE_CATALOG: Record<string, FeatureDef> = {
  cpp: {
    id: 'cpp',
    label: 'C++',
    topic: 'cpp',
    description: 'Moderni C++ — kieli kokonaisuutena',
  },
  'cpp:auto': {
    id: 'cpp:auto',
    label: 'auto',
    topic: 'cpp',
    group: 'syntax',
    description: 'Tyyppipäättely',
  },
  'cpp:nullptr': {
    id: 'cpp:nullptr',
    label: 'nullptr',
    topic: 'cpp',
    group: 'pointers',
    description: 'Tyypitetty null-osoitin',
  },
  'cpp:range-for': {
    id: 'cpp:range-for',
    label: 'range-for',
    topic: 'cpp',
    group: 'iteration',
    description: 'Kokoelmien läpikäynti',
  },
  'cpp:const-correctness': {
    id: 'cpp:const-correctness',
    label: 'const-correctness',
    topic: 'cpp',
    group: 'safety',
    description: 'Muuttumattomuus ja intentio',
  },
  'cpp:const-ref': {
    id: 'cpp:const-ref',
    label: 'const &',
    topic: 'cpp',
    group: 'safety',
    description: 'Tehokas lukeminen ilman kopiota',
  },
  'cpp:pass-by-value': {
    id: 'cpp:pass-by-value',
    label: 'pass-by-value',
    topic: 'cpp',
    group: 'safety',
    description: 'Yksinkertaiset tyypit arvona',
  },
  'cpp:const-method': {
    id: 'cpp:const-method',
    label: 'const-metodi',
    topic: 'cpp',
    group: 'safety',
    description: 'Metodi joka ei muuta tilaa',
  },
  'cpp:unique-ptr': {
    id: 'cpp:unique-ptr',
    label: 'unique_ptr',
    topic: 'cpp',
    group: 'memory',
    description: 'Yksinomistettu dynaaminen objekti',
  },
  'cpp:make-unique': {
    id: 'cpp:make-unique',
    label: 'make_unique',
    topic: 'cpp',
    group: 'memory',
    description: 'Turvallinen unique_ptr-luonti',
  },
  'cpp:shared-ptr': {
    id: 'cpp:shared-ptr',
    label: 'shared_ptr',
    topic: 'cpp',
    group: 'memory',
    description: 'Jaettu omistus',
  },
  'cpp:std-vector': {
    id: 'cpp:std-vector',
    label: 'std::vector',
    topic: 'cpp',
    group: 'containers',
    description: 'Dynaaminen taulukko',
  },
  'cpp:static-cast': {
    id: 'cpp:static-cast',
    label: 'static_cast',
    topic: 'cpp',
    group: 'types',
    description: 'Turvallinen tyypinmuunnos',
  },
  'cpp:exceptions': {
    id: 'cpp:exceptions',
    label: 'poikkeukset',
    topic: 'cpp',
    group: 'errors',
    description: 'Virheet joita ei voi sivuuttaa',
  },
  'cpp:error-handling': {
    id: 'cpp:error-handling',
    label: 'virheenkäsittely',
    topic: 'cpp',
    group: 'errors',
    description: 'Paluuarvojen vs poikkeusten riskit',
  },
  'cpp:type-safety': {
    id: 'cpp:type-safety',
    label: 'typeturvallisuus',
    topic: 'cpp',
    group: 'safety',
    description: 'Vältä typeturvattomia API:ta',
  },
  'cpp:variadic-templates': {
    id: 'cpp:variadic-templates',
    label: 'variadic template',
    topic: 'cpp',
    group: 'templates',
    description: 'Turvallinen vaihteleva argumenttimäärä',
  },
  'cpp:templates': {
    id: 'cpp:templates',
    label: 'template',
    topic: 'cpp',
    group: 'templates',
    description: 'Yleistetyt funktiot ja luokat',
  },
  'cpp:std-format': {
    id: 'cpp:std-format',
    label: 'std::format',
    topic: 'cpp',
    group: 'io',
    description: 'Typeturvallinen muotoilu',
  },
};

export function getFeatureDef(id: string): FeatureDef {
  return (
    FEATURE_CATALOG[id] ?? {
      id,
      label: id.includes(':') ? id.split(':').pop()! : id,
      topic: id.split(':')[0] ?? 'unknown',
    }
  );
}

export function getTopicLabel(topic: string): string {
  return FEATURE_CATALOG[topic]?.label ?? topic.toUpperCase();
}

/** Visual intensity 0–1 from unbounded karma (log curve, no max) */
export function karmaGlow(karma: number): number {
  if (karma <= 0) return 0;
  return Math.min(1, Math.log10(karma + 1) / 2);
}
