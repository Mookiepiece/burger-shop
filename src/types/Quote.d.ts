type BreadWich = {
  type: 'bread';
};

type LettuceWich = {
  type: 'lettuce';
};

type SteakWich = {
  type: 'steak';
  madeof: 'chicken' | 'beef';
  thinkness: number;
  pieces: number;
};

export type Quote = {
  wiches: (BreadWich | LettuceWich | SteakWich)[];
  price?: number;
  comment?: string;
};
