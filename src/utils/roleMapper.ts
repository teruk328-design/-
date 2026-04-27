import { Member, Rank, Skill } from "../contexts/GuildContext";

// DiscordのロールIDと、そのロールで得られるステータスの定義
// TODO: 実際のDiscordサーバーのロールIDに書き換えてください
export const ROLE_MAPPINGS: Record<string, { rank?: Rank; skills: Skill[] }> = {
  // 勇者
  "1494992079976403034": {
    rank: "勇者",
    skills: [],
  },
  // 魔術師
  "1494993729063358616": {
    rank: "魔術師",
    skills: [],
  },
  // 画家
  "1494993731542188183": {
    rank: "画家",
    skills: [],
  },
  // 詩人
  "1494993735006818404": {
    rank: "詩人",
    skills: [],
  },
  // 学者
  "1494993735942013008": {
    rank: "学者",
    skills: [],
  },
  // 賢者
  "1494993736474689566": {
    rank: "賢者",
    skills: [],
  },
};

/**
 * ユーザーが持つDiscordのロールIDの配列から、ステータス（Memberオブジェクトの一部）を生成する
 */
export function applyRolesToMember(roles: string[], currentMember: Member): Member {
  const newSkills: Skill[] = [...currentMember.skills];
  const foundRanks: Rank[] = [];

  roles.forEach((roleId) => {
    const mapping = ROLE_MAPPINGS[roleId];
    if (!mapping) return;

    if (mapping.rank) {
      foundRanks.push(mapping.rank);
    }

    // スキルの統合
    mapping.skills.forEach((mappedSkill) => {
      const existingSkillIndex = newSkills.findIndex(s => s.name === mappedSkill.name);
      if (existingSkillIndex !== -1) {
        newSkills[existingSkillIndex].level = Math.max(newSkills[existingSkillIndex].level, mappedSkill.level);
      } else {
        newSkills.push(mappedSkill);
      }
    });
  });

  // ギルドロールが1つも見つからない → 訪問者
  if (foundRanks.length === 0) {
    return {
      ...currentMember,
      isVisitor: true,
      subJob: null,
      skills: newSkills,
    };
  }

  // メインジョブ = 最初のロール、サブジョブ = 2番目（なければ null）
  const mainRank = foundRanks[0];
  const subRank = foundRanks.length > 1 ? foundRanks[1] : null;

  return {
    ...currentMember,
    rank: mainRank,
    mainJob: mainRank,
    subJob: subRank,
    isVisitor: false,
    skills: newSkills,
  };
}
