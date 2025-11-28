"use client";

import { graphql, useLazyLoadQuery } from "react-relay";
import type { RepositoryListQuery as RepositoryListQueryType } from "@/__generated__/RepositoryListQuery.graphql";

const RepositoryListQuery = graphql`
  query RepositoryListQuery($first: Int!) {
    viewer {
      login
      repositories(first: $first, orderBy: { field: UPDATED_AT, direction: DESC }) {
        totalCount
        nodes {
          id
          name
          description
          url
          stargazerCount
          forkCount
          updatedAt
          primaryLanguage {
            name
            color
          }
          isPrivate
        }
      }
    }
  }
`;

interface RepositoryListProps {
  count?: number;
}

type Repository = NonNullable<
  NonNullable<
    RepositoryListQueryType["response"]["viewer"]["repositories"]["nodes"]
  >[number]
>;

export default function RepositoryList({ count = 20 }: RepositoryListProps) {
  const data = useLazyLoadQuery<RepositoryListQueryType>(RepositoryListQuery, {
    first: count,
  });

  const { viewer } = data;
  const repositories = (viewer.repositories.nodes?.filter(
    (repo): repo is Repository => repo !== null && repo !== undefined
  ) ?? []) as Repository[];

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {viewer.login}'s Repositories
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          {viewer.repositories.totalCount} total repositories
        </p>
      </div>

      <div className="grid gap-4">
        {repositories.map((repo) => (
          <a
            key={repo.id}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                {repo.name}
              </h2>
              {repo.isPrivate && (
                <span className="px-2 py-1 text-xs font-medium bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded">
                  Private
                </span>
              )}
            </div>

            {repo.description && (
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                {repo.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-500">
              {repo.primaryLanguage && (
                <div className="flex items-center gap-1">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: repo.primaryLanguage.color ?? undefined }}
                  />
                  <span>{repo.primaryLanguage.name}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <span>⭐</span>
                <span>{repo.stargazerCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🍴</span>
                <span>{repo.forkCount}</span>
              </div>
              <div>
                Updated {new Date(repo.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

