'use server';

import { sbServer, sbTypedServer } from '@/lib/supabase/server';
import { SCHEMA, TableName } from '@/types/supabase.types';
import { PetsDB } from '@/types/pets.types';
import { CmsDB } from '@/types/cms.types';
import { getTableName } from '@/utils/supabase/getTableName';

// ==================================================
// API schema tables
// ==================================================
/**
 * @function apiTable - used to make calls to Supabase for all tournament related tables
 * @param table - prefix name for the table name - see type TableName
 * @param id - tournament id as suffix for the table name
 * @returns partial query that needs to be filled further by the server actions
 */
export const apiTable = async (table: TableName, id: string) => {
  const supabase = await sbServer();
  return supabase.schema(SCHEMA.API).from(getTableName(table, id));
};

// ==================================================
// PETS schema tables
// ==================================================
export const petsTable = async () => {
  const supabase = await sbTypedServer<PetsDB>();
  return supabase.schema(SCHEMA.PETS).from('pets');
};
// TODO: Abilities & family table should still be made & placed here
// - whenever I add those tables to the pets schema

// ==================================================
// CMS schema tables
// ==================================================
export const announcementsTable = async () => {
  const supabase = await sbTypedServer<CmsDB>();
  return supabase.schema(SCHEMA.CMS).from('announcements');
};

export const signupsTable = async () => {
  const supabase = await sbTypedServer<CmsDB>();
  return supabase.schema(SCHEMA.CMS).from('signups');
};

export const schedulesTable = async () => {
  const supabase = await sbTypedServer<CmsDB>();
  return supabase.schema(SCHEMA.CMS).from('schedules');
};

export const resourcesTable = async () => {
  const supabase = await sbTypedServer<CmsDB>();
  return supabase.schema(SCHEMA.CMS).from('resources');
};

export const pagesTable = async () => {
  const supabase = await sbTypedServer<CmsDB>();
  return supabase.schema(SCHEMA.CMS).from('pages');
};

export const commentsTable = async () => {
  const supabase = await sbTypedServer<CmsDB>();
  return supabase.schema(SCHEMA.CMS).from('comments');
};

export const prizesTable = async () => {
  const supabase = await sbTypedServer<CmsDB>();
  return supabase.schema(SCHEMA.CMS).from('prizes');
};

export const rulesTable = async () => {
  const supabase = await sbTypedServer<CmsDB>();
  return supabase.schema(SCHEMA.CMS).from('rules');
};

export const halloffameTable = async () => {
  const supabase = await sbTypedServer<CmsDB>();
  return supabase.schema(SCHEMA.CMS).from('halloffame');
};

export const partnersTable = async () => {
  const supabase = await sbTypedServer<CmsDB>();
  return supabase.schema(SCHEMA.CMS).from('partners');
};
