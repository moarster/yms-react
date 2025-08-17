import { ArchiveBoxIcon, ListBulletsIcon, TextColumnsIcon } from '@phosphor-icons/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Link } from 'react-router-dom';

import { catalogService } from '@/features/catalogs/catalogService.ts';
import ErrorMessage from '@/shared/ui/ErrorMessage.tsx';
import LoadingSpinner from '@/shared/ui/LoadingSpinner.tsx';

import { CatalogBase } from './catalog.types.ts';

interface CatalogCardProps {
  catalog: CatalogBase;
}

const CatalogCard: React.FC<CatalogCardProps> = ({ catalog }) => {
  const Icon = catalog.type === 'LIST' ? ListBulletsIcon : TextColumnsIcon;

  return (
    <Link
      className="card hover:shadow-md transition-shadow duration-200"
      to={`/${catalog.type === 'LIST' ? 'list' : 'catalog'}/${catalog.referenceKey}`}
    >
      <div className="p-4">
        <div className="flex items-center">
          <div
            className={`flex-shrink-0 p-3 rounded-lg ${
              catalog.type === 'LIST' ? 'bg-blue-100' : 'bg-green-100'
            }`}
          >
            <Icon
              className={`h-6 w-6 ${catalog.type === 'LIST' ? 'text-blue-600' : 'text-green-600'}`}
            />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-base font-medium text-gray-900">{catalog.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{catalog.description}</p>
            <div className="mt-2 flex items-center">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  catalog.type === 'LIST'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {catalog.type === 'LIST' ? 'Simple List' : 'Structured Catalog'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const CatalogsPage: React.FC = () => {
  const {
    data: catalogs,
    error: catalogsError,
    isLoading: catalogsLoading,
  } = useQuery({
    queryFn: async () => {
      return await catalogService.getCatalogs();
    },
    queryKey: ['catalogs'],
  });

  const {
    data: lists,
    error: listsError,
    isLoading: listsLoading,
  } = useQuery({
    queryFn: async () => {
      return await catalogService.getLists();
    },
    queryKey: ['lists'],
  });
  // Combined loading state
  const isLoading = catalogsLoading || listsLoading;
  const error = catalogsError || listsError;

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading catalogs..." />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load catalogs" />;
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Master Data Catalogs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage reference data and catalogs used throughout the system
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-outline">
            <ArchiveBoxIcon className="h-4 w-4 mr-2" />
            Import Data
          </button>
          <button className="btn-primary">
            <ArchiveBoxIcon className="h-4 w-4 mr-2" />
            New Catalog
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ListBulletsIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5">
              <div className="text-sm font-medium text-gray-500">Simple Lists</div>
              <div className="text-2xl font-semibold text-gray-900">{lists?.length}</div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TextColumnsIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5">
              <div className="text-sm font-medium text-gray-500">Structured Catalogs</div>
              <div className="text-2xl font-semibold text-gray-900">{catalogs?.length}</div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ArchiveBoxIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5">
              <div className="text-sm font-medium text-gray-500">Total Catalogs</div>
              <div className="text-2xl font-semibold text-gray-900">
                {(catalogs?.length || 0) + (lists?.length || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Lists Section */}
      {lists?.length && (
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Simple Lists</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 ">
            {lists.map((catalog) => (
              <CatalogCard key={catalog.referenceKey} catalog={{ ...catalog, type: 'LIST' }} />
            ))}
          </div>
        </div>
      )}

      {/* Structured Catalogs Section */}
      {catalogs?.length && (
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Structured Catalogs</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {catalogs.map((catalog) => (
              <CatalogCard key={catalog.referenceKey} catalog={{ ...catalog, type: 'CATALOG' }} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {(!catalogs || catalogs.length === 0) && (
        <div className="text-center py-12">
          <ArchiveBoxIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No catalogs found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first catalog.</p>
          <div className="mt-6">
            <button className="btn-primary">
              <ArchiveBoxIcon className="h-4 w-4 mr-2" />
              Create Catalog
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogsPage;
