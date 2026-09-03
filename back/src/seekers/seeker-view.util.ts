import { Seeker, VideoStatus } from './entities/seeker.entity';

export function isMinor(birthDate: string): boolean {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() &&
      today.getDate() >= birth.getDate());
  if (!hasHadBirthdayThisYear) age -= 1;
  return age < 18;
}

export function toPublicSeeker(seeker: Seeker, viewerUserId?: string): Seeker {
  const isOwner = Boolean(viewerUserId) && seeker.user?.id === viewerUserId;
  if (isOwner) {
    return seeker;
  }

  const minor = seeker.user?.birthDate ? isMinor(seeker.user.birthDate) : false;
  const videoAllowed = !minor && seeker.videoStatus === VideoStatus.APPROVED;

  return {
    ...seeker,
    video: videoAllowed ? seeker.video : null,
    videoRejectionReason: null,
    videoModeratedAt: null,
    videoModeratedBy: null,
    videoConsentGivenAt: null,
    videoConsentVersion: null,
  };
}
