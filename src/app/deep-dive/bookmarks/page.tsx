import Link from "next/link";
import { requireUserPage } from "@/lib/auth";
import { bookmarks } from "@/lib/deep-dive-service";
import { Badge, Card, CardContent, CardHeader, CardTitle, EmptyState } from "@/components/ui";
import { DD_STATUS_CLASS, DD_STATUS_LABEL, DD_TYPE_LABEL, DIFFICULTY_CLASS } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BookmarksPage() {
  const user = await requireUserPage("/deep-dive/bookmarks");
  const items = await bookmarks(user.id);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/deep-dive" className="text-xs text-muted-foreground hover:text-foreground">
          ← Deep Dive
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Bookmarks</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything you starred across the Deep Dive library.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{items.length} saved</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <div className="p-5">
              <EmptyState
                title="Nothing bookmarked yet"
                body="Star a question or concept and it will collect here."
              />
            </div>
          ) : (
            <div className="divide-y divide-border">
              {items.map((r) => (
                <Link
                  key={r.id}
                  href={`/deep-dive/content/${r.id}`}
                  className="flex flex-wrap items-center gap-3 px-5 py-3 transition-colors hover:bg-accent"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">{r.title}</span>
                      {r.status !== "NOT_STARTED" && (
                        <Badge className={DD_STATUS_CLASS[r.status]}>
                          {DD_STATUS_LABEL[r.status]}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{r.sectionName}</div>
                  </div>
                  <Badge>{DD_TYPE_LABEL[r.contentType]}</Badge>
                  <Badge className={DIFFICULTY_CLASS[r.difficulty]}>{r.difficulty}</Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
