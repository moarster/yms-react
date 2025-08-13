import { authConfig } from '../../config'
import { User } from '../types'

export const demoUsers = [
    {
        email: 'logist@demo.com',
        password: 'demo123',
        user: {
            id: 'demo-logist-1',
            email: 'logist@demo.com',
            name: 'Demo Logist',
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
            organization: {
                id: 'demo-org-1',
                name: 'Demo Logistics Company',
                inn: '1234567890',
                ogrn: '1234567890123',
                address: '123 Demo Street, Demo City',
            },
        } satisfies User,
    },
    {
        email: 'carrier@demo.com',
        password: 'demo123',
        user: {
            id: 'demo-carrier-1',
            email: 'carrier@demo.com',
            name: 'Demo Carrier',
            roles: [
                {
                    id: 'role-carrier',
                    name: 'CARRIER' as const,
                    permissions: [
                        'DOCUMENT_READ',
                        'RFP_SUBMIT_RATE',
                        'CATALOG_READ',
                    ],
                },
            ],
            organization: {
                id: 'demo-org-2',
                name: 'Demo Transport Company',
                inn: '0987654321',
                ogrn: '3210987654321',
                address: '456 Transport Ave, Carrier City',
            },
        } satisfies User,
    },
    {
        email: authConfig.demoSuperuser.email,
        password: authConfig.demoSuperuser.password,
        user: {
            id: 'demo-admin-1',
            email: authConfig.demoSuperuser.email,
            name: 'Demo Admin',
            roles: [
                {
                    id: 'role-admin',
                    name: 'ADMIN' as const,
                    permissions: [
                        'DOCUMENT_CREATE', 'DOCUMENT_READ', 'DOCUMENT_UPDATE', 'DOCUMENT_DELETE',
                        'RFP_CREATE', 'RFP_ASSIGN', 'RFP_CANCEL', 'RFP_COMPLETE', 'RFP_SUBMIT_RATE',
                        'CATALOG_CREATE', 'CATALOG_READ', 'CATALOG_UPDATE', 'CATALOG_DELETE',
                        'USER_CREATE', 'USER_READ', 'USER_UPDATE', 'USER_DELETE',
                    ],
                },
            ],
            organization: {
                id: 'demo-org-admin',
                name: 'Demo Admin Organization',
                inn: '1111111111',
                ogrn: '1111111111111',
                address: 'Admin HQ, Demo City',
            },
        } satisfies User,
    },
] as const