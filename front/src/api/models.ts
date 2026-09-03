export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

export type UserRole = 'admin' | 'seeker' | 'recruiter';
export type VideoStatus = 'pending' | 'approved' | 'rejected';

export interface PublicUser {
  id: string;
  email: string;
  role: UserRole;
  birthDate: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  role: 'seeker' | 'recruiter' | 'admin';
  birthDate: string;
}

export type LookupEntity<K extends string> = { id: number } & Record<K, string>;

export type Competence = LookupEntity<'competence'>;
export type ActivitySector = LookupEntity<'activitySector'>;
export type Localisation = LookupEntity<'localisation'>;

interface SeekerBase {
  id: number;
  name: string;
  lastname: string;
  video: string | null;
  videoStatus: VideoStatus;
  certification: boolean;
  competences: Competence[];
  localisations: Localisation[];
  activitySectors: ActivitySector[];
}

export type SeekerListItem = SeekerBase;
export type SeekerDetail = SeekerBase & {
  user: PublicUser;
  videoRejectionReason?: string | null;
  videoConsentGivenAt?: string | null;
  videoConsentVersion?: string | null;
  likeCount?: number;
};
export type SeekerAdmin = SeekerDetail & {
  user: PublicUser;
  videoRejectionReason: string | null;
  videoModeratedAt: string | null;
  videoModeratedBy: string | null;
  likeCount: number;
};

export interface CreateSeekerDto {
  name: string;
  lastname: string;
  video?: string;
  videoConsent?: boolean;
  userId: string;
  competenceIds?: number[];
  localisationIds?: number[];
  activitySectorIds?: number[];
}

export type UpdateSeekerDto = Partial<
  Omit<CreateSeekerDto, 'userId' | 'video'>
> & {
  video?: string | null;
};

export interface FindSeekersQuery extends PaginationQuery {
  competenceIds?: number[];
  localisationIds?: number[];
  activitySectorIds?: number[];
  search?: string;
  recruiterId?: number;
}

export interface FindSeekersAdminQuery extends PaginationQuery {
  videoStatus?: VideoStatus;
}

export interface ModerateSeekerVideoDto {
  status: 'approved' | 'rejected';
  reason?: string;
  adminUserId: string;
}

interface RecruiterBase {
  id: number;
  companyName: string;
}

export type RecruiterListItem = RecruiterBase;
export type RecruiterDetail = RecruiterBase & { user: PublicUser };

export interface CreateRecruiterDto {
  companyName: string;
  userId: string;
}

export type UpdateRecruiterDto = Partial<Omit<CreateRecruiterDto, 'userId'>>;

export interface Question {
  id: number;
  label: string;
  weight: number;
  active: boolean;
}

export interface Answer {
  id: number;
  value: number;
  question: Question;
}

export interface AttemptView {
  id: number;
  score: number | null;
  submittedAt: string | null;
  questions: Question[];
  answers: Answer[];
}

export interface AnswerInput {
  questionId: number;
  value: number;
}

export interface SubmitAttemptResult {
  attemptId: number;
  score: number;
  submittedAt: string;
  certified: boolean;
}

export type InteractionType = 'view' | 'contact' | 'favorite' | 'like';

interface InteractionBase {
  id: number;
  type: InteractionType;
  createdAt: string;
  seenAt: string | null;
}

export type InteractionSent = InteractionBase & { seeker: SeekerListItem };
export type InteractionReceived = InteractionBase & {
  recruiter: RecruiterListItem;
};
export type InteractionFull = InteractionBase & {
  recruiter?: RecruiterListItem;
  seeker?: SeekerListItem;
};

export interface CreateInteractionDto {
  type: InteractionType;
  recruiterId: number;
  seekerId: number;
}

export type MessageSenderRole = 'seeker' | 'recruiter';

export interface MessagePreview {
  id: number;
  senderRole: MessageSenderRole;
  content: string;
  createdAt: string;
  seenAt: string | null;
}

export interface CreateMessageDto {
  recruiterId: number;
  seekerId: number;
  senderRole: MessageSenderRole;
  content: string;
}

export interface ConversationSeekerSummary {
  id: number;
  name: string;
  lastname: string;
  certification: boolean;
}

export interface RecruiterConversation {
  seeker: ConversationSeekerSummary;
  lastMessage: MessagePreview;
  unreadCount: number;
}

export interface SeekerConversation {
  recruiter: RecruiterListItem;
  lastMessage: MessagePreview;
  unreadCount: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: PublicUser;
}
