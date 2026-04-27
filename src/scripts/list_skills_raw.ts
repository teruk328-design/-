import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// .env.local を手動で読み込む
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env: Record<string, string> = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
  if (match) {
    let value = match[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    env[match[1]] = value;
  }
});

async function listSkills() {
  const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
  const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'];

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase config in .env.local');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from('quest_completions')
    .select('skill_name');

  if (error) {
    console.error('Error fetching skills:', error);
    return;
  }

  const uniqueSkills = [...new Set(data.map(item => item.skill_name))];
  console.log('--- 登録されているスキル一覧 ---');
  uniqueSkills.sort().forEach(skill => console.log(`- ${skill}`));
  console.log('-------------------------------');
}

listSkills();
