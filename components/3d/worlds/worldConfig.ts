export type WorldId = "start" | "water" | "nature" | "cathedral" | "anchor";

// Scroll offset (0–1) at which the camera passes through each world.
// Equal scroll distance per world: 20%, 40%, 60%, 80%, 100%.
export const WORLD_SCROLL_OFFSETS: Record<WorldId, number> = {
  start: 0.2,
  water: 0.4,
  nature: 0.6,
  cathedral: 0.8,
  anchor: 0.99,
};

// Optional entry/void offset before the first world.
export const ENTRY_SCROLL_OFFSET = 0.0;

export const WORLD_IDS: WorldId[] = ["start", "water", "nature", "cathedral", "anchor"];

// Segments of scroll that are "between" two consecutive worlds (for 15/70/15 debris visibility).
export type BetweenWorldSegment = {
  from: WorldId;
  to: WorldId;
  start: number;
  end: number;
};

export const BETWEEN_WORLD_SEGMENTS: BetweenWorldSegment[] = WORLD_IDS.slice(0, -1).map(
  (fromId, index) => {
    const toId = WORLD_IDS[index + 1];
    return {
      from: fromId,
      to: toId,
      start: WORLD_SCROLL_OFFSETS[fromId],
      end: WORLD_SCROLL_OFFSETS[toId],
    };
  }
);

// How far in scroll space you can be from a world and still be considered
// "inside" it (used for both fog shaping and current world detection).
export const IN_WORLD_RADIUS = 0.05;

// Where we consider you to be deep in the liminal space between worlds.
export const LIMINAL_RADIUS = 0.12;

// Debug: strong colors per world = construction markers (world space vs liminal). Tone down for prod.
export const WORLD_DEBUG_COLORS: Record<WorldId, string> = {
  start: "#E53935",
  water: "#1565C0",
  nature: "#2E7D32",
  cathedral: "#6A1B9A",
  anchor: "#E65100",
};

// Precomputed rotations (Euler angles in radians) that align each world's
// local -Z axis with the incoming camera direction along the spline path.
export const WORLD_ROTATIONS: Record<WorldId, [number, number, number]> = {
  start: [0.0117, -0.0145, 0.0002],
  water: [0.0607, 0.0428, -0.0026],
  nature: [0.0508, -0.0724, 0.0037],
  cathedral: [-0.0484, -0.0448, -0.0022],
  anchor: [-0.0115, 0.0192, 0.0002],
};

