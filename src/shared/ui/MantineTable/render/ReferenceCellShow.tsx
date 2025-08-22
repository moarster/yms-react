import React from 'react';
import { useNavigate } from 'react-router-dom';

import { isResolvedLink, ReferentLink } from '@/types';

import { useReference } from '@/shared/hooks/useReference.ts';
import { CatalogType } from '@/features/catalogs/catalog.types.ts';

interface ReferenceCellShowProps {
  value: null | ReferentLink;
  catalog: string;
  linkType: CatalogType;
}

export const ReferenceCellShow: React.FC<ReferenceCellShowProps> = ({
  catalog,
  linkType,
  value,
}) => {
  const { getOptionTitleById } = useReference({ catalog, linkType, value });
  const navigate = useNavigate();

  if (!value) {
    return <span className="text-gray-400">-</span>;
  }

  const title = value.title || (isResolvedLink(value) ? value.entry.title : getOptionTitleById(value.id));
  if (!title) {
    return <span className="text-gray-400">?</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <svg
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-4 h-4 text-gray-400 flex-shrink-0"
        onClick={() => {
          navigate(`/${linkType}s/${value.id}`);
        }}
      >
        <path
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
      <span className="truncate font-medium text-blue-600">{title}</span>
    </div>
  );
};
