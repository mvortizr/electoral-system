export interface TiebreakerConfig {
    name: string;
    datatype: 'date' | 'number';
    comparator: 'greater' | 'lesser' | 'lesserOrEqual' | 'greaterOrEqual';
  }