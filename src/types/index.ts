export type EventType = 'countdown' | 'countup';
export type RepeatType = 'none' | 'weekly' | 'monthly' | 'yearly';

export const REPEAT_LABELS: Record<RepeatType, string> = {
  none:    '不重复',
  weekly:  '每周',
  monthly: '每月',
  yearly:  '每年',
};

export interface CountdownEvent {
  id: string;
  title: string;
  targetDate: string; // ISO date string YYYY-MM-DD
  type: EventType;
  repeat: RepeatType;
  isLunar: boolean;
  pinned: boolean;
  categoryId?: string;
  themeColor: string;
  coverImage?: string;
  icon?: string;
  note?: string;
  createdAt: string;
}

export const THEME_COLORS = [
  '#5B8DEF',
  '#F87171',
  '#34D399',
  '#FBBF24',
  '#A78BFA',
  '#F472B6',
  '#FB923C',
  '#2DD4BF',
];

export const DEFAULT_COLOR = THEME_COLORS[0];

export type GradientCategory = 'sakura' | 'wa' | 'shiki' | 'wabi' | 'yugen' | 'sumi';

export const GRADIENT_CATEGORY_LABELS: Record<GradientCategory, string> = {
  sakura: '桜  花系',
  wa:     '和  色系',
  shiki:  '四季',
  wabi:   '侘寂',
  yugen:  '幽玄',
  sumi:   '水墨',
};

export interface GradientPreset {
  id: string;
  colors: string[];
  label: string;
  category: GradientCategory;
  dark: boolean; // true = dark/vibrant bg → white text; false = light bg → dark text
}

export const GRADIENT_PRESETS: GradientPreset[] = [
  // ── 桜  花系 ──
  { id: 'sk_somei',   colors: ['#FFE4EE', '#FFBDD0', '#FF97B8'],        label: '染井吉野', category: 'sakura', dark: false },
  { id: 'sk_haru',    colors: ['#FAE8F2', '#F0C8DC', '#E0A8C4'],        label: '春霞',     category: 'sakura', dark: false },
  { id: 'sk_momo',    colors: ['#FFCEB8', '#FFA090', '#E87878'],        label: '桃花',     category: 'sakura', dark: false },
  { id: 'sk_otome',   colors: ['#F4C8E4', '#E090C8', '#C060A0'],        label: '乙女',     category: 'sakura', dark: true  },
  { id: 'sk_fubuki',  colors: ['#FF8FA8', '#FF5878', '#E82E50'],        label: '花吹雪',   category: 'sakura', dark: true  },
  { id: 'sk_yae',     colors: ['#D898B8', '#B86898', '#904870'],        label: '八重桜',   category: 'sakura', dark: true  },

  // ── 和  色系 ──
  { id: 'wa_ruri',    colors: ['#1840A0', '#2860C8', '#4888E8'],        label: '瑠璃',     category: 'wa', dark: true },
  { id: 'wa_fuji',    colors: ['#9068C0', '#6840A0', '#481880'],        label: '藤色',     category: 'wa', dark: true },
  { id: 'wa_moegi',   colors: ['#8AB060', '#608038', '#385018'],        label: '萌黄',     category: 'wa', dark: true },
  { id: 'wa_tan',     colors: ['#B03030', '#882020', '#601010'],        label: '丹',       category: 'wa', dark: true },
  { id: 'wa_kogane',  colors: ['#D8B030', '#B08810', '#887000'],        label: '黄金',     category: 'wa', dark: true },
  { id: 'wa_asagi',   colors: ['#3AA8C0', '#2080A0', '#106080'],        label: '浅葱',     category: 'wa', dark: true },

  // ── 四季 ──
  { id: 'sk4_mebuki', colors: ['#A8D890', '#70B060', '#407838'],        label: '芽吹き',   category: 'shiki', dark: true  },
  { id: 'sk4_natsu',  colors: ['#58B8E8', '#2888C8', '#0858A0'],        label: '夏の空',   category: 'shiki', dark: true  },
  { id: 'sk4_momiji', colors: ['#E07030', '#C04010', '#980808'],        label: '紅葉',     category: 'shiki', dark: true  },
  { id: 'sk4_yuki',   colors: ['#E8EEF8', '#C8D4E8', '#A0B4D0'],        label: '雪景色',   category: 'shiki', dark: false },
  { id: 'sk4_nanohana',colors: ['#F0E040', '#D0B818', '#A88808'],       label: '菜の花',   category: 'shiki', dark: true  },
  { id: 'sk4_yozakura',colors: ['#1A0828', '#281040', '#3A1858'],       label: '夜桜',     category: 'shiki', dark: true  },

  // ── 侘寂 ──
  { id: 'wb_kareno',  colors: ['#C8B890', '#A09070', '#786850'],        label: '枯れ野',   category: 'wabi', dark: true },
  { id: 'wb_koke',    colors: ['#607850', '#485830', '#303820'],        label: '苔むす',   category: 'wabi', dark: true },
  { id: 'wb_sabi',    colors: ['#A06040', '#784028', '#502018'],        label: '錆',       category: 'wabi', dark: true },
  { id: 'wb_take',    colors: ['#5C4838', '#402E20', '#281C10'],        label: '煤竹',     category: 'wabi', dark: true },
  { id: 'wb_nuno',    colors: ['#C8B8A0', '#A09080', '#786858'],        label: '古布',     category: 'wabi', dark: true },
  { id: 'wb_tsuchi',  colors: ['#C09870', '#987850', '#706030'],        label: '土の香',   category: 'wabi', dark: true },

  // ── 幽玄 ──
  { id: 'yg_tobari',  colors: ['#0A0E18', '#141828', '#1E2838'],        label: '夜の帳',   category: 'yugen', dark: true },
  { id: 'yg_yoiyami', colors: ['#14082A', '#201040', '#2E1A52'],        label: '宵闇',     category: 'yugen', dark: true },
  { id: 'yg_shinkai', colors: ['#081828', '#102438', '#183058'],        label: '深海',     category: 'yugen', dark: true },
  { id: 'yg_miyama',  colors: ['#081410', '#101E14', '#182C1C'],        label: '深山',     category: 'yugen', dark: true },
  { id: 'yg_shikon',  colors: ['#180828', '#241040', '#301858'],        label: '紫紺',     category: 'yugen', dark: true },
  { id: 'yg_aiyoru',  colors: ['#08102A', '#101C40', '#182850'],        label: '藍夜',     category: 'yugen', dark: true },

  // ── 水墨 ──
  { id: 'sm_usuzumi', colors: ['#E0D8D0', '#B8B0A8', '#908880'],        label: '薄墨',     category: 'sumi', dark: false },
  { id: 'sm_sumi',    colors: ['#2C2418', '#1C1610', '#100E08'],        label: '墨汁',     category: 'sumi', dark: true  },
  { id: 'sm_kasumi',  colors: ['#C8C8D0', '#A0A0B0', '#787888'],        label: '霞',       category: 'sumi', dark: true  },
  { id: 'sm_aosumi',  colors: ['#203868', '#182848', '#101C30'],        label: '青墨',     category: 'sumi', dark: true  },
  { id: 'sm_hai',     colors: ['#B0A8A0', '#888078', '#605850'],        label: '灰',       category: 'sumi', dark: true  },
  { id: 'sm_gin',     colors: ['#E8E8EC', '#C0C0C8', '#9898A4'],        label: '銀霧',     category: 'sumi', dark: false },
];
