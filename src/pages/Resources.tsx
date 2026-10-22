import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bookmark, BookmarkCheck } from 'lucide-react';
import { useAsyncData } from '../hooks/useAsyncData';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { getResources, getBookmarks, addBookmark, removeBookmark } from '../data/store';
import { RESOURCE_CATEGORIES } from '../constants';
import type { ResourceCategory } from '../types';
import { Card } from '../components/Card';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { Badge } from '../components/Badge';
import { inputClassName } from '../components/FormField';
import { truncate } from '../utils/format';

export function Resources(): React.ReactElement {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<ResourceCategory | 'All'>('All');
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 250);

  const resourcesQuery = useAsyncData(getResources, []);
  const bookmarksQuery = useAsyncData(getBookmarks, []);

  const bookmarkedResourceIds = useMemo(
    () => new Set((bookmarksQuery.data ?? []).map((bookmark) => bookmark.resourceId)),
    [bookmarksQuery.data],
  );

  const filteredResources = useMemo(() => {
    const resources = resourcesQuery.data ?? [];
    return resources.filter((resource) => {
      const matchesCategory = activeCategory === 'All' || resource.category === activeCategory;
      const matchesSearch =
        !debouncedSearchTerm.trim() ||
        resource.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [resourcesQuery.data, activeCategory, debouncedSearchTerm]);

  const toggleBookmark = async (resourceId: string, event: React.MouseEvent): Promise<void> => {
    event.stopPropagation();
    if (bookmarkedResourceIds.has(resourceId)) {
      await removeBookmark(resourceId);
    } else {
      await addBookmark(resourceId);
    }
    bookmarksQuery.refetch();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Resources</h1>
        <p className="mt-1 text-sm text-muted">Search our knowledge center for articles, tutorials, FAQs, and guides.</p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search resources..."
          className={`${inputClassName} pl-10`}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory('All')}
          className={`rounded-pill px-4 py-1.5 text-sm font-medium transition-colors ${
            activeCategory === 'All' ? 'bg-primary text-white' : 'border border-border-default dark:border-border-dark text-muted hover:bg-canvas dark:hover:bg-night'
          }`}
        >
          All
        </button>
        {RESOURCE_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`rounded-pill px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === category ? 'bg-primary text-white' : 'border border-border-default dark:border-border-dark text-muted hover:bg-canvas dark:hover:bg-night'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {resourcesQuery.isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonLoader className="h-40 w-full" count={6} />
        </div>
      ) : resourcesQuery.error ? (
        <ErrorState message={resourcesQuery.error} onRetry={resourcesQuery.refetch} />
      ) : filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource) => {
            const isBookmarked = bookmarkedResourceIds.has(resource.id);
            return (
              <Card key={resource.id} onClick={() => navigate(`/resources/${resource.id}`)}>
                <div className="flex items-start justify-between gap-2">
                  <Badge tone="info">{resource.category}</Badge>
                  <button
                    type="button"
                    onClick={(event) => toggleBookmark(resource.id, event)}
                    className="text-muted hover:text-primary"
                    aria-label="Toggle bookmark"
                  >
                    {isBookmarked ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <Bookmark className="h-5 w-5" />}
                  </button>
                </div>
                <h3 className="mt-3 font-semibold">{resource.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{truncate(resource.description, 110)}</p>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState title="No resources found" description="Try a different search term or category." />
      )}
    </div>
  );
}
