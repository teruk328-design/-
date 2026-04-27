import { createAdminClient } from '../lib/supabase';

async function listSkills() {
  const supabase = createAdminClient();
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
