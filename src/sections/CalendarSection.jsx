import { motion } from 'framer-motion';
import { DayPicker } from 'react-day-picker';
import { ko } from 'date-fns/locale';
import { RevealText } from '../shared/ui';

export default function CalendarSection({
  activeSection,
  revealed,
  sectionMotion,
  weddingDate,
  countdown,
}) {
  return (
    <motion.section
      className={`section section-screen calendar ${activeSection === 2 ? 'is-current' : 'is-dimmed'}`}
      data-section-index="2"
      custom={2}
      {...sectionMotion}
    >
      <RevealText as="p" className="map-eyebrow" lines={['Wedding Day']} active={revealed} />
      <RevealText as="h2" className="section-title calendar-section-title" lines={['예식 일시']} baseDelay={0.04} active={revealed} />
      <RevealText
        as="p"
        className="calendar-title"
        lines={['2026. 06. 20. 토요일 오전 11시']}
        baseDelay={0.06}
        active={revealed}
      />
      <div className="calendar-emblem" aria-hidden="true" />
      <div className="calendar-wrap">
        <DayPicker
          mode="single"
          month={new Date(2026, 5)}
          selected={weddingDate}
          defaultMonth={new Date(2026, 5)}
          disableNavigation
          hideNavigation
          required
          onSelect={() => {}}
          disabled={(date) => date.getFullYear() !== 2026 || date.getMonth() !== 5 || date.getDate() !== 20}
          showOutsideDays={false}
          locale={ko}
          formatters={{ formatCaption: (month) => `${month.getMonth() + 1}월` }}
          className="wedding-calendar"
          modifiersClassNames={{ selected: 'wedding-day-selected', today: 'wedding-day-today' }}
        />
      </div>
      <div className="calendar-emblem" aria-hidden="true" />
      <div className="calendar-caption">
        <div className="count-grid">
          <div className="count-item">
            <RevealText as="span" className="count-item-label" lines={['DAYS']} baseDelay={0.1} active={revealed} />
            <RevealText as="strong" className="count-item-value" lines={[String(countdown.days)]} baseDelay={0.14} active={revealed} />
          </div>
          <div className="count-item">
            <RevealText as="span" className="count-item-label" lines={['HOUR']} baseDelay={0.18} active={revealed} />
            <RevealText as="strong" className="count-item-value" lines={[String(countdown.hours)]} baseDelay={0.22} active={revealed} />
          </div>
          <div className="count-item">
            <RevealText as="span" className="count-item-label" lines={['MIN']} baseDelay={0.26} active={revealed} />
            <RevealText as="strong" className="count-item-value" lines={[String(countdown.minutes)]} baseDelay={0.3} active={revealed} />
          </div>
          <div className="count-item">
            <RevealText as="span" className="count-item-label" lines={['SEC']} baseDelay={0.34} active={revealed} />
            <RevealText as="strong" className="count-item-value" lines={[String(countdown.seconds)]} baseDelay={0.38} active={revealed} />
          </div>
        </div>
        <RevealText
          as="p"
          className="count-copy"
          lines={[
            <>
              <span className="count-copy-names">무민 <span className="count-copy-heart">♥</span> 소연</span>의 결혼식이 <strong>{countdown.days + 1}일</strong> 남았습니다.
            </>,
          ]}
          active={revealed}
        />
      </div>
    </motion.section>
  );
}
