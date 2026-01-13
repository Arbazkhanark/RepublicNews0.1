import { AdminLayout } from "@/components/admin/admin-layout";
import { ArticleEditor } from "@/components/admin/article-editor";

interface EditArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  // In Next.js 14+, params is a Promise, so we need to await it
  const { id } = await params;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Article</h1>
          <p className="text-muted-foreground">Update your news article</p>
        </div>

        <ArticleEditor articleId={id} />
      </div>
    </AdminLayout>
  );
}
