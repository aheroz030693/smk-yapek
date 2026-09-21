/**
 * Database Module Hub
 * SMK YAPEK Gombong
 */

import { RAW_DATABASE_SQL } from './sqlData';

export * from './config';
export * from './sqlData';

/**
 * Trigger browser download of the complete SQL file
 */
export const downloadDatabaseSqlFile = (customSql?: string, filename = 'smk_yapek_gombong_database.sql') => {
  if (typeof window === 'undefined') return;
  const content = customSql || RAW_DATABASE_SQL;
  const blob = new Blob([content], { type: 'application/sql;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

