export type StudentGroup = "Science" | "Business" | "Humanity";

type GroupMap = Record<StudentGroup, string>;

const COMBINED_SUBJECT_LABELS: { key: string; map: GroupMap; match: (parts: string[]) => boolean }[] = [
  {
    key: "chemistry/history/finance and banking",
    map: {
      Science: "Chemistry",
      Humanity: "History of Bangladesh and World Civilization",
      Business: "Finance and Banking",
    },
    match: (parts) =>
      parts.some((p) => p.includes("chemistry")) &&
      parts.some((p) => p.includes("history")) &&
      parts.some((p) => p.includes("finance") || p.includes("banking")),
  },
  {
    key: "physics/geography and environment/accounting",
    map: {
      Science: "Physics",
      Humanity: "Geography and Environment",
      Business: "Accounting",
    },
    match: (parts) =>
      parts.some((p) => p.includes("physics")) &&
      parts.some((p) => p.includes("geography")) &&
      parts.some((p) => p.includes("accounting")),
  },
  {
    key: "general science/bangladesh and global studies",
    map: {
      Science: "Bangladesh and Global Studies",
      Humanity: "General Science",
      Business: "General Science",
    },
    match: (parts) =>
      parts.some((p) => p.includes("general science")) &&
      parts.some((p) => p.includes("bangladesh") || p.includes("global studies")),
  },
  {
    key: "biology/economics/civics/business entrepreneurship",
    map: {
      Science: "Biology",
      Humanity: "Civics / Economics",
      Business: "Business Entrepreneurship",
    },
    match: (parts) =>
      parts.some((p) => p.includes("biology")) &&
      parts.some((p) => p.includes("civics") || p.includes("economics")) &&
      parts.some((p) => p.includes("entrepreneurship")),
  },
  {
    key: "h. math/agriculture/h. science",
    map: {
      Science: "Higher Mathematics",
      Humanity: "Agriculture / Home Science",
      Business: "Agriculture / Home Science",
    },
    match: (parts) =>
      parts.some(
        (p) =>
          p.includes("h. math") ||
          p.includes("higher math") ||
          p.includes("higher mathematics")
      ) &&
      parts.some((p) => p.includes("agriculture")) &&
      parts.some(
        (p) =>
          p.includes("h. science") ||
          p.includes("home science") ||
          p.includes("home economics")
      ),
  },
];

function normalizePart(part: string): string {
  return part
    .replace(/[\u00A0\u1680\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, " ")
    .replace(/&/gi, " and ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function splitParts(rowLabel: string): string[] {
  return rowLabel
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

const LABELS_BY_KEY = new Map<string, GroupMap>();
const LABELS_BY_PARTS = new Map<string, GroupMap>();

for (const entry of COMBINED_SUBJECT_LABELS) {
  LABELS_BY_KEY.set(normalizeRowLabel(entry.key), entry.map);
  LABELS_BY_PARTS.set(partsKey(entry.key), entry.map);
}

function isClass9Or10(classNumber?: string | number | null): boolean {
  if (classNumber === undefined || classNumber === null || classNumber === "") {
    return false;
  }
  const value = String(classNumber);
  const match = value.match(/\d+/);
  if (!match) return false;
  const num = Number(match[0]);
  return num === 9 || num === 10;
}

export function getGroupSubjectLabel(
  rowLabel: string,
  group: string,
  classNumber?: string | number | null
): string {
  if (typeof rowLabel === "string" && rowLabel.toLowerCase().includes("chem")) {
    console.log(JSON.stringify({ rowLabel, group, classNumber }));
  }
  if (typeof rowLabel !== "string") return rowLabel as unknown as string;
  if (!isClass9Or10(classNumber)) return rowLabel;
  if (group !== "Science" && group !== "Business" && group !== "Humanity") {
    return rowLabel;
  }

  const normalized = normalizeRowLabel(rowLabel);
  const pKey = partsKey(rowLabel);
  const parts = splitParts(rowLabel);

  const mapped =
    LABELS_BY_KEY.get(normalized) ??
    LABELS_BY_PARTS.get(pKey) ??
    COMBINED_SUBJECT_LABELS.find((entry) => entry.match(parts))?.map;

  return mapped ? mapped[group as StudentGroup] : rowLabel;
}
