import { AdminLayout } from "@/components/admin/admin-layout";
import { ArticleEditor } from "@/components/admin/article-editor";

export default function NewArticlePage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Create New Article
          </h1>
          <p className="text-muted-foreground">
            Write and publish your news article
          </p>
        </div>

        <ArticleEditor />
      </div>
    </AdminLayout>
  );
}
