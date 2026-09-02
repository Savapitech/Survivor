import { useEffect, useId, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { getSeeker } from '../api/seekers';
import { getRecruiter } from '../api/recruiters';
import {
  getThread,
  listRecruiterConversations,
  listSeekerConversations,
  markThreadSeen,
  sendMessage,
} from '../api/messages';
import type {
  RecruiterConversation,
  RecruiterDetail,
  SeekerConversation,
  SeekerDetail,
} from '../api/models';
import { useSession } from '../context/SessionContext';
import { useAnnounce } from '../context/AnnounceContext';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { formatTime } from '../utils/format';
import styles from './Messaging.module.css';

export function Messaging() {
  useDocumentTitle('Messagerie');
  const { session, isSeeker, isRecruiter } = useSession();
  const { announce, announceError } = useAnnounce();
  const [searchParams, setSearchParams] = useSearchParams();
  const composerId = useId();

  const recruiterId = isRecruiter ? session?.recruiterId : undefined;
  const seekerId = isSeeker ? session?.seekerId : undefined;

  const deepLinkOtherId = isRecruiter
    ? Number(searchParams.get('seekerId')) || null
    : null;
  const [selectedOtherId, setSelectedOtherId] = useState<number | null>(
    deepLinkOtherId,
  );
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const recruiterConversations = useAsync(
    () =>
      recruiterId
        ? listRecruiterConversations(recruiterId)
        : Promise.reject(new Error('no recruiter')),
    [recruiterId],
  );
  const seekerConversations = useAsync(
    () =>
      seekerId
        ? listSeekerConversations(seekerId)
        : Promise.reject(new Error('no seeker')),
    [seekerId],
  );

  const otherProfile = useAsync<SeekerDetail | RecruiterDetail>(() => {
    if (isRecruiter && selectedOtherId) return getSeeker(selectedOtherId);
    if (isSeeker && selectedOtherId) return getRecruiter(selectedOtherId);
    return Promise.reject(new Error('no selection'));
  }, [isRecruiter, isSeeker, selectedOtherId]);

  const thread = useAsync(() => {
    if (isRecruiter && recruiterId && selectedOtherId) {
      return getThread(recruiterId, selectedOtherId, { pageSize: 100 });
    }
    if (isSeeker && seekerId && selectedOtherId) {
      return getThread(selectedOtherId, seekerId, { pageSize: 100 });
    }
    return Promise.reject(new Error('no selection'));
  }, [isRecruiter, isSeeker, recruiterId, seekerId, selectedOtherId]);

  useEffect(() => {
    if (!selectedOtherId) return;
    if (isRecruiter && recruiterId) {
      markThreadSeen(recruiterId, selectedOtherId, 'recruiter')
        .then(() => recruiterConversations.refetch())
        .catch(() => undefined);
    } else if (isSeeker && seekerId) {
      markThreadSeen(selectedOtherId, seekerId, 'seeker')
        .then(() => seekerConversations.refetch())
        .catch(() => undefined);
    }
  }, [selectedOtherId, isRecruiter, isSeeker, recruiterId, seekerId]);

  if (!isSeeker && !isRecruiter) {
    return <Navigate to="/" replace />;
  }

  function selectConversation(otherId: number) {
    setSelectedOtherId(otherId);
    setSendError(null);
    if (isRecruiter) {
      setSearchParams(otherId ? { seekerId: String(otherId) } : {}, {
        replace: true,
      });
    }
  }

  async function handleSend(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedOtherId || !draft.trim()) return;

    setSending(true);
    setSendError(null);
    try {
      if (isRecruiter && recruiterId) {
        await sendMessage({
          recruiterId,
          seekerId: selectedOtherId,
          senderRole: 'recruiter',
          content: draft.trim(),
        });
        recruiterConversations.refetch();
      } else if (isSeeker && seekerId) {
        await sendMessage({
          recruiterId: selectedOtherId,
          seekerId,
          senderRole: 'seeker',
          content: draft.trim(),
        });
        seekerConversations.refetch();
      }
      setDraft('');
      thread.refetch();
      announce('Message envoyé.');
    } catch {
      const message = "Le message n'a pas pu être envoyé.";
      setSendError(message);
      announceError(message);
    } finally {
      setSending(false);
    }
  }

  const conversations = isRecruiter
    ? recruiterConversations
    : seekerConversations;

  function conversationLabel(
    item: RecruiterConversation | SeekerConversation,
  ): string {
    return 'seeker' in item
      ? `${item.seeker.name} ${item.seeker.lastname}`
      : item.recruiter.companyName;
  }

  function conversationOtherId(
    item: RecruiterConversation | SeekerConversation,
  ): number {
    return 'seeker' in item ? item.seeker.id : item.recruiter.id;
  }

  const selectedLabel = otherProfile.data
    ? isRecruiter && 'name' in otherProfile.data
      ? `${otherProfile.data.name} ${otherProfile.data.lastname}`
      : 'companyName' in otherProfile.data
        ? otherProfile.data.companyName
        : ''
    : '';

  const knownIds = new Set(
    (conversations.data ?? []).map((c) => conversationOtherId(c)),
  );

  return (
    <section>
      <h1>Messagerie</h1>
      <div className={styles.layout}>
        <nav aria-label="Conversations" className={styles.conversations}>
          <h2 className="visually-hidden">Liste des conversations</h2>
          {conversations.loading && (
            <LoadingState label="Chargement des conversations..." />
          )}
          {conversations.error && (
            <ErrorState onRetry={conversations.refetch} />
          )}
          {conversations.data && conversations.data.length === 0 && (
            <EmptyState>
              {isRecruiter
                ? 'Contactez un candidat depuis le feed pour démarrer une conversation.'
                : 'Aucune conversation pour le moment.'}
            </EmptyState>
          )}
          {conversations.data && conversations.data.length > 0 && (
            <ul className={styles.list}>
              {conversations.data.map((item) => {
                const otherId = conversationOtherId(item);
                const selected = otherId === selectedOtherId;
                return (
                  <li key={otherId}>
                    <button
                      type="button"
                      className={`${styles.conversationButton} ${selected ? styles.conversationButtonSelected : ''}`}
                      aria-current={selected ? 'true' : undefined}
                      onClick={() => selectConversation(otherId)}
                    >
                      <span className={styles.conversationName}>
                        {conversationLabel(item)}
                        {item.unreadCount > 0 && (
                          <span className={styles.unreadBadge}>
                            {item.unreadCount}
                            <span className="visually-hidden">
                              {' '}
                              message(s) non lu(s)
                            </span>
                          </span>
                        )}
                      </span>
                      <span className={styles.conversationPreview}>
                        {item.lastMessage.content}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {isRecruiter && deepLinkOtherId && !knownIds.has(deepLinkOtherId) && (
            <p className={styles.newConversationHint}>
              Nouvelle conversation prête à démarrer.
            </p>
          )}
        </nav>

        <div className={styles.thread}>
          {!selectedOtherId && (
            <p>Sélectionnez une conversation pour l'afficher ici.</p>
          )}

          {selectedOtherId && (
            <div className={styles.threadContent}>
              <h2 className={styles.threadTitle}>
                {selectedLabel || 'Conversation'}
              </h2>

              <div className={styles.messages} aria-live="polite">
                {thread.loading && (
                  <LoadingState label="Chargement des messages..." />
                )}
                {thread.error && <ErrorState onRetry={thread.refetch} />}
                {thread.data && thread.data.data.length === 0 && (
                  <EmptyState>
                    Aucun message pour le moment. Écrivez le premier.
                  </EmptyState>
                )}
                {thread.data &&
                  thread.data.data.map((message) => {
                    const isMine =
                      (isRecruiter && message.senderRole === 'recruiter') ||
                      (isSeeker && message.senderRole === 'seeker');
                    return (
                      <div
                        key={message.id}
                        className={`${styles.messageBubble} ${isMine ? styles.messageMine : styles.messageOther}`}
                      >
                        <p className={styles.messageContent}>
                          {message.content}
                        </p>
                        <span className={styles.messageTime}>
                          {formatTime(message.createdAt)}
                        </span>
                      </div>
                    );
                  })}
              </div>

              <form onSubmit={handleSend} className={styles.composer}>
                <label htmlFor={composerId} className="visually-hidden">
                  Votre message
                </label>
                <textarea
                  id={composerId}
                  className={styles.composerInput}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Écrivez votre message..."
                  rows={2}
                  required
                />
                {sendError && (
                  <p role="alert" style={{ color: 'var(--color-error)' }}>
                    {sendError}
                  </p>
                )}
                <Button
                  type="submit"
                  loading={sending}
                  disabled={!draft.trim()}
                >
                  Envoyer
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
