import React, { useEffect } from 'react';
import { Link as RouterLink, LinkProps, useLocation } from 'react-router-dom';

// Route to component mapping for prefetching
const routeModules: Record<string, () => Promise<any>> = {
  '/catalogs': () => import('@/features/catalogs/CatalogsPage.tsx'),
  '/dashboard': () => import('@/pages/DashboardPage'),
  '/profile': () => import('@/pages/ProfilePage'),
  '/shipment-rfps': () => import('@/features/documents/pages/ShipmentRfpsPage.tsx'),
  '/shipment-rfps/new': () => import('@/features/documents/pages/ShipmentRfpWizardPage.tsx'),
};

// Dynamic route patterns
const dynamicRoutePatterns = [
  { loader: () => import('@/features/catalogs/CatalogItemsPage.tsx'), pattern: /^\/catalog\// },
  { loader: () => import('@/features/catalogs/CatalogItemsPage.tsx'), pattern: /^\/list\// },
  {
    loader: () => import('@/features/documents/pages/ShipmentRfpDetailPage.tsx'),
    pattern: /^\/shipment-rfps\/[^/]+$/,
  },
];

// Prefetch cache to avoid duplicate prefetches
const prefetchCache = new Set<string>();

// Prefetch function
const prefetchRoute = (path: string) => {
  // Check if already prefetched
  if (prefetchCache.has(path)) return;

  // Check static routes
  if (routeModules[path]) {
    routeModules[path]();
    prefetchCache.add(path);
    return;
  }

  // Check dynamic routes
  for (const { loader, pattern } of dynamicRoutePatterns) {
    if (pattern.test(path)) {
      loader();
      prefetchCache.add(path);
      return;
    }
  }
};

// Enhanced Link component with prefetch on hover
export const Link: React.FC<LinkProps & { prefetch?: boolean }> = ({
  children,
  prefetch = true,
  to,
  ...props
}) => {
  const handleMouseEnter = () => {
    if (prefetch && typeof to === 'string') {
      // Delay prefetch slightly to avoid unnecessary loads on quick hover
      const timer = setTimeout(() => {
        prefetchRoute(to);
      }, 100);

      return () => clearTimeout(timer);
    }
  };

  return (
    <RouterLink to={to} onFocus={handleMouseEnter} onMouseEnter={handleMouseEnter} {...props}>
      {children}
    </RouterLink>
  );
};

// Prefetch adjacent routes based on current location
export const useAdjacentRoutePrefetch = () => {
  const location = useLocation();

  useEffect(() => {
    // Define adjacent routes based on current path
    const adjacentRoutes: string[] = [];

    switch (location.pathname) {
      case '/dashboard':
        adjacentRoutes.push('/catalogs', '/shipment-rfps');
        break;
      case '/catalogs':
        adjacentRoutes.push('/dashboard');
        break;
      case '/shipment-rfps':
        adjacentRoutes.push('/shipment-rfps/new', '/dashboard');
        break;
      default:
        // For detail pages, prefetch list page
        if (location.pathname.startsWith('/shipment-rfps/')) {
          adjacentRoutes.push('/shipment-rfps');
        } else if (
          location.pathname.startsWith('/catalog/') ||
          location.pathname.startsWith('/list/')
        ) {
          adjacentRoutes.push('/catalogs');
        }
    }

    // Prefetch adjacent routes after a delay
    const timer = setTimeout(() => {
      adjacentRoutes.forEach((route) => prefetchRoute(route));
    }, 2000);

    return () => clearTimeout(timer);
  }, [location.pathname]);
};

// Resource hints for critical resources
export const ResourceHints: React.FC = () => {
  useEffect(() => {
    // Add resource hints to document head
    const hints = [
      { href: import.meta.env.VITE_API_BASE_URL, rel: 'dns-prefetch' },
      { href: import.meta.env.VITE_API_BASE_URL, rel: 'preconnect' },
    ];

    const elements = hints.map((hint) => {
      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      document.head.appendChild(link);
      return link;
    });

    return () => {
      elements.forEach((el) => document.head.removeChild(el));
    };
  }, []);

  return null;
};

// Export all prefetch utilities
export const prefetchUtils = {
  clearPrefetchCache: () => prefetchCache.clear(),
  isPrefetched: (path: string) => prefetchCache.has(path),
  prefetchRoute,
};
