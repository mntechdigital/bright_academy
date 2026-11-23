export type StudentGroup = "Science" | "Business" | "Humanity";

type GroupMap = Record<StudentGroup, string>;

export type CombinedRowDef = {
  key: string;
  displayKey: string;
  map: GroupMap;
  aliases: Record<StudentGroup, string[]>;
  match: (parts: string[]) => boolean;
};

export function normalizeSubjectName(name: string): string {
  return String(name ?? "")
    .replace(/[\u00A0\u1680\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, " ")
    .replace(/&/gi, " and ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function normalizePart(part: string): string {
  return normalizeSubjectName(part);
}

function splitParts(rowLabel: string): string[] {
  return String(rowLabel ?? "")
    .split(/[\/\u2215\u2044\uFF0F]/)
    .map(normalizePart)
    .filter(Boolean);
}

function normalizeRowLabel(rowLabel: string): string {
  return splitParts(rowLabel).join("/");
}

function partsKey(rowLabel: string): string {
  return [...splitParts(rowLabel)].sort().join("||");
}

export const COMBINED_SUBJECT_ROWS: CombinedRowDef[] = [
  {
    key: "chemistry/history/finance and banking",
    displayKey: "chemistry/history/finance and banking",
    map: {
      Science: "Chemistry",
      Humanity: "History of Bangladesh and World Civilization",
      Business: "Finance and Banking",
    },
    aliases: {
      Science: ["chemistry", "chemestry"],
      Humanity: [
        "history and world culture",
        "history of bangladesh and world civilization",
        "history",
      ],
      Business: ["finance and banking"],
    },
    match: (parts) =>
      parts.some((p) => p.includes("chemistry") || p.includes("chemestry")) &&
      parts.some((p) => p.includes("history")) &&
      parts.some((p) => p.includes("finance") || p.includes("banking")),
  },
  {
    key: "physics/geography and environment/accounting",
    displayKey: "physics/geography and environment/accounting",
    map: {
      Science: "Physics",
      Humanity: "Geography and Environment",
      Business: "Accounting",
    },
    aliases: {
      Science: ["physics"],
      Humanity: ["geography and environment"],
      Business: ["accounting"],
    },
    match: (parts) =>
      parts.some((p) => p.includes("physics")) &&
      parts.some((p) => p.includes("geography")) &&
      parts.some((p) => p.includes("accounting")),
  },
  {
    key: "general science/bangladesh and global studies",
    displayKey: "general science/bangladesh and global studies",
    map: {
      Science: "Bangladesh and Global Studies",
      Humanity: "General Science",
      Business: "General Science",
    },
    aliases: {
      Science: ["bangladesh and global studies"],
      Humanity: ["general science"],
      Business: ["general science"],
    },
    match: (parts) =>
      parts.some((p) => p.includes("general science")) &&
      parts.some((p) => p.includes("bangladesh") || p.includes("global studies")),
  },
  {
    key: "biology/economics/civics/business entrepreneurship",
    displayKey: "biology/economics/civics/business entrepreneurship",
    map: {
      Science: "Biology",
      Humanity: "Civics / Economics",
      Business: "Business Entrepreneurship",
    },
    aliases: {
      Science: ["biology"],
      Humanity: ["economics / civics", "civics / economics", "economics", "civics"],
      Business: ["business entrepreneurship"],
    },
    match: (parts) =>
      parts.some((p) => p.includes("biology")) &&
      parts.some((p) => p.includes("civics") || p.includes("economics")) &&
      parts.some((p) => p.includes("entrepreneurship")),
  },
  {
    key: "h. math/agriculture/h. science",
    displayKey: "h. math/agriculture/h. science",
    map: {
      Science: "H. math/Agriculture/H. science",
      Humanity: "Agriculture / Home Science",
      Business: "Agriculture / Home Science",
    },
    aliases: {
      Science: ["higher mathematics", "h. math"],
      Humanity: ["agriculture / home science", "agriculture"],
      Business: ["agriculture / home science", "agriculture"],
    },
    match: (parts) =>
      parts.some((p) => p.includes("h. math") || p.includes("higher math") || p.includes("higher mathematics")) &&
      parts.some((p) => p.includes("agriculture")) &&
      parts.some((p) => p.includes("h. science") || p.includes("home science") || p.includes("home economics")),
  },
];

const LABELS_BY_KEY = new Map<string, GroupMap>();
const LABELS_BY_PARTS = new Map<string, GroupMap>();

for (const entry of COMBINED_SUBJECT_ROWS) {
  LABELS_BY_KEY.set(normalizeRowLabel(entry.key), entry.map);
  LABELS_BY_PARTS.set(partsKey(entry.key), entry.map);
}

function isClass9Or10(classNumber?: string | number | null): boolean {
  if (classNumber === undefined || classNumber === null || classNumber === "") return false;
  const value = String(classNumber);
  const match = value.match(/\d+/);
  if (!match) return false;
  const num = Number(match[0]);
  return num === 9 || num === 10;
}

export function isGroupClass(classNumber?: string | number | null): boolean {
  return isClass9Or10(classNumber);
}

export function getCombinedRowDef(rowLabel: string): CombinedRowDef | undefined {
  if (typeof rowLabel !== "string") return undefined;
  const normalized = normalizeRowLabel(rowLabel);
  const pKey = partsKey(rowLabel);
  const parts = splitParts(rowLabel);
  return (
    COMBINED_SUBJECT_ROWS.find((e) => normalizeRowLabel(e.displayKey) === normalized) ||
    COMBINED_SUBJECT_ROWS.find((e) => normalizeRowLabel(e.key) === normalized) ||
    COMBINED_SUBJECT_ROWS.find((e) => partsKey(e.key) === pKey) ||
    COMBINED_SUBJECT_ROWS.find((e) => e.match(parts))
  );
}

export function getGroupSubjectLabel(
  rowLabel: string,
  group: string,
  classNumber?: string | number | null
): string {
  if (typeof rowLabel !== "string") return rowLabel as unknown as string;
  if (!isClass9Or10(classNumber)) return rowLabel;
  if (group !== "Science" && group !== "Business" && group !== "Humanity") return rowLabel;

  const normalized = normalizeRowLabel(rowLabel);
  const pKey = partsKey(rowLabel);
  const parts = splitParts(rowLabel);
  const mapped =
    LABELS_BY_KEY.get(normalized) ||
    LABELS_BY_PARTS.get(pKey) ||
    COMBINED_SUBJECT_ROWS.find((entry) => entry.match(parts))?.map;

  return mapped ? mapped[group as StudentGroup] : rowLabel;
}

function aliasMatches(storedNorm: string, aliasNorm: string): boolean {
  if (!storedNorm || !aliasNorm) return false;
  if (storedNorm === aliasNorm) return true;
  if (aliasNorm.includes("/")) {
    const aliasParts = aliasNorm.split("/").map((p) => p.trim()).filter(Boolean);
    const storedParts = storedNorm.split("/").map((p) => p.trim()).filter(Boolean);
    if (aliasParts.length > 1 && aliasParts.every((p) => storedParts.includes(p) || storedNorm.includes(p))) {
      return true;
    }
  }
  if (aliasNorm === "history") return storedNorm.includes("history");
  if (aliasNorm === "economics") return storedNorm === "economics";
  if (aliasNorm === "civics") return storedNorm === "civics";
  if (aliasNorm === "agriculture") return storedNorm === "agriculture";
  return false;
}

export function getCanonicalCombinedName(
  rowLabel: string,
  group: string,
  classNumber?: string | number | null
): string | null {
  if (typeof rowLabel !== "string") return null;
  if (!isClass9Or10(classNumber)) return null;
  if (group !== "Science" && group !== "Business" && group !== "Humanity") return null;

  const def = getCombinedRowDef(rowLabel);
  if (def) return def.displayKey;

  const storedNorm = normalizeSubjectName(rowLabel);
  for (const entry of COMBINED_SUBJECT_ROWS) {
    const aliases = entry.aliases[group as StudentGroup] || [];
    for (const alias of aliases) {
      if (aliasMatches(storedNorm, normalizeSubjectName(alias))) {
        return entry.displayKey;
      }
    }
  }
  return null;
}

export function isCrossGroupLeftover(
  storedName: string,
  group: string,
  classNumber?: string | number | null
): boolean {
  if (typeof storedName !== "string") return false;
  if (!isClass9Or10(classNumber)) return false;
  if (group !== "Science" && group !== "Business" && group !== "Humanity") return false;

  if (getCanonicalCombinedName(storedName, group, classNumber)) return false;

  const storedNorm = normalizeSubjectName(storedName);
  for (const entry of COMBINED_SUBJECT_ROWS) {
    for (const g of ["Science", "Business", "Humanity"] as StudentGroup[]) {
      if (g === group) continue;
      const aliases = entry.aliases[g] || [];
      for (const alias of aliases) {
        if (aliasMatches(storedNorm, normalizeSubjectName(alias))) return true;
      }
    }
  }
  return false;
}

export function hasMeaningfulMarks(row: any): boolean {
  if (!row) return false;
  const marks = row.marks ?? row.obtainedMarks;
  if (marks != null && Number(marks) !== 0) return true;
  const point = row.point ?? row.gpa;
  if (point != null && Number(point) !== 0) return true;
  const grade = row.grade;
  if (grade != null && String(grade).trim() !== "" && String(grade).trim().toUpperCase() !== "F") return true;
  return false;
}

export const CANONICAL_ORDER_3_4_5 = [
  "bangla",
  "english",
  "mathematics",
  "science",
  "bangladesh and global studies",
  "religion and moral education",
];

export const CANONICAL_ORDER_6_7_8 = [
  "bangla 1st paper",
  "bangla 2nd paper",
  "english 1st paper",
  "english 2nd paper",
  "mathematics",
  "ict",
  "science",
  "bangladesh and global studies",
  "religion and moral education",
  "agriculture / home science",
];

export const CANONICAL_ORDER_9_10 = [
  "bangla 1st paper",
  "bangla 2nd paper",
  "english 1st paper",
  "english 2nd paper",
  "mathematics",
  "ict",
  "physics/geography and environment/accounting",
  "chemistry/history/finance and banking",
  "biology/economics / civics/business entrepreneurship",
  "general science /bangladesh and global studies",
  "religion and moral education",
  "h. math/agriculture/h. science",
];

export function sortSubjectsForClass<T extends { subjectName?: string; name?: string; sortOrder?: number }>(
  subjects: T[],
  classNumber?: string | number | null,
): T[] {
  if (!Array.isArray(subjects) || subjects.length === 0) return [];
  const classStr = String(classNumber ?? "").trim().toLowerCase();
  const match = classStr.match(/\d+/);
  const classNum = match ? parseInt(match[0], 10) : null;

  let canonicalList: string[] | null = null;
  if (classNum === 9 || classNum === 10) canonicalList = CANONICAL_ORDER_9_10;
  else if (classNum === 6 || classNum === 7 || classNum === 8) canonicalList = CANONICAL_ORDER_6_7_8;
  else if (classNum === 3 || classNum === 4 || classNum === 5) canonicalList = CANONICAL_ORDER_3_4_5;

  return [...subjects].sort((a, b) => {
    const aOrder = typeof a.sortOrder === "number" ? a.sortOrder : undefined;
    const bOrder = typeof b.sortOrder === "number" ? b.sortOrder : undefined;

    if (canonicalList) {
      const aName = normalizeSubjectName(String(a.subjectName ?? a.name ?? ""));
      const bName = normalizeSubjectName(String(b.subjectName ?? b.name ?? ""));
      const aIdx = canonicalList.findIndex((item) => item === aName || aName.replace(/[\/\s]/g, "") === item.replace(/[\/\s]/g, ""));
      const bIdx = canonicalList.findIndex((item) => item === bName || bName.replace(/[\/\s]/g, "") === item.replace(/[\/\s]/g, ""));
      if (aIdx >= 0 && bIdx >= 0) return aIdx - bIdx;
      if (aIdx >= 0) return -1;
      if (bIdx >= 0) return 1;
    }

    if (aOrder !== undefined && bOrder !== undefined) return aOrder - bOrder;
    if (aOrder !== undefined) return -1;
    if (bOrder !== undefined) return 1;

    const aName = String(a.subjectName ?? a.name ?? "");
    const bName = String(b.subjectName ?? b.name ?? "");
    return aName.localeCompare(bName);
  });
}
