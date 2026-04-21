export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
}

export const DUMMY_TRACKS: Track[] = [
  {
    id: "1",
    title: "NEURAL_NETWORK_ERROR",
    artist: "CYBER_CORE",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: 372
  },
  {
    id: "2",
    title: "DATA_VOXEL_STORM",
    artist: "VOID_ENGINE",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: 425
  },
  {
    id: "3",
    title: "QUANTUM_GHOST_CODE",
    artist: "RECURSIVE_GHOST",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: 312
  }
];

export interface Point {
  x: number;
  y: number;
}

export const GRID_SIZE = 20;
export const INITIAL_SNAKE: Point[] = [{ x: 10, y: 10 }];
export const INITIAL_DIRECTION: Point = { x: 0, y: -1 };
export const GAME_SPEED = 150;
