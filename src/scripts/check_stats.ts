import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
  if (match) {
    let value = match[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.substring(1, value.length - 1);
    env[match[1]] = value;
  }
});

async function checkStats() {
  const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
  const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'];
  const supabase = createClient(supabaseUrl, supabaseKey);

  // あなたのユーザー名（または調査対象）を指定
  const name = 'kawano_teruyuki'; 

  console.log(`Checking stats for: ${name}`);
  const { data, error } = await supabase.rpc('get_skill_stats', { member_name_input: name });

  if (error) {
    console.error('RPC Error:', error);
    return;
  }

  console.log('--- RPC (get_skill_stats) の結果 ---');
  console.log(JSON.stringify(data, null, 2));
  console.log('-----------------------------------');
}

checkStats();
