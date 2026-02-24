import Papa from 'papaparse';
import csvRaw from '../data/sages_femmes_final.csv?raw';

export type Midwife = {
  nom: string;
  lieu_travail?: string;
  ville: string;
  npa?: string;
  telephone_mobile?: string;
  disponibilite?: string;
  profil?: string;
  photo_url?: string;
  specialites?: string;
  langues?: string;
  site_web?: string;
};

let cachedMidwives: Midwife[] | null = null;

export async function getMidwives(): Promise<Midwife[]> {
  if (cachedMidwives) return cachedMidwives;

  const parsed = Papa.parse<Midwife>(csvRaw, {
    header: true,
    skipEmptyLines: true,
  });

  const rows = (parsed.data || []).filter((row) => row.nom && row.ville);
  cachedMidwives = rows;
  return rows;
}

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getMidwifeSlug(m: Midwife): string {
  const base = `${m.nom}-${m.ville}`;
  return slugify(base);
}

export type TopCity = {
  name: string;
  count: number;
};

export function getTopCities(
  midwives: Midwife[],
  cityNames: string[]
): TopCity[] {
  const counts: Record<string, number> = {};
  for (const name of cityNames) {
    counts[name.toLowerCase()] = 0;
  }

  for (const m of midwives) {
    const city = (m.ville || '').toLowerCase();
    for (const target of cityNames) {
      if (city === target.toLowerCase()) {
        counts[target.toLowerCase()] += 1;
      }
    }
  }

  return cityNames.map((name) => ({
    name,
    count: counts[name.toLowerCase()] ?? 0,
  }));
}

