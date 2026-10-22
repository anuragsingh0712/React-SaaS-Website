import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bookmark, BookmarkCheck, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAsyncData } from '../hooks/useAsyncData';
import { getResource, getResources, getBookmarks, addBookmark, removeBookmark } from '../data/store';
import { Card } from '../components/Card';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { Badge } from '../components/Badge';

export function ResourceDetail(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const resourceQuery = useAsyncData(() => getResource(id ?? ''), [id]);
  const allResourcesQuery = useAsyncData(getResources, []);
  const bookmarksQuery = useAsyncData(getBookmarks, []);

  const isBookmarked = useMemo(
    () => (bookmarksQuery.data ?? []).some((bookmark) => bookmark.resourceId === id),
    [bookmarksQuery.data, id],
  );

  const relatedResources = useMemo(() => {
    if (!resourceQuery.data || !allResourcesQuery.data) return [];
    return allResourcesQuery.data
      .filter((resource) => resource.category === resourceQuery.data?.category && resource.id !== id)
      .slice(0, 3);
  }, [resourceQuery.data, allResourcesQuery.data, id]);

  const handleToggleBookmark = async (): Promise<void> => {
    if (!id) return;
    if (isBookmarked) {
      await removeBookmark(id);
    } else {
      await addBookmark(id);
    }
    bookmarksQuery.refetch();
  };

  const handleShare = (): void => {
    // MOCK: no real share/clipboard backend; just confirms the action to the user.
    toast.success('Link copied to clipboard (demo).');
  };

  if (resourceQuery.isLoading) {
    return <SkeletonLoader className="h-96 w-full" />;
  }

  if (resourceQuery.error) {
    return <ErrorState message={resourceQuery.error} onRetry={resourceQuery.refetch} />;
  }

  if (!resourceQuery.data) {
    return (
      <EmptyState
        title="Resource not found"
        description="This resource may have been removed."
        action={
          <button
            type="button"
            onClick={() => navigate('/resources')}
            className="rounded-card bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            Back to resources
          </button>
        }
      />
    );
  }

  const resource = resourceQuery.data;

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <Card>
        <div className="flex items-center justify-between gap-2">
          <Badge tone="info">{resource.category}</Badge>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="rounded-card p-2 text-muted hover:bg-canvas dark:hover:bg-night"
              aria-label="Share resource"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleToggleBookmark}
              className="rounded-card p-2 text-muted hover:bg-canvas dark:hover:bg-night"
              aria-label="Toggle bookmark"
            >
              {isBookmarked ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <Bookmark className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <h1 className="mt-4 text-2xl font-semibold">{resource.title}</h1>
        <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted">{resource.content}</p>
      </Card>

      {relatedResources.length > 0 && (
        <div>
          <h2 className="font-semibold mb-3">Related resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedResources.map((related) => (
              <Card key={related.id} onClick={() => navigate(`/resources/${related.id}`)}>
                <Badge tone="info">{related.category}</Badge>
                <h3 className="mt-2 font-semibold text-sm">{related.title}</h3>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
