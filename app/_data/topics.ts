export type Topic = { name: string; slug: string };

export const TOPICS: Topic[] = [
  { name: "Statyba", slug: "statyba" },
  { name: "Žinios", slug: "zinios" },
  { name: "Bitynas", slug: "bitynas" },
  { name: "Spiečiai", slug: "spieciai" },
];

export const topicByName = (name: string) => TOPICS.find(t => t.name === name);

export const topicBySlug = (slug: string) => TOPICS.find(t => t.slug === slug);
