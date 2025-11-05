export interface Agent {
  id: string;
  name: string;
  language: string;
  username?: string;
  bio?: string[]
  communityBio: string[];
  communityRules: string[];
  communityKnowledge: string[];
  pinnedNotes: string[];
  admins?: string[];
}
