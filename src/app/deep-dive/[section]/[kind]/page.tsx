import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUserPage } from "@/lib/auth";
import { listContent, sectionFacets, type ListFilters } from "@/lib/deep-dive-service";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { SECTION_BY_SLUG, SOURCE_TYPE_LABEL, type SourceType } from "@/data/deep-dive/types";
import {
  DD_SOURCE_CLASS,
  DD_STATUS_CLASS,
  DD_STATUS_LABEL,
  DD_TYPE_LABEL,
  DIFFICULTY_CLASS,
  cn,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ section: string; kind: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function ListPage({ params, searchParams }: Props) {
  const { section, kind } = await params;
  const def = SECTION_BY_SLUG[section];
  if (!def || (kind !== "concepts" && kind !== "questions")) notFound();

  const raw = await searchParams;
  const filters: ListFilters = {
    category: raw.category,
    difficulty: raw.difficulty,
    sourceType: raw.sourceType,
    company: raw.company,
    status: raw.status,
    q: raw.q,
  };

  const user = await requireUserPage(`/deep-dive/${section}/${kind}`);
  const [items, facets] = await Promise.all([
    listContent(user.id, section, kind, filters),
    sectionFacets(section),
  ]);

  const solved = items.filter((i) => i.status === "SOLVED").length;

  const linkFor = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...filters, ...patch })) if (v) p.set(k, v);
    const qs = p.toString();
    return `/deep-dive/${section}/${kind}${qs ? `?${qs}` : ""}`;
  };

  const isConcepts = kind === "concepts";

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/deep-dive/${section}`}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          ← {def.name}
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          {def.name} · {isConcepts ? "Concepts" : "Real interview questions"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {items.length} shown · {solved} marked solved
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ChipRow
            label="Category"
            all={linkFor({ category: undefined })}
            allActive={!filters.category}
            options={facets.categories.map((c) => ({
              label: c,
              href: linkFor({ category: c }),
              active: filters.category === c,
            }))}
          />
          <ChipRow
            label="Difficulty"
            all={linkFor({ difficulty: undefined })}
            allActive={!filters.difficulty}
            options={facets.difficulties.map((d) => ({
              label: d,
              href: linkFor({ difficulty: d }),
              active: filters.difficulty === d,
            }))}
          />
          {!isConcepts && facets.sourceTypes.length > 1 && (
            <ChipRow
              label="Source"
              all={linkFor({ sourceType: undefined })}
              allActive={!filters.sourceType}
              options={facets.sourceTypes.map((s) => ({
                label: SOURCE_TYPE_LABEL[s as SourceType] ?? s,
                href: linkFor({ sourceType: s }),
                active: filters.sourceType === s,
              }))}
            />
          )}
          {facets.companies.length > 0 && (
            <ChipRow
              label="Company"
              all={linkFor({ company: undefined })}
              allActive={!filters.company}
              options={facets.companies.map((c) => ({
                label: c,
                href: linkFor({ company: c }),
                active: filters.company === c,
              }))}
            />
          )}
          <ChipRow
            label="Status"
            all={linkFor({ status: undefined })}
            allActive={!filters.status}
            options={["NOT_STARTED", "ATTEMPTED", "SOLVED", "NEEDS_REVIEW"].map((s) => ({
              label: DD_STATUS_LABEL[s],
              href: linkFor({ status: s }),
              active: filters.status === s,
            }))}
          />
        </CardContent>
      </Card>

      <div className="surface divide-y divide-border">
        {items.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            Nothing matches those filters.
          </p>
        )}
        {items.map((it) => (
          <Link
            key={it.id}
            href={`/deep-dive/content/${it.id}`}
            className="flex flex-wrap items-center gap-3 px-4 py-3 transition-colors hover:bg-accent"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">{it.title}</span>
                {it.bookmarked && <span className="text-xs text-medium">★</span>}
                {it.status !== "NOT_STARTED" && (
                  <Badge className={DD_STATUS_CLASS[it.status]}>{DD_STATUS_LABEL[it.status]}</Badge>
                )}
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                <span>{it.category}</span>
                {it.company && <span>· {it.company}</span>}
                {it.role && <span>· {it.role}</span>}
                {it.sourceCount > 1 && <span>· {it.sourceCount} sources</span>}
              </div>
            </div>
            {!isConcepts && (
              <Badge className={DD_SOURCE_CLASS[it.sourceType]}>
                {SOURCE_TYPE_LABEL[it.sourceType as SourceType] ?? it.sourceType}
              </Badge>
            )}
            {it.contentType !== "QUESTION" && it.contentType !== "CONCEPT" && (
              <Badge>{DD_TYPE_LABEL[it.contentType]}</Badge>
            )}
            <Badge className={DIFFICULTY_CLASS[it.difficulty]}>{it.difficulty}</Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ChipRow({
  label,
  all,
  allActive,
  options,
}: {
  label: string;
  all: string;
  allActive: boolean;
  options: { label: string; href: string; active: boolean }[];
}) {
  if (options.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="stat-label mr-1 w-16 shrink-0">{label}</span>
      <Chip href={all} active={allActive}>
        All
      </Chip>
      {options.map((o) => (
        <Chip key={o.href} href={o.href} active={o.active}>
          {o.label}
        </Chip>
      ))}
    </div>
  );
}

function Chip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-md border px-2.5 py-1 text-xs transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}
