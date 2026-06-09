export type RoomStyle = {
  id: string;
  name: string;
  image: string;
  trending?: boolean;
};

export const STYLES: RoomStyle[] = [
  {
    id: "minimal",
    name: "Minimal",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=70",
    trending: true,
  },
  {
    id: "modern",
    name: "Modern",
    image:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=70",
  },
  {
    id: "scandi",
    name: "Scandi",
    image:
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=800&q=70",
  },
  {
    id: "wabi-sabi",
    name: "Wabi-Sabi",
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=70",
  },
  {
    id: "industrial",
    name: "Industrial",
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=70",
  },
];

export const DEFAULT_STYLE = STYLES[0];
