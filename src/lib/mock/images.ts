/**
 * All image paths are managed in this single file.
 * To swap in real photos, replace only the URLs here. The rest of the
 * site picks them up automatically.
 *
 * - `u(id)`     Unsplash placeholder helper
 * - `local(p)`  `public/images/*` path (use once real assets land)
 *
 * See `public/images/README.md` for the folder layout and naming convention.
 */

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const local = (path: string) => `/images/${path}`;

// Maps a W2-1 sample-space URL to its AI-rendered counterpart.
const W2_AI_BY_URL_BUILDER = () => ({
  [local("scenarios/w2/w2_1.jpg")]: local("scenarios/w2/w2_1_ai.png"),
  [local("scenarios/w2/w2_2.jpg")]: local("scenarios/w2/w2_2_ai.png"),
  [local("scenarios/w2/w2_3.jpg")]: local("scenarios/w2/w2_3_ai.png"),
  [local("scenarios/w2/w2_4.jpg")]: local("scenarios/w2/w2_4_ai.png"),
  [local("scenarios/w2/w2_5.jpg")]: local("scenarios/w2/w2_5_ai.png"),
});

export const W2_AI_BY_URL: Record<string, string> = W2_AI_BY_URL_BUILDER();

// Isolated copy of W2-1 photos used ONLY by My Projects history.
// Kept separate from `scenarios/w2/` (Design Studio AI results) so the
// two surfaces never share assets.
export const PROJECT_W2_PHOTOS = {
  before: [
    local("projects/w2-1/w2_1.jpg"),
    local("projects/w2-1/w2_2.jpg"),
    local("projects/w2-1/w2_3.jpg"),
  ],
  after: [
    local("projects/w2-1/w2_1_ai.png"),
    local("projects/w2-1/w2_2_ai.png"),
    local("projects/w2-1/w2_3_ai.png"),
  ],
};

export const IMAGES = {
  designDemo: {
    before: local("design-demo/before.webp"),
    after: local("design-demo/after.webp"),
  },
  scenarios: {
    random: {
      referenceSpace: local("scenarios/random/reference-space.webp"),
      furniture: {
        chair: local("scenarios/random/chair.webp"),
        lamp: local("scenarios/random/lamp.webp"),
      },
      styles: [
        local("scenarios/random/style-warm.webp"),
        local("scenarios/random/style-scandinavian.webp"),
        local("scenarios/random/style-vintage.webp"),
        local("scenarios/random/style-cafe.webp"),
        local("scenarios/random/style-natural.webp"),
      ],
    },
    w2: {
      reference: local("scenarios/w2/w2_1.jpg"),
      studioEntry: local("scenarios/w2/w2_2.jpg"),
      meetingBay: local("scenarios/w2/w2_3.jpg"),
      tvLounge: local("scenarios/w2/w2_4.jpg"),
      openLounge: local("scenarios/w2/w2_5.jpg"),
      ai: {
        reference: local("scenarios/w2/w2_1_ai.png"),
        studioEntry: local("scenarios/w2/w2_2_ai.png"),
        meetingBay: local("scenarios/w2/w2_3_ai.png"),
        tvLounge: local("scenarios/w2/w2_4_ai.png"),
        openLounge: local("scenarios/w2/w2_5_ai.png"),
      },
    },
  },
  hero: {
    landing: u("1616486338812-3dadae4b4ace"),
    design: u("1505691938895-1758d7feb511"),
    matching: u("1618220179428-22790b461013"),
    trust: u("1600210492486-724fe5c67fb0"),
  },
  moodboard: {
    midcentury: [
      u("1586023492125-27b2c045efd7", 800),
      u("1567016376408-0226e4d0c1ea", 800),
      u("1556909114-f6e7ad7d3136", 800),
      u("1532372576444-dda954194ad0", 800),
      u("1582582621959-48d27397dc69", 800),
      u("1505693416388-ac5ce068fe85", 800),
    ],
    minimalist: [
      u("1493663284031-b7e3aefcae8e", 800),
      u("1554995207-c18c203602cb", 800),
      u("1565538810643-b5bdb714032a", 800),
      u("1556228720-195a672e8a03", 800),
    ],
    industrial: [
      u("1505693416388-ac5ce068fe85", 800),
      u("1567016526105-22da7c13161a", 800),
      u("1502672260266-1c1ef2d93688", 800),
      u("1556228720-195a672e8a03", 800),
    ],
    scandinavian: [
      u("1556228453-efd6c1ff04f6", 800),
      u("1505691723518-36a5ac3be353", 800),
      u("1502672023488-70e25813eb80", 800),
      u("1521334884684-d80222895322", 800),
    ],
  },
  contractors: {
    profiles: [
      u("1500648767791-00dcc994a43e", 400),
      u("1494790108377-be9c29b29330", 400),
      u("1507003211169-0a1dd7228f2d", 400),
      u("1438761681033-6461ffad8d80", 400),
      u("1472099645785-5658abf4ff4e", 400),
      u("1544723795-3fb6469f5b39", 400),
      u("1573496359142-b8d87734a5a2", 400),
      u("1463453091185-61582044d556", 400),
    ],
    portfolios: [
      [
        u("1616486338812-3dadae4b4ace", 800),
        u("1505693416388-ac5ce068fe85", 800),
        u("1582582621959-48d27397dc69", 800),
        u("1567016376408-0226e4d0c1ea", 800),
        u("1556909114-f6e7ad7d3136", 800),
      ],
      [
        u("1493663284031-b7e3aefcae8e", 800),
        u("1554995207-c18c203602cb", 800),
        u("1565538810643-b5bdb714032a", 800),
        u("1600585154340-be6161a56a0c", 800),
        u("1502672260266-1c1ef2d93688", 800),
      ],
      [
        u("1505693416388-ac5ce068fe85", 800),
        u("1567016526105-22da7c13161a", 800),
        u("1502672260266-1c1ef2d93688", 800),
        u("1556228720-195a672e8a03", 800),
        u("1554995207-c18c203602cb", 800),
      ],
      [
        u("1556228453-efd6c1ff04f6", 800),
        u("1505691723518-36a5ac3be353", 800),
        u("1502672023488-70e25813eb80", 800),
        u("1521334884684-d80222895322", 800),
        u("1583847268964-b28dc8f51f92", 800),
      ],
      [
        u("1586023492125-27b2c045efd7", 800),
        u("1532372576444-dda954194ad0", 800),
        u("1505691938895-1758d7feb511", 800),
        u("1618220179428-22790b461013", 800),
        u("1616137422495-1e9e46e2aa77", 800),
      ],
      [
        u("1565538810643-b5bdb714032a", 800),
        u("1556228453-efd6c1ff04f6", 800),
        u("1493663284031-b7e3aefcae8e", 800),
        u("1554995207-c18c203602cb", 800),
        u("1502672023488-70e25813eb80", 800),
      ],
      [
        u("1600210492486-724fe5c67fb0", 800),
        u("1600585154340-be6161a56a0c", 800),
        u("1505691938895-1758d7feb511", 800),
        u("1517705008128-361805f42e86", 800),
        u("1600585154526-990dced4db0d", 800),
      ],
      [
        u("1502672260266-1c1ef2d93688", 800),
        u("1582582621959-48d27397dc69", 800),
        u("1565538810643-b5bdb714032a", 800),
        u("1493663284031-b7e3aefcae8e", 800),
        u("1554995207-c18c203602cb", 800),
      ],
    ],
    licenses: [
      u("1551836022-4c4c79ecde51", 600),
      u("1450101499163-c8848c66ca85", 600),
      u("1556761175-5973dc0f32e7", 600),
      u("1554224155-6726b3ff858f", 600),
      u("1556761175-b413da4baf72", 600),
    ],
  },
  reviewers: [
    u("1438761681033-6461ffad8d80", 200),
    u("1500648767791-00dcc994a43e", 200),
    u("1494790108377-be9c29b29330", 200),
    u("1544723795-3fb6469f5b39", 200),
    u("1463453091185-61582044d556", 200),
    u("1573496359142-b8d87734a5a2", 200),
  ],
  projectUpdates: [
    u("1504917595217-d4dc5ebe6122", 600),
    u("1581092160562-40aa08e78837", 600),
    u("1504307651254-35680f356dfd", 600),
    u("1582582621959-48d27397dc69", 600),
    u("1565538810643-b5bdb714032a", 600),
    u("1556909114-f6e7ad7d3136", 600),
    u("1502672023488-70e25813eb80", 600),
    u("1505691938895-1758d7feb511", 600),
  ],
  projectCompleted: [
    u("1616486338812-3dadae4b4ace", 800),
    u("1505693416388-ac5ce068fe85", 800),
    u("1582582621959-48d27397dc69", 800),
    u("1567016376408-0226e4d0c1ea", 800),
    u("1556909114-f6e7ad7d3136", 800),
    u("1502672023488-70e25813eb80", 800),
  ],
  testimonials: [
    u("1438761681033-6461ffad8d80", 200),
    u("1500648767791-00dcc994a43e", 200),
    u("1494790108377-be9c29b29330", 200),
  ],
};
