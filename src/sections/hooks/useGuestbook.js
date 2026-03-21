import { useEffect, useState } from 'react';

function formatGuestbookDate(value) {
  const date = new Date(value);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
}

export default function useGuestbook({ supabase, setToastMessage }) {
  const [guestbookName, setGuestbookName] = useState('');
  const [guestbookPassword, setGuestbookPassword] = useState('');
  const [guestbookMessage, setGuestbookMessage] = useState('');
  const [guestbookItems, setGuestbookItems] = useState([]);
  const [guestbookLoading, setGuestbookLoading] = useState(true);
  const [guestbookSubmitting, setGuestbookSubmitting] = useState(false);
  const [guestbookModalOpen, setGuestbookModalOpen] = useState(false);
  const [guestbookViewerOpen, setGuestbookViewerOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setGuestbookLoading(false);
      return;
    }

    let cancelled = false;
    const fetchGuestbook = async () => {
      const { data, error } = await supabase
        .from('guestbook')
        .select('id, name, message, created_at')
        .order('created_at', { ascending: false })
        .limit(30);

      if (!cancelled) {
        setGuestbookItems(error ? [] : data || []);
        setGuestbookLoading(false);
      }
    };

    fetchGuestbook();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const handleGuestbookSubmit = async (e) => {
    e.preventDefault();
    const name = guestbookName.trim();
    const password = guestbookPassword.trim();
    const message = guestbookMessage.trim();

    if (!name || !password || !message) {
      setToastMessage('이름, 번호, 메시지를 입력해주세요.');
      window.setTimeout(() => setToastMessage(''), 1800);
      return false;
    }

    if (!supabase) {
      setToastMessage('Supabase 설정이 필요합니다.');
      window.setTimeout(() => setToastMessage(''), 1800);
      return false;
    }

    setGuestbookSubmitting(true);
    const { data, error } = await supabase
      .from('guestbook')
      .insert({ name, password, message })
      .select('id, name, message, created_at')
      .single();

    if (error) {
      setToastMessage('방명록 저장에 실패했습니다.');
      window.setTimeout(() => setToastMessage(''), 1800);
      setGuestbookSubmitting(false);
      return false;
    }

    if (data) {
      setGuestbookItems((prev) => [data, ...prev].slice(0, 30));
      setGuestbookName('');
      setGuestbookPassword('');
      setGuestbookMessage('');
      setToastMessage('방명록이 등록되었습니다.');
      window.setTimeout(() => setToastMessage(''), 1800);
      setGuestbookSubmitting(false);
      return true;
    }

    setGuestbookSubmitting(false);
    return false;
  };

  const openDeleteModal = (id) => {
    setDeleteTargetId(id);
    setDeletePassword('');
    setDeleteModalOpen(true);
  };

  const handleDeleteGuestbook = async (e) => {
    e.preventDefault();
    if (!supabase) {
      setToastMessage('Supabase 설정이 필요합니다.');
      window.setTimeout(() => setToastMessage(''), 1800);
      return;
    }
    const password = deletePassword.trim();
    if (!password) {
      return;
    }

    setDeleteSubmitting(true);
    const { data, error } = await supabase.rpc('delete_guestbook_entry', {
      entry_id: deleteTargetId,
      entry_password: password,
    });

    if (error) {
      setToastMessage('삭제에 실패했습니다.');
      window.setTimeout(() => setToastMessage(''), 1800);
      setDeleteSubmitting(false);
      return;
    }

    if (data === true) {
      setGuestbookItems((prev) => prev.filter((item) => item.id !== deleteTargetId));
      setToastMessage('방명록이 삭제되었습니다.');
      window.setTimeout(() => setToastMessage(''), 1800);
      setDeleteModalOpen(false);
      setDeleteTargetId(null);
      setDeletePassword('');
      setDeleteSubmitting(false);
      return;
    }

    setToastMessage('비밀번호가 일치하지 않습니다.');
    window.setTimeout(() => setToastMessage(''), 1800);
    setDeleteSubmitting(false);
  };

  const openGuestbookModal = () => {
    setGuestbookName('');
    setGuestbookPassword('');
    setGuestbookMessage('');
    setGuestbookModalOpen(true);
  };

  const canSubmitGuestbook =
    guestbookName.trim().length > 0 && guestbookPassword.trim().length > 0 && guestbookMessage.trim().length > 0;
  const canSubmitDelete = deletePassword.trim().length > 0;

  return {
    guestbookName,
    setGuestbookName,
    guestbookPassword,
    setGuestbookPassword,
    guestbookMessage,
    setGuestbookMessage,
    guestbookItems,
    guestbookLoading,
    guestbookSubmitting,
    guestbookModalOpen,
    setGuestbookModalOpen,
    guestbookViewerOpen,
    setGuestbookViewerOpen,
    deleteModalOpen,
    setDeleteModalOpen,
    setDeleteTargetId,
    deletePassword,
    setDeletePassword,
    deleteSubmitting,
    handleGuestbookSubmit,
    openDeleteModal,
    handleDeleteGuestbook,
    openGuestbookModal,
    canSubmitGuestbook,
    canSubmitDelete,
    formatGuestbookDate,
  };
}
