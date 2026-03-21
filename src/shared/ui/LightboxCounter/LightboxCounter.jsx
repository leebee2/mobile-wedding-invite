export default function LightboxCounter({ open, index, total }) {
  if (!open) {
    return null;
  }

  return (
    <div className="lightbox-footer-counter" aria-label={`현재 ${index + 1}번째 사진`}>
      {index + 1} / {total}
    </div>
  );
}
