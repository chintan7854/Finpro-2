// GitHub Background Image Sync & Scalable Library Service
// Automatically synchronizes background assets from the user's GitHub repository:
// https://github.com/chintan7854/reference-images (main branch)

import { BackgroundPreset } from '../constants/greetingsData';

export interface GitHubRepoConfig {
  owner: string;
  repo: string;
  branch: string;
}

export const DEFAULT_GITHUB_CONFIG: GitHubRepoConfig = {
  owner: 'chintan7854',
  repo: 'reference-images',
  branch: 'main',
};

export interface CategorizedBackgrounds {
  birthday: BackgroundPreset[];
  anniversary: BackgroundPreset[];
  diwali: BackgroundPreset[];
  festivals: BackgroundPreset[];
  specialDays: BackgroundPreset[];
  custom: BackgroundPreset[];
}

// Pre-bundled GitHub assets ensure 100% immediate availability even without network/rate-limits
export const BUNDLED_GITHUB_ASSETS: CategorizedBackgrounds = {
  birthday: [
    {
      id: 'gh_bday_1',
      name: 'Birthday Theme 1 (Portrait 2:3)',
      thumbnailUrl: 'https://cdn.jsdelivr.net/gh/chintan7854/reference-images@main/birthday-1/birthday%20(1).jpeg',
      fullUrl: 'https://raw.githubusercontent.com/chintan7854/reference-images/main/birthday-1/birthday%20(1).jpeg',
      themeColor: '#1e1b4b',
      secondaryColor: '#4338ca',
      accentColor: '#fbbf24',
      patternType: 'balloons',
    },
    {
      id: 'gh_bday_2',
      name: 'Birthday Theme 2 (Portrait 2:3)',
      thumbnailUrl: 'https://cdn.jsdelivr.net/gh/chintan7854/reference-images@main/birthday-1/birthday%20(2).jpeg',
      fullUrl: 'https://raw.githubusercontent.com/chintan7854/reference-images/main/birthday-1/birthday%20(2).jpeg',
      themeColor: '#311042',
      secondaryColor: '#701a75',
      accentColor: '#f472b6',
      patternType: 'balloons',
    },
    {
      id: 'gh_bday_3',
      name: 'Birthday Theme 3 (Portrait 2:3)',
      thumbnailUrl: 'https://cdn.jsdelivr.net/gh/chintan7854/reference-images@main/birthday-1/birthday%20(3).jpeg',
      fullUrl: 'https://raw.githubusercontent.com/chintan7854/reference-images/main/birthday-1/birthday%20(3).jpeg',
      themeColor: '#1e293b',
      secondaryColor: '#334155',
      accentColor: '#38bdf8',
      patternType: 'balloons',
    },
    {
      id: 'gh_bday_4',
      name: 'Birthday Theme 4 (Portrait 2:3)',
      thumbnailUrl: 'https://cdn.jsdelivr.net/gh/chintan7854/reference-images@main/birthday-1/birthday%20(4).jpeg',
      fullUrl: 'https://raw.githubusercontent.com/chintan7854/reference-images/main/birthday-1/birthday%20(4).jpeg',
      themeColor: '#2e1065',
      secondaryColor: '#581c87',
      accentColor: '#facc15',
      patternType: 'balloons',
    },
    {
      id: 'gh_bday_5',
      name: 'Birthday Theme 5 (Portrait 2:3)',
      thumbnailUrl: 'https://cdn.jsdelivr.net/gh/chintan7854/reference-images@main/birthday-1/birthday%20(5).jpeg',
      fullUrl: 'https://raw.githubusercontent.com/chintan7854/reference-images/main/birthday-1/birthday%20(5).jpeg',
      themeColor: '#172554',
      secondaryColor: '#1e40af',
      accentColor: '#60a5fa',
      patternType: 'balloons',
    },
    {
      id: 'gh_bday_6',
      name: 'Birthday Theme 6 (Portrait 2:3)',
      thumbnailUrl: 'https://cdn.jsdelivr.net/gh/chintan7854/reference-images@main/birthday-1/birthday%20(6).jpeg',
      fullUrl: 'https://raw.githubusercontent.com/chintan7854/reference-images/main/birthday-1/birthday%20(6).jpeg',
      themeColor: '#451a03',
      secondaryColor: '#78350f',
      accentColor: '#fbbf24',
      patternType: 'balloons',
    },
  ],
  anniversary: [
    {
      id: 'gh_anni_1',
      name: 'Anniversary Theme 1 (Portrait 2:3)',
      thumbnailUrl: 'https://cdn.jsdelivr.net/gh/chintan7854/reference-images@main/anniversary-1/anniversary%20(1).jpeg',
      fullUrl: 'https://raw.githubusercontent.com/chintan7854/reference-images/main/anniversary-1/anniversary%20(1).jpeg',
      themeColor: '#4c0519',
      secondaryColor: '#881337',
      accentColor: '#fb7185',
      patternType: 'hearts',
    },
    {
      id: 'gh_anni_2',
      name: 'Anniversary Theme 2 (Portrait 2:3)',
      thumbnailUrl: 'https://cdn.jsdelivr.net/gh/chintan7854/reference-images@main/anniversary-1/anniversary%20(2).jpeg',
      fullUrl: 'https://raw.githubusercontent.com/chintan7854/reference-images/main/anniversary-1/anniversary%20(2).jpeg',
      themeColor: '#3b0764',
      secondaryColor: '#701a75',
      accentColor: '#f472b6',
      patternType: 'hearts',
    },
    {
      id: 'gh_anni_3',
      name: 'Anniversary Theme 3 (Portrait 2:3)',
      thumbnailUrl: 'https://cdn.jsdelivr.net/gh/chintan7854/reference-images@main/anniversary-1/anniversary%20(3).jpeg',
      fullUrl: 'https://raw.githubusercontent.com/chintan7854/reference-images/main/anniversary-1/anniversary%20(3).jpeg',
      themeColor: '#1e1b4b',
      secondaryColor: '#312e81',
      accentColor: '#e2b34a',
      patternType: 'hearts',
    },
  ],
  diwali: [
    {
      id: 'gh_diwali_1',
      name: 'Diwali Theme 1 (Portrait 2:3)',
      thumbnailUrl: 'https://cdn.jsdelivr.net/gh/chintan7854/reference-images@main/festival-special-days/diwali1/diwali%20(1).jpeg',
      fullUrl: 'https://raw.githubusercontent.com/chintan7854/reference-images/main/festival-special-days/diwali1/diwali%20(1).jpeg',
      themeColor: '#451a03',
      secondaryColor: '#78350f',
      accentColor: '#facc15',
      patternType: 'diya',
    },
    {
      id: 'gh_diwali_2',
      name: 'Diwali Theme 2 (Portrait 2:3)',
      thumbnailUrl: 'https://cdn.jsdelivr.net/gh/chintan7854/reference-images@main/festival-special-days/diwali1/diwali%20(2).jpeg',
      fullUrl: 'https://raw.githubusercontent.com/chintan7854/reference-images/main/festival-special-days/diwali1/diwali%20(2).jpeg',
      themeColor: '#3f1105',
      secondaryColor: '#9a3412',
      accentColor: '#fdba74',
      patternType: 'diya',
    },
    {
      id: 'gh_diwali_3',
      name: 'Diwali Theme 3 (Portrait 2:3)',
      thumbnailUrl: 'https://cdn.jsdelivr.net/gh/chintan7854/reference-images@main/festival-special-days/diwali1/diwali%20(3).jpeg',
      fullUrl: 'https://raw.githubusercontent.com/chintan7854/reference-images/main/festival-special-days/diwali1/diwali%20(3).jpeg',
      themeColor: '#2e1065',
      secondaryColor: '#581c87',
      accentColor: '#fde047',
      patternType: 'diya',
    },
    {
      id: 'gh_diwali_4',
      name: 'Diwali Theme 4 (Portrait 2:3)',
      thumbnailUrl: 'https://cdn.jsdelivr.net/gh/chintan7854/reference-images@main/festival-special-days/diwali1/diwali%20(4).jpeg',
      fullUrl: 'https://raw.githubusercontent.com/chintan7854/reference-images/main/festival-special-days/diwali1/diwali%20(4).jpeg',
      themeColor: '#172554',
      secondaryColor: '#1e40af',
      accentColor: '#fbbf24',
      patternType: 'diya',
    },
  ],
  festivals: [],
  specialDays: [],
  custom: [],
};

const STORAGE_KEY = 'finadvisor_github_backgrounds_v2';
const CONFIG_STORAGE_KEY = 'finadvisor_github_config_v2';

export function getSavedGitHubConfig(): GitHubRepoConfig {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.owner && parsed.repo) {
          return parsed;
        }
      }
    }
  } catch (e) {
    console.warn('Error reading github config from localStorage', e);
  }
  return DEFAULT_GITHUB_CONFIG;
}

export function saveGitHubConfig(config: GitHubRepoConfig): void {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    }
  } catch (e) {
    console.warn('Error saving github config to localStorage', e);
  }
}

/**
 * Loads cached backgrounds from local storage or bundled defaults
 */
export function getStoredBackgrounds(): CategorizedBackgrounds {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.birthday && parsed.birthday.length > 0) {
          return parsed;
        }
      }
    }
  } catch (e) {
    console.warn('Error reading stored backgrounds', e);
  }
  return BUNDLED_GITHUB_ASSETS;
}

/**
 * Dynamically queries the GitHub API to scan for all image assets in the repository
 */
export async function syncGitHubRepository(
  config: GitHubRepoConfig = getSavedGitHubConfig()
): Promise<{ success: boolean; totalImages: number; backgrounds: CategorizedBackgrounds; error?: string }> {
  try {
    const { owner, repo, branch = 'main' } = config;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;

    const res = await fetch(apiUrl);
    if (!res.ok) {
      // If GitHub API limits or errors out, fallback to bundled assets safely
      console.warn(`GitHub API request returned ${res.status}. Falling back to bundled assets.`);
      return {
        success: false,
        totalImages: countTotalImages(BUNDLED_GITHUB_ASSETS),
        backgrounds: BUNDLED_GITHUB_ASSETS,
        error: `GitHub API status ${res.status}. Using pre-loaded repository catalog.`,
      };
    }

    const data = await res.json();
    if (!data.tree || !Array.isArray(data.tree)) {
      return {
        success: false,
        totalImages: countTotalImages(BUNDLED_GITHUB_ASSETS),
        backgrounds: BUNDLED_GITHUB_ASSETS,
        error: 'Invalid repository tree structure.',
      };
    }

    const categorized: CategorizedBackgrounds = {
      birthday: [],
      anniversary: [],
      diwali: [],
      festivals: [],
      specialDays: [],
      custom: [],
    };

    const imageRegex = /\.(jpe?g|png|webp)$/i;

    for (const item of data.tree) {
      if (item.type !== 'blob' || !imageRegex.test(item.path)) continue;

      const path = item.path as string;
      const encodedPath = path.split('/').map(encodeURIComponent).join('/');
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${encodedPath}`;
      const cdnUrl = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${encodedPath}`;

      // Clean readable display name from filename
      const fileName = path.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'Theme';
      const cleanName = fileName.replace(/[-_]/g, ' ').replace(/\s+/g, ' ');

      const lowerPath = path.toLowerCase();
      let categoryKey: keyof CategorizedBackgrounds = 'festivals';
      let patternType: BackgroundPreset['patternType'] = 'sparkles';
      let themeColor = '#1e1b4b';
      let accentColor = '#fbbf24';

      if (lowerPath.includes('birth')) {
        categoryKey = 'birthday';
        patternType = 'balloons';
        themeColor = '#1e1b4b';
        accentColor = '#fbbf24';
      } else if (lowerPath.includes('anniv')) {
        categoryKey = 'anniversary';
        patternType = 'hearts';
        themeColor = '#4c0519';
        accentColor = '#fb7185';
      } else if (lowerPath.includes('diwali')) {
        categoryKey = 'diwali';
        patternType = 'diya';
        themeColor = '#451a03';
        accentColor = '#facc15';
      } else if (lowerPath.includes('special') || lowerPath.includes('day')) {
        categoryKey = 'specialDays';
        patternType = 'geometric';
        themeColor = '#0f172a';
        accentColor = '#38bdf8';
      } else {
        categoryKey = 'festivals';
        patternType = 'luxury_gold';
        themeColor = '#311042';
        accentColor = '#fde047';
      }

      const preset: BackgroundPreset = {
        id: `gh_${item.sha.slice(0, 8)}`,
        name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1) + ' (GitHub)',
        thumbnailUrl: cdnUrl,
        fullUrl: rawUrl,
        themeColor,
        secondaryColor: '#334155',
        accentColor,
        patternType,
      };

      categorized[categoryKey].push(preset);
    }

    // Merge with bundled assets if any category was empty
    if (categorized.birthday.length === 0) categorized.birthday = BUNDLED_GITHUB_ASSETS.birthday;
    if (categorized.anniversary.length === 0) categorized.anniversary = BUNDLED_GITHUB_ASSETS.anniversary;
    if (categorized.diwali.length === 0) categorized.diwali = BUNDLED_GITHUB_ASSETS.diwali;

    // Cache into local storage
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(categorized));
        saveGitHubConfig(config);
      }
    } catch (e) {
      console.warn('Storage save error', e);
    }

    const total = countTotalImages(categorized);
    return {
      success: true,
      totalImages: total,
      backgrounds: categorized,
    };
  } catch (err: any) {
    console.error('Error syncing GitHub repo:', err);
    return {
      success: false,
      totalImages: countTotalImages(BUNDLED_GITHUB_ASSETS),
      backgrounds: BUNDLED_GITHUB_ASSETS,
      error: err?.message || 'Network error while querying GitHub repository',
    };
  }
}

export function countTotalImages(catalog: CategorizedBackgrounds): number {
  return (
    catalog.birthday.length +
    catalog.anniversary.length +
    catalog.diwali.length +
    catalog.festivals.length +
    catalog.specialDays.length +
    catalog.custom.length
  );
}
