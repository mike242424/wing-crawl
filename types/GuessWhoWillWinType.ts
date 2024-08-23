export type GuessWhoWillWinProps = {
  userId: string;
  locations: { id: string; name: string }[];
  initialGuess?: string | null;
};
