export type DocumentStatus =
  | 'ASSIGNED'
  | 'CANCELLED'
  | 'CLOSED'
  | 'COMPLETED'
  | 'NEW'
  | 'PUBLISHED'
  | `DRAFT`;

export interface UserTask {
  assignee?: string;
  elementId: string;
  jobId: string;
  name: string;
}

export interface UserTasks {
  entity: string;
  processInstanceKey: number;
  tasks: UserTask[];
  timestamp: number;
}

export const getStatusColor = (status: DocumentStatus): string => {
  switch (status) {
    case 'NEW':
      return 'gray';
    case 'DRAFT':
      return 'gray';
    case 'ASSIGNED':
      return 'blue';
    case 'COMPLETED':
      return 'green';
    case 'CANCELLED':
      return 'red';
    case 'CLOSED':
      return 'green';
    default:
      return 'gray';
  }
};

export const isTerminalStatus = (status: DocumentStatus): boolean =>
  status === 'COMPLETED' || status === 'CANCELLED';

export const canTransitionTo = (from: DocumentStatus, to: DocumentStatus): boolean => {
  const transitions: Record<DocumentStatus, DocumentStatus[]> = {
    ASSIGNED: ['COMPLETED', 'CANCELLED'],
    CANCELLED: [],
    COMPLETED: [],
    NEW: ['ASSIGNED', 'CANCELLED', 'PUBLISHED'],
    PUBLISHED: [],
  };
  return transitions[from]?.includes(to) ?? false;
};
