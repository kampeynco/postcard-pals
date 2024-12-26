import { Json } from './database';

export interface Template {
  id: string;
  user_id: string;
  name: string;
  description: string;
  template_data: Json;
  is_active: boolean | null;
  created_at: string | null;
}

export interface DefaultTemplate {
  id: string;
  user_id: string;
  front_image_url: string;
  back_message: string;
  is_active: boolean | null;
  created_at: string | null;
}

export interface TemplatesTable {
  Row: Template;
  Insert: Omit<Template, 'id' | 'created_at'> & {
    id?: string;
    created_at?: string;
  };
  Update: Partial<TemplatesTable['Insert']>;
}

export interface DefaultTemplatesTable {
  Row: DefaultTemplate;
  Insert: Omit<DefaultTemplate, 'id' | 'created_at'> & {
    id?: string;
    created_at?: string;
  };
  Update: Partial<DefaultTemplatesTable['Insert']>;
}