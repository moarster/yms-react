# Carrier Portal Frontend

A modern React frontend application for the Carrier Portal - a yard management system platform for warehouse owners and logistics companies to find carriers and manage shipment contracts.

## 🚀 Features

### Core Functionality
- **Authentication & Authorization**: JWT-based auth with Keycloak integration
- **Role-based Access Control**: Support for Logist and Carrier roles with fine-grained permissions
- **Master Data Management (НСИ)**: Manage catalogs and reference data
- **Document Management**: Create, edit, and track shipment RFPs through their lifecycle
- **Workflow Integration**: Camunda Zeebe integration for document lifecycle management
- **File Management**: Upload, download, and manage document attachments

### User Roles
- **Logist**: Create and manage RFPs, assign carriers, track shipments
- **Carrier**: View assigned RFPs, submit rates, manage organization details

### Document Lifecycle
- **Draft**: Visible only to creator, can be published or cancelled
- **Assigned**: Visible to logists and assigned carrier organization
- **Completed**: Read-only access for all authorized users
- **Cancelled**: Final state, no further actions allowed

## 🛠 Tech Stack

### Core Technologies
- **React 18** with TypeScript
- **Vite** for build tooling and development server
- **TailwindCSS** for styling with custom design system
- **React Router** for client-side routing

### State Management & Data Fetching
- **Zustand** for global state management
- **TanStack Query** for server state and caching
- **React Hook Form** with Zod validation for forms

### UI Components & Libraries
- **Headless UI** for accessible components
- **Heroicons** for iconography
- **React Hot Toast** for notifications
- **TanStack Table** for data tables
- **JSON Forms** for dynamic form generation
- **React Dropzone** for file uploads

### Development Tools
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Autoprefixer** for CSS vendor prefixes

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components (Header, Sidebar, etc.)
│   ├── ui/             # Generic UI components
│   └── forms/          # Form-specific components
├── pages/              # Page components
│   ├── catalogs/       # Catalog management pages
│   ├── documents/      # Document management pages
│   └── auth/           # Authentication pages
├── services/           # API service layer
├── stores/             # Zustand stores
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── constants/          # Application constants
└── styles/             # Global styles and Tailwind config
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Backend API server running on `http://localhost:8080`
- Keycloak server for authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd carrier-portal-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_APP_NAME=Carrier Portal
   VITE_KEYCLOAK_URL=http://localhost:8080/auth
   VITE_KEYCLOAK_REALM=carrier-portal
   VITE_KEYCLOAK_CLIENT_ID=carrier-portal-frontend
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Demo Credentials
For development and testing:
- **Logist**: `logist@example.com` / `password123`
- **Carrier**: `carrier@example.com` / `password123`

## 🏗 Build & Deployment

### Development Build
```bash
npm run build
```

### Production Build
```bash
NODE_ENV=production npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Linting & Type Checking
```bash
npm run lint          # ESLint
npm run type-check    # TypeScript
```

## 🔧 Configuration

### API Integration
The frontend communicates with the backend via REST API:
- Authentication endpoints: `/auth/*`
- Catalog management: `/catalogs/*`, `/lists/*`, `/catalog/*`
- Document management: `/domain/shipment-rfp/*`
- File operations: Integrated with document endpoints

### Proxy Configuration
Development server proxies API requests to backend:
```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

### Browser Storage Policy
**Important**: The application does NOT use localStorage or sessionStorage due to Claude.ai environment restrictions. All state is managed in memory using:
- React state (useState, useReducer)
- Zustand stores for global state
- TanStack Query for server state caching

## 🎨 Styling & Theming

### Design System
- Custom color palette based on primary blue theme
- Consistent spacing using Tailwind's scale
- Typography system with proper hierarchy
- Component-based styling with utility classes

### Status Colors
- **Draft**: Gray
- **Assigned**: Blue  
- **Completed**: Green
- **Cancelled**: Red

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Adaptive layouts for tables and forms
- Collapsible sidebar for mobile

## 🔐 Security & Permissions

### Authentication Flow
1. User login via Keycloak
2. JWT token stored in Zustand store
3. Automatic token refresh on expiry
4. Redirect to login on authentication failure

### Permission System
- Role-based access control (RBAC)
- Resource-level permissions
- UI elements hidden/shown based on permissions
- API calls protected by token-based auth

### Access Rules for Documents
- **Draft RFPs**: Creator only
- **Assigned RFPs**: All logists + assigned carrier organization
- **Carrier Access**: Limited field editing (attachments, rates)
- **Completed RFPs**: Read-only for all authorized users

## 📊 Features Deep Dive

### Master Data Management
- **Lists**: Simple key-value catalogs
- **Catalogs**: Schema-driven structured data
- CRUD operations with bulk actions
- Import/export functionality
- Search and filtering

### Document Workflow
- JSON Schema-based form generation
- Dynamic field access control
- Attachment management
- Workflow actions (publish, assign, cancel, complete)
- Real-time status updates

### Data Tables
- Sorting and filtering
- Pagination with configurable page sizes
- Column customization
- Bulk operations
- Export capabilities

## 🔄 State Management Architecture

### Global State (Zustand)
- **Auth Store**: User authentication and profile
- **UI Store**: Theme, sidebar, notifications

### Server State (TanStack Query)
- Catalog data with caching
- Document management with optimistic updates
- Real-time refetching on mutations
- Background sync and retry logic

### Local State (React)
- Form state with React Hook Form
- Component-specific UI state
- Temporary data during user interactions

## 🚦 API Integration

### Service Layer Architecture
```typescript
// services/apiClient.ts - Base HTTP client
// services/authService.ts - Authentication operations
// services/catalogService.ts - Catalog/list operations  
// services/documentService.ts - Document operations
```

### Error Handling
- Global error interceptors
- User-friendly error messages
- Automatic retry for transient failures
- Toast notifications for user feedback

### Request/Response Flow
1. Service method called from component
2. API client adds authentication headers
3. Request sent to backend via proxy
4. Response processed and cached
5. UI updated with new data

## 📱 Responsive Design

### Mobile Optimization
- Collapsible navigation
- Touch-friendly interactions
- Optimized table layouts
- Readable typography scales

### Desktop Features
- Full sidebar navigation
- Multi-column layouts
- Keyboard shortcuts
- Hover states and tooltips

## 🧪 Development Guidelines

### Code Organization
- Feature-based folder structure
- Consistent naming conventions
- TypeScript for type safety
- Custom hooks for reusable logic

### Component Patterns
- Functional components with hooks
- Props interfaces with TypeScript
- Composition over inheritance
- Error boundaries for robustness

### Best Practices
- Accessibility-first development
- Performance optimization
- SEO considerations
- Security-conscious coding

## 🐛 Troubleshooting

### Common Issues

**API Connection Problems**
- Verify backend server is running on port 8080
- Check proxy configuration in vite.config.ts
- Ensure CORS is properly configured on backend

**Authentication Issues**
- Verify Keycloak configuration
- Check token expiry and refresh logic
- Clear browser cache and restart

**Build Errors**
- Run `npm install` to ensure dependencies are current
- Check TypeScript errors with `npm run type-check`
- Verify environment variables are set

**Performance Issues**  
- Check network tab for slow API calls
- Monitor React DevTools for unnecessary re-renders
- Review TanStack Query cache configuration

## 📈 Performance Considerations

### Bundle Optimization
- Code splitting by route and feature
- Tree shaking of unused dependencies
- Lazy loading of heavy components
- Optimized build with Vite

### Runtime Performance
- Memoization of expensive calculations
- Virtualized tables for large datasets
- Debounced search inputs
- Optimistic UI updates

### Caching Strategy
- TanStack Query for server state caching
- Background refetching for data freshness
- Stale-while-revalidate patterns
- Local caching of static data

## 🤝 Contributing

### Development Workflow
1. Create feature branch from main
2. Implement changes with tests
3. Run linting and type checking
4. Submit pull request with description
5. Code review and merge

### Coding Standards
- Follow existing code style
- Write meaningful commit messages
- Add JSDoc comments for complex functions
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation
- Review the troubleshooting guide

---

**Built with ❤️ for efficient yard management and logistics operations**