import { useEffect, useState } from 'react';
import { countUnread as countUnreadNotifications } from '../api/interactions';
import {
  listRecruiterConversations,
  listSeekerConversations,
} from '../api/messages';
import { useSession } from '../context/SessionContext';

const POLL_INTERVAL_MS = 45000;

export interface UnreadCounts {
  notifications: number;
  messages: number;
}

export function useUnreadCounts(): UnreadCounts {
  const { isSeeker, isRecruiter, session } = useSession();
  const seekerId = session?.seekerId;
  const recruiterId = session?.recruiterId;

  const [notifications, setNotifications] = useState(0);
  const [messages, setMessages] = useState(0);

  useEffect(() => {
    if (!isSeeker || !seekerId) {
      setNotifications(0);
      return;
    }

    let cancelled = false;

    function fetchCount() {
      countUnreadNotifications(seekerId!)
        .then((result) => {
          if (!cancelled) setNotifications(result.unread);
        })
        .catch(() => {});
    }

    fetchCount();
    const interval = setInterval(fetchCount, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [isSeeker, seekerId]);

  useEffect(() => {
    if (isSeeker && seekerId) {
      let cancelled = false;

      function fetchCount() {
        listSeekerConversations(seekerId!)
          .then((conversations) => {
            if (!cancelled) {
              setMessages(
                conversations.reduce((sum, c) => sum + c.unreadCount, 0),
              );
            }
          })
          .catch(() => {});
      }

      fetchCount();
      const interval = setInterval(fetchCount, POLL_INTERVAL_MS);
      return () => {
        cancelled = true;
        clearInterval(interval);
      };
    }

    if (isRecruiter && recruiterId) {
      let cancelled = false;

      function fetchCount() {
        listRecruiterConversations(recruiterId!)
          .then((conversations) => {
            if (!cancelled) {
              setMessages(
                conversations.reduce((sum, c) => sum + c.unreadCount, 0),
              );
            }
          })
          .catch(() => {});
      }

      fetchCount();
      const interval = setInterval(fetchCount, POLL_INTERVAL_MS);
      return () => {
        cancelled = true;
        clearInterval(interval);
      };
    }

    setMessages(0);
    return undefined;
  }, [isSeeker, isRecruiter, seekerId, recruiterId]);

  return { notifications, messages };
}
