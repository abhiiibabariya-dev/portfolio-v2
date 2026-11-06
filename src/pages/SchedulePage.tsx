import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock3, Download, Mail, Send } from 'lucide-react';
import { api } from '../lib/api';
import { DEFAULT_MEETING_TYPES, downloadIcsFile, formatLocalDate, formatLocalTime, type AvailabilitySlot, type MeetingType } from '../lib/booking';
import { PROFILE } from '../data/portfolioData';

const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
const today = new Date().toISOString().slice(0, 10);
const initialDetails = { visitorName: '', visitorEmail: '', visitorCompany: '', visitorRole: '', visitorPhone: '', visitorLinkedin: '', meetingPurpose: '', additionalMessage: '', website: '' };

export const SchedulePage: React.FC = () => {
  const [types, setTypes] = useState<MeetingType[]>(DEFAULT_MEETING_TYPES);
  const [selectedType, setSelectedType] = useState<MeetingType | null>(null);
  const [date, setDate] = useState(today);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [reservation, setReservation] = useState<{ token: string; expiresAt: string } | null>(null);
  const [details, setDetails] = useState(initialDetails);
  const [stage, setStage] = useState<'type' | 'slot' | 'details' | 'complete'>('type');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const [status, setStatus] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    api.meetingTypes()
      .then(result => setTypes(result.meetingTypes || DEFAULT_MEETING_TYPES))
      .catch(() => setTypes(DEFAULT_MEETING_TYPES));
  }, []);

  useEffect(() => {
    if (!selectedType || stage !== 'slot') return;
    setLoading(true);
    setError('');
    api.availability(date, selectedType.id, selectedType.durationMinutes, localTimezone)
      .then(result => setSlots(result.slots))
      .catch(requestError => setError(requestError instanceof Error ? requestError.message : 'Availability lookup failed.'))
      .finally(() => setLoading(false));
  }, [date, selectedType, stage]);

  useEffect(() => {
    if (!reservation) return;
    const timer = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((new Date(reservation.expiresAt).getTime() - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (!remaining) {
        setReservation(null);
        setSelectedSlot(null);
        setStage('slot');
        setError('Your temporary reservation window expired. Please select a time slot.');
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [reservation]);

  const selectedLabel = useMemo(
    () => selectedSlot && `${formatLocalDate(selectedSlot.startTimeUtc, localTimezone)} · ${formatLocalTime(selectedSlot.startTimeUtc, localTimezone)}`,
    [selectedSlot]
  );

  const chooseType = (type: MeetingType) => {
    setSelectedType(type);
    setSelectedSlot(null);
    setReservation(null);
    setStage('slot');
    setError('');
  };

  const reserve = async (slot: AvailabilitySlot) => {
    if (!selectedType) return;
    setLoading(true);
    setError('');
    try {
      const result = await api.reserveSlot(slot.startTimeUtc, slot.endTimeUtc, selectedType.id, localTimezone);
      setSelectedSlot(slot);
      setReservation({ token: result.reservationToken, expiresAt: result.expiresAt });
      setStage('details');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'This slot is no longer available.');
    } finally {
      setLoading(false);
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedType || !reservation || !selectedSlot) return;
    setLoading(true);
    setError('');
    try {
      const result = await api.createBooking({
        ...details,
        reservationToken: reservation.token,
        meetingTypeId: selectedType.id,
        visitorTimezone: localTimezone,
        durationMinutes: selectedType.durationMinutes,
      });
      setReference(result.bookingReference);
      setStatus(result.status || 'CONFIRMED');
      setStage('complete');
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Booking request failed.';
      setError(message);
      if (message.includes('RESERVATION_EXPIRED') || message.includes('SLOT_UNAVAILABLE')) {
        setReservation(null);
        setSelectedSlot(null);
        setStage('slot');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadIcs = () => {
    if (!selectedSlot || !selectedType) return;
    downloadIcsFile({
      bookingReference: reference || 'MEETING',
      startTimeUtc: selectedSlot.startTimeUtc,
      endTimeUtc: selectedSlot.endTimeUtc,
      title: `${selectedType.name} with Abhishek Babariya`,
      visitorName: details.visitorName,
      visitorEmail: details.visitorEmail,
      visitorCompany: details.visitorCompany,
      meetingPurpose: details.meetingPurpose,
    });
  };

  const directMailtoUrl = selectedSlot && selectedType
    ? `mailto:${PROFILE.email}?subject=${encodeURIComponent(`[Meeting Booking: ${selectedType.name}] ${details.visitorCompany} - ${details.visitorName}`)}&body=${encodeURIComponent(
        `Hello Abhishek,\n\nI have scheduled a ${selectedType.name} conversation with you:\n\nReference: ${reference}\nTime: ${selectedLabel} (${localTimezone})\nName: ${details.visitorName}\nEmail: ${details.visitorEmail}\nCompany: ${details.visitorCompany}\nRole: ${details.visitorRole}\nPurpose: ${details.meetingPurpose}\n${details.additionalMessage ? `Context: ${details.additionalMessage}\n` : ''}`
      )}`
    : `mailto:${PROFILE.email}`;

  const update = (key: keyof typeof details, value: string) => setDetails(current => ({ ...current, [key]: value }));

  return (
    <div className="min-h-screen pt-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <Link to="/contact" className="inline-flex items-center gap-2 font-mono text-[10px] text-[#4a4a54] hover:text-[#c8a96b] mb-12 tracking-widest">
          <ArrowLeft size={11} /> CONTACT / SCHEDULE
        </Link>
        <header className="mb-10">
          <div className="font-mono text-[11px] text-[#c8a96b] tracking-widest mb-3">SECURE MEETING SCHEDULER</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold uppercase">Schedule a<br />Conversation</h1>
          <p className="mt-5 max-w-2xl text-sm text-[#8a8a96] leading-relaxed">
            Choose a meeting type and an available time. Your selected time is held briefly while you submit your details.
          </p>
        </header>

        <div className="mb-6 grid grid-cols-3 gap-2 font-mono text-[9px] tracking-widest">
          <Step active={stage === 'type'} label="01 TYPE" />
          <Step active={stage === 'slot'} label="02 TIME" />
          <Step active={stage === 'details'} label="03 DETAILS" />
        </div>

        <section className="border border-[#1e1e22] bg-[#0f0f10] p-5 sm:p-8" aria-live="polite">
          {stage === 'type' && <TypeStep types={types} onSelect={chooseType} />}
          {stage === 'slot' && selectedType && (
            <SlotStep type={selectedType} date={date} slots={slots} loading={loading} error={error} onDate={setDate} onSelect={reserve} />
          )}
          {stage === 'details' && selectedType && selectedSlot && reservation && (
            <form onSubmit={submit} className="space-y-4">
              <div className="border border-[#c8a96b]/30 bg-[#c8a96b]/5 p-4 font-mono text-[10px]">
                <p className="text-[#c8a96b]">RESERVED FOR {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}</p>
                <p className="mt-2 text-[#f0efea]">{selectedType.name} · {selectedLabel}</p>
                <button type="button" onClick={() => { setReservation(null); setStage('slot'); }} className="mt-3 text-[#8a8a96] hover:text-[#c8a96b]">
                  CHOOSE ANOTHER TIME
                </button>
              </div>
              <div className="absolute -left-[10000px]" aria-hidden="true">
                <label>Website<input tabIndex={-1} autoComplete="off" value={details.website} onChange={event => update('website', event.target.value)} /></label>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="NAME" value={details.visitorName} required onChange={value => update('visitorName', value)} />
                <Field label="WORK EMAIL" type="email" value={details.visitorEmail} required onChange={value => update('visitorEmail', value)} />
                <Field label="COMPANY" value={details.visitorCompany} required onChange={value => update('visitorCompany', value)} />
                <Field label="ROLE / TITLE" value={details.visitorRole} required onChange={value => update('visitorRole', value)} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="PHONE (OPTIONAL)" value={details.visitorPhone} onChange={value => update('visitorPhone', value)} />
                <Field label="LINKEDIN (OPTIONAL)" value={details.visitorLinkedin} onChange={value => update('visitorLinkedin', value)} />
              </div>
              <Field label="MEETING PURPOSE" value={details.meetingPurpose} required onChange={value => update('meetingPurpose', value)} />
              <div>
                <label className="form-label">ADDITIONAL CONTEXT</label>
                <textarea rows={4} value={details.additionalMessage} onChange={event => update('additionalMessage', event.target.value)} className="form-control resize-none" placeholder="Provide any additional details or preferred platform." />
              </div>
              {error && <p role="alert" className="font-mono text-xs text-red-400">{error}</p>}
              <button disabled={loading || secondsLeft === 0} className="w-full inline-flex justify-center items-center gap-2 py-3 bg-[#c8a96b] text-[#0a0a0b] font-mono text-xs font-bold tracking-wider disabled:opacity-50 hover:bg-[#d4b87a]">
                <Send size={12} /> {loading ? 'SECURING BOOKING…' : 'CONFIRM REQUEST'}
              </button>
            </form>
          )}
          {stage === 'complete' && (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 size={36} className="mx-auto text-[#4ade80]" />
              <h2 className="font-mono text-base text-[#f0efea] font-bold">BOOKING {status === 'CONFIRMED' ? 'CONFIRMED' : 'RECORDED'}</h2>
              <div className="inline-block bg-[#141416] border border-[#2a2a30] px-4 py-1.5 font-mono text-xs text-[#c8a96b]">
                REFERENCE: {reference}
              </div>
              <p className="mt-2 text-sm text-[#8a8a96] max-w-md mx-auto leading-relaxed">
                {selectedLabel} ({localTimezone})
              </p>
              <p className="text-xs text-[#4a4a54] max-w-md mx-auto">
                Your reservation has been recorded in the schedule registry. You can download the calendar invitation (.ics) or send a direct email.
              </p>
              <div className="pt-4 flex flex-wrap justify-center gap-3">
                <button
                  onClick={handleDownloadIcs}
                  className="inline-flex items-center gap-2 bg-[#c8a96b] px-4 py-2.5 font-mono text-xs font-bold text-[#0a0a0b] hover:bg-[#d4b87a]"
                >
                  <Download size={13} /> DOWNLOAD CALENDAR INVITE (.ICS)
                </button>
                <a
                  href={directMailtoUrl}
                  className="inline-flex items-center gap-2 border border-[#2a2a30] px-4 py-2.5 font-mono text-xs text-[#f0efea] hover:border-[#c8a96b]/50"
                >
                  <Mail size={13} /> EMAIL CONFIRMATION TO ABHISHEK
                </a>
              </div>
              <div className="pt-6">
                <Link to="/" className="inline-flex font-mono text-xs text-[#c8a96b] hover:underline">
                  RETURN HOME →
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const Step: React.FC<{ active: boolean; label: string }> = ({ active, label }) => <div className={`border px-3 py-2 ${active ? 'border-[#c8a96b]/60 text-[#c8a96b]' : 'border-[#1e1e22] text-[#4a4a54]'}`}>{label}</div>;
const TypeStep: React.FC<{ types: MeetingType[]; onSelect: (type: MeetingType) => void }> = ({ types, onSelect }) => <div><h2 className="font-mono text-xs text-[#f0efea]">SELECT A MEETING TYPE</h2><div className="mt-5 grid sm:grid-cols-2 gap-3">{types.map(type => <button key={type.id} onClick={() => onSelect(type)} className="text-left border border-[#1e1e22] p-4 hover:border-[#c8a96b]/50 transition-colors"><div className="flex justify-between gap-3"><span className="font-mono text-xs text-[#f0efea]">{type.name}</span><span className="font-mono text-[10px] text-[#c8a96b]">{type.durationMinutes} MIN</span></div><p className="mt-2 text-xs leading-relaxed text-[#8a8a96]">{type.description}</p></button>)}</div></div>;
const SlotStep: React.FC<{ type: MeetingType; date: string; slots: AvailabilitySlot[]; loading: boolean; error: string; onDate: (date: string) => void; onSelect: (slot: AvailabilitySlot) => void }> = ({ type, date, slots, loading, error, onDate, onSelect }) => <div><div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"><div><h2 className="font-mono text-xs text-[#f0efea]">SELECT A TIME</h2><p className="mt-2 font-mono text-[10px] text-[#8a8a96]">{type.name} · {type.durationMinutes} minutes · shown in {localTimezone}</p></div><div><label className="form-label">DATE</label><input type="date" min={today} value={date} onChange={event => onDate(event.target.value)} className="form-control" /></div></div>{error && <p role="alert" className="mt-5 font-mono text-xs text-red-400">{error}</p>}<div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">{loading ? <p className="col-span-full font-mono text-xs text-[#8a8a96]">CHECKING AVAILABILITY…</p> : slots.filter(slot => slot.available).map(slot => <button key={slot.startTimeUtc} onClick={() => onSelect(slot)} className="border border-[#1e1e22] px-3 py-3 font-mono text-xs text-[#f0efea] hover:border-[#c8a96b]/60 hover:text-[#c8a96b] transition-colors"><Clock3 size={11} className="inline mr-2" />{formatLocalTime(slot.startTimeUtc, localTimezone)}</button>)}{!loading && !slots.some(slot => slot.available) && <p className="col-span-full font-mono text-xs text-[#8a8a96]">No available times on this date. Choose another day.</p>}</div></div>;
const Field: React.FC<{ label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }> = ({ label, value, onChange, type = 'text', required = false }) => <div><label className="form-label">{label}</label><input type={type} value={value} required={required} onChange={event => onChange(event.target.value)} className="form-control" /></div>;
