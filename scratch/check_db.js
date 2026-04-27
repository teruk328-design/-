const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const getEnv = (key) => {
  const match = env.match(new RegExp(`${key}="(.*?)"`));
  return match ? match[1] : null;
};

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  const { data: completions, error: cError } = await supabase
    .from('quest_completions')
    .select('*, evaluations(*)');
  
  if (cError) {
    console.error('Completions error:', cError);
    return;
  }

  console.log('--- Quest Completions ---');
  console.log(JSON.stringify(completions, null, 2));
}

checkData();
