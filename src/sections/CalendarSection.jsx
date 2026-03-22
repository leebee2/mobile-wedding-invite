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
      <RevealText
        as="p"
        className="calendar-subtitle"
        lines={['2026. 06. 20. 토요일 오전 11시']}
        baseDelay={0.06}
        active={revealed}
      />
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
      <div className="calendar-caption">
        <div className="count-grid">
          <div className="count-item">
            <span>DAYS</span>
            <strong>{countdown.days}</strong>
          </div>
          <div className="count-item">
            <span>HOUR</span>
            <strong>{countdown.hours}</strong>
          </div>
          <div className="count-item">
            <span>MIN</span>
            <strong>{countdown.minutes}</strong>
          </div>
          <div className="count-item">
            <span>SEC</span>
            <strong>{countdown.seconds}</strong>
          </div>
        </div>
        <RevealText
          as="p"
          className="count-copy"
          lines={[
            <>
              무민, 소연의 결혼식이 <strong>{countdown.days + 1}일</strong> 남았습니다.
            </>,
          ]}
          active={revealed}
        />
      </div>
    </motion.section>
  );
}
