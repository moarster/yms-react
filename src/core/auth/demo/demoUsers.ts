import { authConfig } from '../../config';
import { User } from '../types';

export const demoUsers = [
  {
    email: 'logist@demo.com',
    password: 'demo123',
    user: {
      email: 'logist@demo.com',
      id: 'demo-logist-1',
      name: 'Demo Logist',
      organization: {
        address: '123 Demo Street, Demo City',
        id: 'demo-org-1',
        inn: '1234567890',
        name: 'Demo Logistics Company',
        ogrn: '1234567890123',
      },
      roles: [
        {
          id: 'role-logist',
          name: 'LOGIST' as const,
          permissions: [
            'DOCUMENT_CREATE',
            'DOCUMENT_READ',
            'DOCUMENT_UPDATE',
            'RFP_CREATE',
            'RFP_ASSIGN',
            'RFP_CANCEL',
            'RFP_COMPLETE',
            'CATALOG_READ',
          ],
        },
      ],
    } satisfies User,
  },
  {
    email: 'carrier@demo.com',
    password: 'demo123',
    user: {
      email: 'carrier@demo.com',
      id: 'demo-carrier-1',
      name: 'Demo Carrier',
      organization: {
        address: '456 Transport Ave, Carrier City',
        id: 'demo-org-2',
        inn: '0987654321',
        name: 'Demo Transport Company',
        ogrn: '3210987654321',
      },
      roles: [
        {
          id: 'role-carrier',
          name: 'CARRIER' as const,
          permissions: ['DOCUMENT_READ', 'RFP_SUBMIT_RATE', 'CATALOG_READ'],
        },
      ],
    } satisfies User,
  },
  {
    email: authConfig.demoSuperuser.email,
    password: authConfig.demoSuperuser.password,
    user: {
      email: authConfig.demoSuperuser.email,
      id: 'demo-admin-1',
      name: 'Demo Admin',
      organization: {
        address: 'Admin HQ, Demo City',
        id: 'demo-org-admin',
        inn: '1111111111',
        name: 'Demo Admin Organization',
        ogrn: '1111111111111',
      },
      roles: [
        {
          id: 'role-admin',
          name: 'ADMIN' as const,
          permissions: [
            'DOCUMENT_CREATE',
            'DOCUMENT_READ',
            'DOCUMENT_UPDATE',
            'DOCUMENT_DELETE',
            'RFP_CREATE',
            'RFP_ASSIGN',
            'RFP_CANCEL',
            'RFP_COMPLETE',
            'RFP_SUBMIT_RATE',
            'CATALOG_CREATE',
            'CATALOG_READ',
            'CATALOG_UPDATE',
            'CATALOG_DELETE',
            'USER_CREATE',
            'USER_READ',
            'USER_UPDATE',
            'USER_DELETE',
          ],
        },
      ],
    } satisfies User,
  },
] as const;
