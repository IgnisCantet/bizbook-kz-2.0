/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║   BizBook KZ — Полный концепт мобильного приложения            ║
 * ║   © 2026 IgnisCantet.kz. Все права защищены.                  ║
 * ║   Разработано: IgnisCantet.kz | dev@igniscantet.kz             ║
 * ║   Авторские права защищены Законом РК «Об авторском праве»    ║
 * ║   №6-I от 10 июня 1996 года.                                  ║
 * ║   Несанкционированное копирование и распространение            ║
 * ║   исходного кода ЗАПРЕЩЕНО и преследуется по закону РК.        ║
 * ║   Unauthorized copying, distribution or modification           ║
 * ║   of this software is strictly prohibited.                     ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  MRP, MZP, CO, EMPLOYEES, DOCS_DATA, BANK_OPS,
  COUNTERPARTIES, TAXES_DATA, TAX_CALENDAR, NEWS_DATA,
  DocColor, DocIcon, calcSalary, AUTHOR, APP_VERSION
} from './data/constants.js';

// ─── Design tokens ────────────────────────────────────────────────
const C = {
  bg: '#07070f', card: '#0e0e1c', card2: '#151523', card3: '#1c1c2e',
  border: 'rgba(255,255,255,0.06)', border2: 'rgba(255,255,255,0.11)',
  blue: '#3b82f6', cyan: '#06b6d4', green: '#22c55e',
  orange: '#f59e0b', red: '#ef4444', purple: '#a855f7', pink: '#ec4899',
  text: '#f0f4ff', muted: '#5a6882', dim: '#252840',
  gold: '#fbbf24', teal: '#14b8a6',
};

// ─── Utils ────────────────────────────────────────────────────────
const fmt = n => (n || 0).toLocaleString('ru-KZ') + ' ₸';
const fmtN = n => (n || 0).toLocaleString('ru-KZ');
const PAY = {
  paid: { l: 'Оплачен', c: C.green, b: 'rgba(34,197,94,.14)' },
  partial: { l: 'Частично', c: C.orange, b: 'rgba(245,158,11,.14)' },
  unpaid: { l: 'Не оплачен', c: C.red, b: 'rgba(239,68,68,.14)' },
};
const SHIP = {
  shipped: { l: 'Отгружен', c: C.cyan, b: 'rgba(6,182,212,.12)' },
  unshipped: { l: 'Не отгружен', c: C.muted, b: 'rgba(90,104,130,.1)' },
};

// ─── Reusable components ──────────────────────────────────────────
const Badge = ({ s, map }) => {
  const d = map[s] || Object.values(map)[0];
  return <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 12, fontWeight: 700, background: d.b, color: d.c, whiteSpace: 'nowrap' }}>{d.l}</span>;
};
const BackBtn = ({ onBack }) => (
  <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.blue, fontSize: 28, padding: 0, lineHeight: 1, flexShrink: 0, width: 32 }}>‹</button>
);
const PBtn = ({ children, onClick, col = C.blue, style = {}, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{ padding: '12px 0', borderRadius: 14, background: disabled ? C.dim : `linear-gradient(135deg,${col},${col}bb)`, border: 'none', color: disabled ? C.muted : '#fff', fontSize: 13, fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer', width: '100%', ...style }}>{children}</button>
);
const SBtn = ({ children, onClick, style = {} }) => (
  <button onClick={onClick} style={{ padding: '11px 0', borderRadius: 12, background: C.card2, border: `1px solid ${C.border}`, color: C.muted, fontSize: 12, fontWeight: 600, cursor: 'pointer', width: '100%', ...style }}>{children}</button>
);
const Fi = ({ label, value, onChange, placeholder, type = 'text', readOnly, style = {} }) => (
  <div style={{ marginBottom: 11 }}>
    {label && <p style={{ color: C.muted, fontSize: 9, fontWeight: 700, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: .5 }}>{label}</p>}
    <input readOnly={readOnly} value={value || ''} onChange={e => onChange && onChange(e.target.value)} placeholder={placeholder} type={type} style={{ width: '100%', background: readOnly ? C.card : C.card2, border: `1px solid ${readOnly ? C.border : C.border2}`, borderRadius: 11, padding: '10px 13px', color: readOnly ? C.muted : C.text, fontSize: 12, outline: 'none', boxSizing: 'border-box', ...style }} />
  </div>
);
const Fd = ({ label, value }) => (
  <div style={{ marginBottom: 10 }}>
    <p style={{ color: C.muted, fontSize: 9, fontWeight: 700, margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: .5 }}>{label}</p>
    <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 10, padding: '9px 13px', color: value ? C.text : C.dim, fontSize: 12 }}>{value || '—'}</div>
  </div>
);
const Sec = ({ children, action, onAction }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '14px 0 7px' }}>
    <p style={{ color: C.muted, fontSize: 9, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: 1 }}>{children}</p>
    {action && <button onClick={onAction} style={{ background: 'none', border: 'none', color: C.blue, fontSize: 11, cursor: 'pointer', padding: 0 }}>{action}</button>}
  </div>
);
const DIcon = ({ type, sz = 34 }) => (
  <div style={{ width: sz, height: sz, borderRadius: sz * .28, flexShrink: 0, background: `${DocColor[type] || C.blue}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: sz * .42 }}>{DocIcon[type] || '📄'}</div>
);
const Toggle = ({ on, onToggle, col = C.green }) => (
  <div onClick={onToggle} style={{ width: 44, height: 24, borderRadius: 12, background: on ? col : C.dim, display: 'flex', alignItems: 'center', padding: '0 3px', cursor: 'pointer', flexShrink: 0, transition: 'background .2s' }}>
    <div style={{ width: 18, height: 18, borderRadius: 9, background: '#fff', transform: on ? 'translateX(20px)' : 'translateX(0)', transition: 'transform .2s' }} />
  </div>
);

// ─── NOVA COMP SVG Logo ───────────────────────────────────────────
const NovaLogo = ({ size = 38 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="22" fill="url(#ng)" />
    <defs>
      <linearGradient id="ng" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1d4ed8" />
        <stop offset="100%" stopColor="#0ea5e9" />
      </linearGradient>
    </defs>
    <path d="M20 26L20 74L33 74L33 50L55 74L68 74L68 26L55 26L55 50L33 26Z" fill="white" />
    <path d="M72 26L86 26L86 74L72 74" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── SPLASH / LOGIN ───────────────────────────────────────────────
function SplashScreen({ nav }) {
  const [tab, setTab] = useState('login');
  const [agreed, setAgreed] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [phone, setPhone] = useState('+7 705 474 1612');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);

  const doLogin = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); nav('home'); }, 1200);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: `radial-gradient(ellipse at 30% 20%, rgba(59,130,246,.18) 0%, ${C.bg} 65%)` }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px' }}>
        <div style={{ marginBottom: 16, padding: 14, background: 'rgba(59,130,246,.12)', borderRadius: 24, border: '1px solid rgba(59,130,246,.28)' }}>
          <NovaLogo size={60} />
        </div>
        <h1 style={{ color: C.text, fontSize: 28, fontWeight: 900, margin: '0 0 5px', textAlign: 'center', letterSpacing: -0.5 }}>BizBook KZ</h1>
        <p style={{ color: C.muted, fontSize: 12, margin: '0 0 14px', textAlign: 'center' }}>Умная бухгалтерия для бизнеса РК · НК 2026</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, justifyContent: 'center', marginBottom: 6 }}>
          {['🤖 ИИ-ассистент', '🔐 ЭЦП Mobile', '📊 ОУР+НДС', '🧾 ЭСФ/ЭАВР', '📅 Налог. календарь'].map((t, i) => (
            <span key={i} style={{ fontSize: 9, padding: '3px 8px', borderRadius: 10, background: 'rgba(59,130,246,.15)', color: C.blue, fontWeight: 600 }}>{t}</span>
          ))}
        </div>
        <p style={{ color: C.dim, fontSize: 9, textAlign: 'center' }}>© 2026 IgnisCantet.kz · Все права защищены</p>
      </div>

      <div style={{ background: C.card, borderRadius: '24px 24px 0 0', padding: '22px 22px 30px', border: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', gap: 5, marginBottom: 18, background: C.card2, borderRadius: 12, padding: 3 }}>
          {['login', 'register'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '9px', borderRadius: 10, border: 'none', background: tab === t ? C.blue : 'transparent', color: tab === t ? '#fff' : C.muted, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              {t === 'login' ? 'Войти' : 'Регистрация'}
            </button>
          ))}
        </div>

        {tab === 'login' ? (
          <>
            <Fi label="Телефон / Email / БИН" value={phone} onChange={setPhone} placeholder="+7 700 000 00 00" />
            <Fi label="Пароль" value={pass} onChange={setPass} type="password" placeholder="••••••••" />
            <div style={{ textAlign: 'right', marginBottom: 14 }}>
              <span style={{ color: C.blue, fontSize: 11, cursor: 'pointer' }}>Забыли пароль?</span>
            </div>
            <PBtn onClick={doLogin} col={C.blue}>{loading ? '⏳ Входим...' : 'Войти в аккаунт'}</PBtn>
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <SBtn onClick={doLogin} style={{ flex: 1, fontSize: 10 }}>📱 eGov Mobile</SBtn>
              <SBtn onClick={doLogin} style={{ flex: 1, fontSize: 10 }}>☁️ eGov Cloud</SBtn>
            </div>
          </>
        ) : (
          <>
            <Fi label="БИН (ИИН для ИП)" value="" onChange={() => { }} placeholder="241040014477" />
            <Fi label="Телефон" value="" onChange={() => { }} placeholder="+7 700 000 00 00" />
            <Fi label="Email" value="" onChange={() => { }} placeholder="info@company.kz" />
            <Fi label="Пароль" value="" onChange={() => { }} type="password" />
            <div onClick={() => setAgreed(!agreed)} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, cursor: 'pointer' }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, border: `1.5px solid ${agreed ? C.green : C.border}`, background: agreed ? C.green : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {agreed && <span style={{ color: '#fff', fontSize: 11 }}>✓</span>}
              </div>
              <p style={{ color: C.muted, fontSize: 10, margin: 0 }}>
                Принимаю{' '}
                <span onClick={e => { e.stopPropagation(); setShowOffer(true); }} style={{ color: C.blue, textDecoration: 'underline', cursor: 'pointer' }}>Договор публичной оферты</span>
                {' '}и Политику конфиденциальности
              </p>
            </div>
            <PBtn onClick={() => agreed && nav('onboard1')} col={agreed ? C.green : C.dim} disabled={!agreed}>
              Создать аккаунт →
            </PBtn>
          </>
        )}
      </div>

      {showOffer && <OfferModal onClose={() => setShowOffer(false)} onAccept={() => { setAgreed(true); setShowOffer(false); }} />}
    </div>
  );
}

// ─── OFFER MODAL ──────────────────────────────────────────────────
function OfferModal({ onClose, onAccept }) {
  const clauses = [
    ['1. Предмет договора', 'IgnisCantet.kz (далее — Исполнитель) предоставляет Пользователю доступ к платформе BizBook KZ для ведения бухгалтерского и налогового учёта на территории РК в соответствии с НК РК 2026 (Закон РК №6-I, Закон РК «О бухгалтерском учёте» №234-IV).'],
    ['2. Права и обязанности', 'Пользователь обязуется: использовать сервис в законных целях; предоставлять достоверные данные; не передавать доступ третьим лицам. Исполнитель обязуется: обеспечить бесперебойный доступ; сохранность данных; актуальность налоговых ставок согласно НК РК.'],
    ['3. Защита персональных данных', 'Персональные данные обрабатываются в соответствии с Законом РК «О персональных данных и их защите» №94-V. Данные хранятся на серверах в РК. Не передаются третьим лицам без согласия Пользователя.'],
    ['4. Интеллектуальная собственность', 'ВСЕ права на ПО, дизайн, алгоритмы, базы данных принадлежат IgnisCantet.kz. Запрещается: копирование, реверс-инжиниринг, распространение, модификация. Нарушение преследуется по Закону РК «Об авторском праве» №6-I и УК РК.'],
    ['5. Ответственность', 'Платформа предоставляется «как есть» (as-is). Рекомендуется верифицировать налоговые данные у дипломированного бухгалтера. Исполнитель не несёт ответственности за штрафы вследствие ошибочных данных, введённых Пользователем.'],
    ['6. Тарифы и оплата', 'Доступен бесплатный пробный период 14 дней. Коммерческое использование по тарифным планам. Оплата: Kaspi Pay, Halyk Bank, банковский перевод. НДС 16% включён в стоимость.'],
    ['7. Расторжение', 'Пользователь вправе расторгнуть договор в любое время, уведомив Исполнителя за 5 рабочих дней. Данные хранятся 90 дней после расторжения.'],
    ['8. Применимое право', 'Договор регулируется законодательством Республики Казахстан. Споры рассматриваются в судах г. Алматы.'],
  ];
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.88)', display: 'flex', alignItems: 'flex-end', zIndex: 300 }}>
      <div style={{ background: C.card, borderRadius: '22px 22px 0 0', width: '100%', maxHeight: '82vh', display: 'flex', flexDirection: 'column', padding: '18px 18px 26px' }}>
        <div style={{ width: 36, height: 4, background: '#444', borderRadius: 2, margin: '0 auto 16px' }} />
        <h3 style={{ color: C.text, fontSize: 15, fontWeight: 700, margin: '0 0 4px' }}>📑 Договор публичной оферты</h3>
        <p style={{ color: C.muted, fontSize: 10, margin: '0 0 12px' }}>BizBook KZ · IgnisCantet.kz · Версия 1.0 от 01.01.2026</p>
        <div style={{ overflowY: 'auto', flex: 1, marginBottom: 14 }}>
          {clauses.map(([t, c]) => (
            <div key={t} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${C.border}` }}>
              <p style={{ color: C.text, fontSize: 12, fontWeight: 700, margin: '0 0 5px' }}>{t}</p>
              <p style={{ color: C.muted, fontSize: 11, margin: 0, lineHeight: 1.6 }}>{c}</p>
            </div>
          ))}
          <p style={{ color: C.dim, fontSize: 9, textAlign: 'center', marginTop: 8 }}>© 2026 IgnisCantet.kz · Все права защищены · Авторские права охраняются Законом РК №6-I</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <SBtn onClick={onClose} style={{ flex: 1 }}>Закрыть</SBtn>
          <PBtn onClick={onAccept} col={C.green} style={{ flex: 2 }}>✓ Принимаю условия</PBtn>
        </div>
      </div>
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────
function OnboardScreen({ nav, step }) {
  const [orgType, setOrgType] = useState('too');
  const [taxRegime, setTaxRegime] = useState('our');
  const [nds, setNds] = useState(true);
  const [bank, setBank] = useState('Halyk Bank');
  const [showTutorial, setShowTutorial] = useState(false);

  const titles = ['', 'Тип организации', 'Реквизиты', 'Налоговый режим', 'Банк и касса', '🎉 Готово!'];

  const orgTypes = [
    ['🏢', 'ТОО', 'too', 'Товарищество с ограниченной ответственностью'],
    ['👤', 'ИП', 'ip', 'Индивидуальный предприниматель'],
    ['🏦', 'АО', 'ao', 'Акционерное общество'],
    ['🌾', 'КФХ', 'kfh', 'Крестьянское/фермерское хозяйство'],
    ['🏘️', 'КСК/ОСИ', 'ksk', 'КСК, ОСИ, ЖКХ организации'],
    ['🏛️', 'НКО', 'nko', 'Некоммерческая организация'],
    ['🙋', 'Самозанятый', 'self', 'Без ИП · режим самозанятого 2026'],
  ];

  const regimes = [
    ['📊', 'ОУР', 'our', 'КПН 20% · НДС 16% · полный учёт', C.blue, true],
    ['⚡', 'СНР (упрощёнка)', 'snr', '4% ИПН/КПН · до 2.595 млрд ₸/год', C.green, false],
    ['🔖', 'СНР (патент)', 'patent', 'Фиксированный налог · только ИП', C.orange, false],
    ['👤', 'Самозанятый', 'self', '4% соц. · без ИПН · до 300 МРП/мес', C.purple, false],
    ['🌾', 'КФХ', 'kfh', 'Специальный режим для аграриев', C.teal, false],
  ];

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 28 }}>
      <div style={{ padding: '14px 18px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <BackBtn onBack={() => nav(step === 1 ? 'splash' : `onboard${step - 1}`)} />
        <div>
          <h2 style={{ color: C.text, fontSize: 15, fontWeight: 700, margin: 0 }}>{titles[step]}</h2>
          <p style={{ color: C.muted, fontSize: 10, margin: 0 }}>Шаг {step} из 5</p>
        </div>
        {step === 1 && (
          <button onClick={() => setShowTutorial(true)} style={{ marginLeft: 'auto', background: `${C.gold}18`, border: `1px solid ${C.gold}30`, borderRadius: 10, padding: '5px 10px', color: C.gold, fontSize: 9, fontWeight: 700, cursor: 'pointer' }}>
            ❓ Помощь
          </button>
        )}
      </div>
      <div style={{ padding: '8px 18px 0', display: 'flex', gap: 3 }}>
        {[1, 2, 3, 4, 5].map(s => (
          <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: s <= step ? C.blue : C.card2 }} />
        ))}
      </div>

      <div style={{ padding: '14px 18px 0' }}>
        {step === 1 && (
          <>
            <p style={{ color: C.muted, fontSize: 11, margin: '0 0 12px' }}>Выберите правовую форму вашего бизнеса</p>
            {orgTypes.map(([ic, s, v, d]) => (
              <div key={v} onClick={() => setOrgType(v)} style={{ background: orgType === v ? `${C.blue}14` : C.card, border: `1.5px solid ${orgType === v ? C.blue : C.border}`, borderRadius: 14, padding: '12px', marginBottom: 7, cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ fontSize: 24 }}>{ic}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: orgType === v ? C.blue : C.text, fontSize: 13, fontWeight: 700, margin: '0 0 1px' }}>{s}</p>
                  <p style={{ color: C.muted, fontSize: 10, margin: 0 }}>{d}</p>
                </div>
                <div style={{ width: 18, height: 18, borderRadius: 9, border: `2px solid ${orgType === v ? C.blue : C.border}`, background: orgType === v ? C.blue : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {orgType === v && <span style={{ color: '#fff', fontSize: 10 }}>✓</span>}
                </div>
              </div>
            ))}
            <PBtn onClick={() => nav('onboard2')} style={{ marginTop: 8 }}>Далее →</PBtn>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ background: `${C.green}10`, border: `1px solid ${C.green}25`, borderRadius: 12, padding: '10px 13px', marginBottom: 12, display: 'flex', gap: 9, alignItems: 'center' }}>
              <span style={{ fontSize: 18 }}>✅</span>
              <p style={{ color: C.green, fontSize: 11, fontWeight: 600, margin: 0 }}>БИН найден в egov.kz · данные загружены автоматически</p>
            </div>
            {[['БИН', CO.bin], ['Название', CO.name], ['Правовая форма', 'ТОО'], ['Дата регистрации', CO.reg], ['Директор', CO.director], ['Юр. адрес', CO.address], ['Телефон', CO.phone], ['Email', CO.email]].map(([l, v]) => <Fd key={l} label={l} value={v} />)}
            <PBtn onClick={() => nav('onboard3')}>Далее →</PBtn>
          </>
        )}

        {step === 3 && (
          <>
            <p style={{ color: C.muted, fontSize: 11, margin: '0 0 12px' }}>Выберите налоговый режим — настроим все формы автоматически</p>
            {regimes.map(([ic, s, v, d, col, hot]) => (
              <div key={v} onClick={() => setTaxRegime(v)} style={{ background: taxRegime === v ? `${col}12` : C.card, border: `1.5px solid ${taxRegime === v ? col : C.border}`, borderRadius: 14, padding: '12px', marginBottom: 7, cursor: 'pointer' }}>
                <div style={{ display: 'flex', gap: 11, alignItems: 'center' }}>
                  <span style={{ fontSize: 24 }}>{ic}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <p style={{ color: taxRegime === v ? col : C.text, fontSize: 13, fontWeight: 700, margin: '0 0 2px' }}>{s}</p>
                      {hot && <span style={{ fontSize: 8, padding: '1px 6px', borderRadius: 8, background: `${col}22`, color: col, fontWeight: 700 }}>NOVA COMP</span>}
                    </div>
                    <p style={{ color: C.muted, fontSize: 10, margin: 0 }}>{d}</p>
                  </div>
                  <div style={{ width: 18, height: 18, borderRadius: 9, border: `2px solid ${taxRegime === v ? col : C.border}`, background: taxRegime === v ? col : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {taxRegime === v && <span style={{ color: '#fff', fontSize: 10 }}>✓</span>}
                  </div>
                </div>
              </div>
            ))}
            <div style={{ background: `${C.orange}10`, border: `1px solid ${C.orange}22`, borderRadius: 12, padding: '10px 13px', marginBottom: 10 }}>
              <p style={{ color: C.orange, fontSize: 11, fontWeight: 700, margin: '0 0 8px' }}>Плательщик НДС?</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ color: C.muted, fontSize: 10, margin: 0 }}>Порог: 43 250 000 ₸ (10 000 МРП 2026)</p>
                <Toggle on={nds} onToggle={() => setNds(!nds)} col={C.orange} />
              </div>
              {nds && <p style={{ color: C.orange, fontSize: 9, margin: '5px 0 0' }}>⚠️ Обязательна выписка ЭСФ по всем сделкам</p>}
            </div>
            <PBtn onClick={() => nav('onboard4')}>Далее →</PBtn>
          </>
        )}

        {step === 4 && (
          <>
            <p style={{ color: C.muted, fontSize: 11, margin: '0 0 10px' }}>Реквизиты для счетов и документов</p>
            <Sec>Выберите банк</Sec>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {['Halyk Bank', 'Kaspi Bank', 'Jusan Bank', 'ForteBank', 'BCC', 'Евразийский', 'Отбасы Банк'].map(b => (
                <button key={b} onClick={() => setBank(b)} style={{ padding: '6px 11px', borderRadius: 10, border: `1.5px solid ${bank === b ? C.blue : C.border}`, background: bank === b ? `${C.blue}14` : 'transparent', color: bank === b ? C.blue : C.muted, fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>{b}</button>
              ))}
            </div>
            {[['БИК', CO.bik], ['ИИК', CO.iik], ['КБе', CO.kbe]].map(([l, v]) => <Fd key={l} label={l} value={v} />)}
            <div style={{ background: `${C.green}10`, border: `1px solid ${C.green}22`, borderRadius: 11, padding: '10px 13px', marginBottom: 10 }}>
              <p style={{ color: C.green, fontSize: 11, fontWeight: 600, margin: '0 0 2px' }}>💡 Можно добавить несколько счетов</p>
              <p style={{ color: C.muted, fontSize: 10, margin: 0 }}>Расчётный · Валютный · Kaspi · Kaspi Gold</p>
            </div>
            <PBtn onClick={() => nav('onboard5')} col={C.green}>Далее →</PBtn>
          </>
        )}

        {step === 5 && (
          <>
            <div style={{ textAlign: 'center', padding: '16px 0 18px' }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
              <h2 style={{ color: C.text, fontSize: 21, fontWeight: 800, margin: '0 0 7px' }}>Всё готово!</h2>
              <p style={{ color: C.muted, fontSize: 12, margin: '0 0 18px', lineHeight: 1.6 }}>{CO.name} настроена и готова к работе</p>
            </div>
            {[
              ['✅', 'Реквизиты загружены из egov.kz'],
              ['✅', 'Налоговый режим ОУР · КПН 20% · НДС 16%'],
              ['✅', 'ЭЦП: eGov Mobile + eGov Cloud настроены'],
              ['✅', 'ИИ-ассистент активирован (НК РК 2026)'],
              ['✅', 'Налоговый календарь запущен'],
              ['✅', 'Синхронизация с Halyk Bank подключена'],
              ['✅', 'Интеграции: КНП, ЭСФ, eGov, Казстат'],
            ].map(([ic, t], i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', background: C.card, borderRadius: 10, padding: '9px 13px', marginBottom: 6, border: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 14 }}>{ic}</span>
                <p style={{ color: C.text, fontSize: 12, margin: 0 }}>{t}</p>
              </div>
            ))}
            <PBtn onClick={() => nav('home')} style={{ marginTop: 14 }}>🚀 Начать работу!</PBtn>
          </>
        )}
      </div>

      {showTutorial && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.88)', display: 'flex', alignItems: 'flex-end', zIndex: 200 }}>
          <div style={{ background: C.card, borderRadius: '22px 22px 0 0', width: '100%', padding: '18px 18px 26px' }}>
            <div style={{ width: 36, height: 4, background: '#444', borderRadius: 2, margin: '0 auto 16px' }} />
            <h3 style={{ color: C.text, fontSize: 15, fontWeight: 700, margin: '0 0 14px' }}>📚 Обучение за 5 минут</h3>
            {[['🧾', 'ЭСФ', 'Электронная счёт-фактура — обязательна для плательщиков НДС'],
              ['📋', 'ЭАВР / АВР', 'Акт выполненных работ — закрывающий документ по услугам'],
              ['📊', 'ФНО 200/300', 'Налоговые формы, сдаются ежеквартально в КНП'],
              ['🔐', 'ЭЦП', 'Электронная цифровая подпись — подписание через eGov Mobile'],
              ['💳', 'ОПВ/ОПВР', 'Пенсионные взносы: 10% удерж. + 3.5% от работодателя']].map(([ic, t, d]) => (
                <div key={t} style={{ display: 'flex', gap: 11, marginBottom: 12 }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{ic}</span>
                  <div><p style={{ color: C.text, fontSize: 12, fontWeight: 700, margin: '0 0 2px' }}>{t}</p><p style={{ color: C.muted, fontSize: 10, margin: 0 }}>{d}</p></div>
                </div>
              ))}
            <SBtn onClick={() => setShowTutorial(false)}>Понятно, продолжить</SBtn>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────
function HomeScreen({ nav, setSelDoc }) {
  const income = DOCS_DATA.filter(d => d.dir === 'out' && d.payStatus === 'paid').reduce((s, d) => s + d.amount, 0);
  const expenses = BANK_OPS.filter(o => o.type === 'out').reduce((s, o) => s + Math.abs(o.amount), 0);
  const urgentTax = TAXES_DATA.filter(t => t.status === 'urgent').reduce((s, t) => s + (t.amount || 0), 0);
  const pending = DOCS_DATA.filter(d => d.payStatus === 'unpaid' && d.dir === 'out').reduce((s, d) => s + d.amount, 0);

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: '13px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ padding: '5px 7px', background: 'rgba(59,130,246,.14)', borderRadius: 11, border: '1px solid rgba(59,130,246,.24)' }}>
            <NovaLogo size={20} />
          </div>
          <div>
            <p style={{ color: C.muted, fontSize: 9, margin: 0 }}>ОУР · НДС · Алматы</p>
            <p style={{ color: C.text, fontSize: 12, fontWeight: 700, margin: 0 }}>NOVA COMP</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          <button onClick={() => nav('news')} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 9, padding: '6px 10px', color: C.orange, fontSize: 14, cursor: 'pointer' }}>📰</button>
          <button onClick={() => nav('ai')} style={{ background: `${C.purple}18`, border: `1px solid ${C.purple}28`, borderRadius: 9, padding: '6px 10px', color: C.purple, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>🤖</button>
          <button onClick={() => nav('profile')} style={{ width: 33, height: 33, borderRadius: 16, background: `linear-gradient(135deg,${C.blue},${C.cyan})`, border: 'none', fontSize: 14, cursor: 'pointer' }}>👤</button>
        </div>
      </div>

      {/* Finance card */}
      <div style={{ padding: '10px 16px 0' }}>
        <div style={{ background: 'linear-gradient(135deg,#0e2248,#1a3a6e)', borderRadius: 20, padding: '16px', border: '1px solid rgba(59,130,246,.22)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -20, top: -20, width: 90, height: 90, borderRadius: '50%', background: 'rgba(59,130,246,.08)' }} />
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 9, margin: 0, textTransform: 'uppercase', letterSpacing: 1 }}>Выручка · май 2026 (оплаченная)</p>
          <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 800, margin: '4px 0 12px' }}>{fmt(income)}</h1>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
            {[['Расходы', fmt(expenses), C.red], ['Дебиторка', fmt(pending), C.orange], ['Прибыль ≈', fmt(income - expenses), C.green]].map(([l, v, c], i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,.07)', borderRadius: 10, padding: '7px 8px' }}>
                <p style={{ color: 'rgba(255,255,255,.45)', fontSize: 8, margin: '0 0 2px', lineHeight: 1.2 }}>{l}</p>
                <p style={{ color: c, fontSize: 10, fontWeight: 700, margin: 0 }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Urgent alert */}
      <div style={{ padding: '8px 16px 0' }}>
        <div onClick={() => nav('taxes')} style={{ background: `${C.red}0e`, border: `1px solid ${C.red}28`, borderRadius: 14, padding: '11px 13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div style={{ flex: 1 }}>
            <p style={{ color: C.red, fontSize: 11, fontWeight: 700, margin: '0 0 1px' }}>Срочно до 15 мая · 3 налоговые формы</p>
            <p style={{ color: C.muted, fontSize: 10, margin: 0 }}>ФНО 200+300 · К уплате: {fmt(urgentTax)}</p>
          </div>
          <span style={{ color: C.red, fontSize: 18 }}>›</span>
        </div>
      </div>

      {/* Quick create */}
      <div style={{ padding: '10px 16px 0' }}>
        <Sec>Создать документ</Sec>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {[['🧾', 'ЭСФ', C.orange], ['📋', 'ЭАВР', C.cyan], ['📄', 'Счёт', C.blue], ['📜', 'Доверен.', C.purple], ['📦', 'Накладная', C.muted], ['📥', 'Входящий', C.green]].map(([ic, l, c], i) => (
            <button key={i} onClick={() => nav('newDoc')} style={{ background: `${c}12`, border: `1px solid ${c}20`, borderRadius: 13, padding: '11px 5px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 20 }}>{ic}</span>
              <span style={{ color: c, fontSize: 10, fontWeight: 700 }}>{l}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Analytics mini */}
      <div style={{ padding: '10px 16px 0' }}>
        <Sec action="Аналитика →" onAction={() => nav('analytics')}>Финансы · май 2026</Sec>
        <div style={{ background: C.card, borderRadius: 14, padding: '12px', border: `1px solid ${C.border}` }}>
          {[['Доходы', income, C.green, 100], ['Расходы', expenses, C.red, Math.round(expenses / income * 100)], ['Налоги', urgentTax, C.orange, Math.round(urgentTax / income * 100)]].map(([l, v, c, pct]) => (
            <div key={l} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ color: C.muted, fontSize: 11 }}>{l}</span>
                <span style={{ color: c, fontSize: 11, fontWeight: 700 }}>{fmt(v)}</span>
              </div>
              <div style={{ height: 4, background: C.dim, borderRadius: 2 }}>
                <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: c, borderRadius: 2, transition: 'width .8s' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent docs */}
      <div style={{ padding: '8px 16px 0' }}>
        <Sec action="Все →" onAction={() => nav('docs')}>Последние документы</Sec>
        {DOCS_DATA.slice(0, 3).map(doc => (
          <div key={doc.id} onClick={() => { setSelDoc(doc); nav('docDetail'); }} style={{ background: C.card, borderRadius: 12, padding: '9px 11px', marginBottom: 6, display: 'flex', gap: 9, cursor: 'pointer', border: `1px solid ${C.border}` }}>
            <DIcon type={doc.type} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: C.text, fontSize: 11, fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.cp}</p>
              <p style={{ color: C.dim, fontSize: 9, margin: '2px 0 0' }}>{doc.date} · {doc.type}</p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              {doc.amount > 0 && <p style={{ color: C.text, fontSize: 11, fontWeight: 700, margin: '0 0 3px' }}>{fmt(doc.amount)}</p>}
              <Badge s={doc.payStatus} map={PAY} />
            </div>
          </div>
        ))}
      </div>

      {/* Tax calendar strip */}
      <div style={{ padding: '8px 16px 14px' }}>
        <Sec action="Календарь →" onAction={() => nav('calendar')}>Налоговый календарь</Sec>
        {TAX_CALENDAR.slice(0, 2).map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 9, background: C.card, borderRadius: 12, padding: '9px 11px', marginBottom: 6, border: `1px solid ${item.urgent ? C.red + '30' : C.border}` }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: item.urgent ? `${C.red}14` : C.card2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: item.urgent ? C.red : C.muted, fontSize: 9, fontWeight: 800, textAlign: 'center', lineHeight: 1.2 }}>{item.date}</span>
            </div>
            <div style={{ flex: 1 }}>{item.items.slice(0, 2).map((it, j) => <p key={j} style={{ color: C.text, fontSize: 10, margin: '0 0 1px' }}>{it}</p>)}</div>
            {item.amount && <p style={{ color: item.urgent ? C.red : C.muted, fontSize: 11, fontWeight: 700, margin: 0, alignSelf: 'center', flexShrink: 0 }}>{fmt(item.amount)}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DOCUMENTS ────────────────────────────────────────────────────
function DocsScreen({ nav, setSelDoc }) {
  const [filt, setFilt] = useState('все');
  const [dir, setDir] = useState('все');
  const [search, setSearch] = useState('');
  const filtered = DOCS_DATA.filter(d =>
    (filt === 'все' || d.type === filt) &&
    (dir === 'все' || d.dir === dir) &&
    (search === '' || d.cp.toLowerCase().includes(search.toLowerCase()) || d.service.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
      <div style={{ padding: '14px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: C.text, fontSize: 17, fontWeight: 700, margin: 0 }}>Документы</h2>
        <button onClick={() => nav('newDoc')} style={{ background: C.blue, border: 'none', borderRadius: 16, padding: '5px 14px', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>+ Создать</button>
      </div>

      <div style={{ padding: '8px 16px 0' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Поиск документов..." style={{ width: '100%', background: C.card, border: `1px solid ${C.border}`, borderRadius: 11, padding: '9px 13px', color: C.text, fontSize: 11, outline: 'none', boxSizing: 'border-box' }} />
      </div>

      <div style={{ padding: '6px 16px 0', display: 'flex', gap: 4 }}>
        {['все', '📤', '📥'].map((f, i) => (
          <button key={i} onClick={() => setDir(['все', 'out', 'in'][i])} style={{ padding: '5px 11px', borderRadius: 14, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, background: dir === ['все', 'out', 'in'][i] ? C.blue : C.card, color: dir === ['все', 'out', 'in'][i] ? '#fff' : C.muted }}>
            {f === 'все' ? 'Все' : f === '📤' ? '📤 Исходящие' : '📥 Входящие'}
          </button>
        ))}
      </div>

      <div style={{ padding: '5px 16px 0', display: 'flex', gap: 4, overflowX: 'auto' }}>
        {['все', 'ЭСФ', 'ЭАВР', 'АВР', 'счёт', 'акт', 'доверенность', 'накладная', 'СФ'].map(f => (
          <button key={f} onClick={() => setFilt(f)} style={{ padding: '3px 9px', borderRadius: 10, border: `1px solid ${filt === f ? C.blue : C.border}`, cursor: 'pointer', fontSize: 9, fontWeight: 600, whiteSpace: 'nowrap', background: filt === f ? `${C.blue}18` : 'transparent', color: filt === f ? C.blue : C.muted, flexShrink: 0 }}>{f}</button>
        ))}
      </div>

      <div style={{ padding: '8px 16px 0' }}>
        {filtered.map(doc => (
          <div key={doc.id} onClick={() => { setSelDoc(doc); nav('docDetail'); }} style={{ background: C.card, borderRadius: 13, padding: '10px 12px', marginBottom: 7, cursor: 'pointer', border: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
              <DIcon type={doc.type} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: C.text, fontSize: 11, fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.cp}</p>
                <p style={{ color: C.dim, fontSize: 9, margin: '2px 0 0' }}>{doc.service}</p>
              </div>
              {doc.amount > 0 && <p style={{ color: C.text, fontSize: 11, fontWeight: 700, margin: 0, flexShrink: 0 }}>{fmt(doc.amount)}</p>}
            </div>
            <div style={{ marginTop: 7, paddingTop: 6, borderTop: `1px solid ${C.border}`, display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 8, padding: '1px 6px', borderRadius: 8, background: doc.dir === 'out' ? `${C.blue}14` : `${C.green}14`, color: doc.dir === 'out' ? C.blue : C.green, fontWeight: 600 }}>{doc.dir === 'out' ? '📤' : '📥'}</span>
              <span style={{ color: C.dim, fontSize: 9 }}>{doc.date}</span>
              <Badge s={doc.payStatus} map={PAY} />
              <Badge s={doc.shipStatus} map={SHIP} />
              {doc.ndsAmt > 0 && <span style={{ fontSize: 8, padding: '1px 6px', borderRadius: 8, background: `${C.orange}14`, color: C.orange, fontWeight: 600 }}>НДС</span>}
              {doc.signed && <span style={{ fontSize: 8, padding: '1px 6px', borderRadius: 8, background: `${C.green}14`, color: C.green, fontWeight: 600 }}>🔐 ЭЦП</span>}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p style={{ color: C.muted, textAlign: 'center', padding: '28px 0', fontSize: 12 }}>Документы не найдены</p>}
      </div>
    </div>
  );
}

// ─── DOC DETAIL ───────────────────────────────────────────────────
function DocDetail({ doc, onBack, docs = [] }) {
  const [showSign, setShowSign] = useState(false);
  if (!doc) return null;
  const linked = doc.linked ? docs.find(d => d.id === doc.linked) : null;
  const ndsBase = doc.amount - doc.ndsAmt;

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 28, position: 'relative' }}>
      <div style={{ padding: '14px 16px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <BackBtn onBack={onBack} />
        <h2 style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: 0 }}>{DocIcon[doc.type]} {doc.type} №{doc.no}</h2>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, flexShrink: 0 }}>
          <Badge s={doc.payStatus} map={PAY} />
        </div>
      </div>

      <div style={{ padding: '10px 16px 0' }}>
        {/* Full document preview */}
        <div style={{ background: C.card, borderRadius: 16, padding: '15px', border: `1.5px solid ${DocColor[doc.type] || C.blue}30`, marginBottom: 10 }}>
          {/* Doc header */}
          <div style={{ borderBottom: `2px solid ${DocColor[doc.type] || C.blue}`, paddingBottom: 10, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ color: DocColor[doc.type] || C.blue, fontSize: 11, fontWeight: 800, margin: '0 0 2px', textTransform: 'uppercase' }}>{doc.type} №{doc.no}</p>
                <p style={{ color: C.muted, fontSize: 9, margin: 0 }}>от {doc.date} г. · {doc.dir === 'out' ? 'Исходящий' : 'Входящий'}</p>
              </div>
              <NovaLogo size={26} />
            </div>
          </div>

          {/* Supplier / Buyer */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 10px', marginBottom: 10 }}>
            {[['Поставщик', CO.name], ['БИН поставщика', CO.bin], ['Банк / БИК', `${CO.bank} · ${CO.bik}`], ['ИИК', CO.iik]].map(([l, v]) => (
              <div key={l}><p style={{ color: C.muted, fontSize: 8, margin: '0 0 1px', textTransform: 'uppercase' }}>{l}</p><p style={{ color: C.text, fontSize: 9, fontWeight: 600, margin: 0 }}>{v}</p></div>
            ))}
          </div>

          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 8, marginBottom: 10 }}>
            <p style={{ color: C.muted, fontSize: 8, margin: '0 0 1px', textTransform: 'uppercase' }}>Покупатель / Заказчик</p>
            <p style={{ color: C.text, fontSize: 12, fontWeight: 700, margin: '0 0 1px' }}>{doc.cp}</p>
            <p style={{ color: C.muted, fontSize: 9, margin: 0 }}>БИН: {doc.cpBin}</p>
          </div>

          {/* Items */}
          <div style={{ background: C.card2, borderRadius: 10, padding: '10px', marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ color: C.muted, fontSize: 10 }}>Наименование</span>
              <span style={{ color: C.text, fontSize: 10, maxWidth: '55%', textAlign: 'right' }}>{doc.service}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ color: C.muted, fontSize: 10 }}>Кол-во / ед.</span>
              <span style={{ color: C.text, fontSize: 10 }}>1 / услуга</span>
            </div>
            {doc.ndsAmt > 0 && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ color: C.muted, fontSize: 10 }}>Сумма без НДС</span>
                  <span style={{ color: C.text, fontSize: 10 }}>{fmt(ndsBase)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ color: C.muted, fontSize: 10 }}>НДС 16%</span>
                  <span style={{ color: C.orange, fontSize: 10 }}>{fmt(doc.ndsAmt)}</span>
                </div>
              </>
            )}
            {doc.amount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 6, borderTop: `1px solid ${C.border}` }}>
                <span style={{ color: C.text, fontSize: 12, fontWeight: 700 }}>ИТОГО</span>
                <span style={{ color: C.text, fontSize: 14, fontWeight: 800 }}>{fmt(doc.amount)}</span>
              </div>
            )}
          </div>

          {/* Status badges */}
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
            <Badge s={doc.payStatus} map={PAY} />
            <Badge s={doc.shipStatus} map={SHIP} />
          </div>

          {/* Sign status */}
          {doc.signed ? (
            <div style={{ background: `${C.green}10`, border: `1px solid ${C.green}24`, borderRadius: 10, padding: '8px 11px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>🔐</span>
              <div><p style={{ color: C.green, fontSize: 10, fontWeight: 700, margin: '0 0 1px' }}>Подписан ЭЦП</p><p style={{ color: C.muted, fontSize: 9, margin: 0 }}>{CO.director} · {doc.date}</p></div>
            </div>
          ) : (
            <div style={{ background: `${C.orange}10`, border: `1px solid ${C.orange}24`, borderRadius: 10, padding: '8px 11px' }}>
              <p style={{ color: C.orange, fontSize: 10, fontWeight: 700, margin: '0 0 1px' }}>⚠️ Требуется подпись ЭЦП</p>
              <p style={{ color: C.muted, fontSize: 9, margin: 0 }}>eGov Mobile / eGov Cloud / NCA Layer (ПК)</p>
            </div>
          )}

          {linked && (
            <div style={{ marginTop: 8, padding: '8px 11px', background: C.card2, borderRadius: 10 }}>
              <p style={{ color: C.muted, fontSize: 9, margin: '0 0 2px' }}>Связан с:</p>
              <p style={{ color: C.blue, fontSize: 10, fontWeight: 600, margin: 0 }}>{DocIcon[linked.type]} {linked.type} №{linked.no}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 8 }}>
          {[['👁', 'PDF'], ['📤', 'Отправить'], ['✏️', 'Изменить']].map(([ic, l], i) => (
            <button key={i} style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 11, padding: '9px 5px', cursor: 'pointer', color: C.text, fontSize: 9, fontWeight: 600 }}>{ic}<br />{l}</button>
          ))}
        </div>

        {!doc.signed && <PBtn onClick={() => setShowSign(true)} col={C.green} style={{ marginBottom: 8 }}>🔐 Подписать ЭЦП</PBtn>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <button style={{ background: `${C.red}0e`, border: `1px solid ${C.red}20`, borderRadius: 11, padding: '10px', cursor: 'pointer', color: C.red, fontSize: 11, fontWeight: 600 }}>🗑 Удалить</button>
          <button style={{ background: `${C.blue}0e`, border: `1px solid ${C.blue}20`, borderRadius: 11, padding: '10px', cursor: 'pointer', color: C.blue, fontSize: 11, fontWeight: 600 }}>📋 Копировать</button>
        </div>
      </div>

      {/* Sign modal */}
      {showSign && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.88)', display: 'flex', alignItems: 'flex-end', zIndex: 50, borderRadius: 44 }}>
          <div style={{ background: C.card, borderRadius: '22px 22px 0 0', width: '100%', padding: '18px 18px 26px' }}>
            <div style={{ width: 36, height: 4, background: '#444', borderRadius: 2, margin: '0 auto 16px' }} />
            <h3 style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: '0 0 5px' }}>🔐 Подписание ЭЦП</h3>
            <p style={{ color: C.muted, fontSize: 10, margin: '0 0 14px' }}>Электронная цифровая подпись · НК РК 2026</p>
            {[
              ['📱', 'eGov Mobile', 'QR-код или push-уведомление · без носителя', 'Рекомендовано', C.green],
              ['☁️', 'eGov Cloud', 'ЭЦП в облаке · вход по логину/паролю', 'Для смартфона', C.blue],
              ['💻', 'NCA Layer (только ПК)', 'USB-токен · установка на компьютер', 'Только десктоп', C.orange],
            ].map(([ic, t, d, note, c], i) => (
              <div key={i} onClick={() => setShowSign(false)} style={{ background: C.card2, borderRadius: 12, padding: '11px 13px', marginBottom: 7, cursor: 'pointer', display: 'flex', gap: 11, alignItems: 'center' }}>
                <span style={{ fontSize: 22 }}>{ic}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: C.text, fontSize: 12, fontWeight: 600, margin: '0 0 1px' }}>{t}</p>
                  <p style={{ color: C.muted, fontSize: 10, margin: '0 0 3px' }}>{d}</p>
                  <span style={{ fontSize: 8, padding: '1px 7px', borderRadius: 8, background: `${c}18`, color: c, fontWeight: 600 }}>{note}</span>
                </div>
              </div>
            ))}
            <SBtn onClick={() => setShowSign(false)} style={{ marginTop: 6 }}>Отмена</SBtn>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── NEW DOC ──────────────────────────────────────────────────────
function NewDocScreen({ onBack, onDone }) {
  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState('ЭСФ');
  const [cp, setCp] = useState(null);
  const [service, setService] = useState('');
  const [amount, setAmount] = useState('');
  const [qty, setQty] = useState('1');
  const [withNds, setWithNds] = useState(true);
  const [showCp, setShowCp] = useState(false);
  const total = (parseFloat(amount) || 0) * (parseFloat(qty) || 1);
  const nds = withNds ? Math.round(total * 16 / 116) : 0;

  const docTypes = [
    ['🧾', 'ЭСФ', C.orange, 'Электронная счёт-фактура · обязательна при НДС'],
    ['📋', 'ЭАВР', C.cyan, 'Электронный акт выполненных работ'],
    ['✅', 'АВР', C.green, 'Акт выполненных работ (стандартный)'],
    ['📄', 'счёт', C.blue, 'Счёт на оплату товаров/услуг'],
    ['📜', 'доверенность', C.purple, 'М-2, генеральная, на представление интересов'],
    ['📦', 'накладная', C.muted, 'Товарная накладная (ТОРН)'],
    ['🗂', 'СФ', C.orange, 'Счёт-фактура (на бумаге)'],
    ['📑', 'договор', C.pink, 'Договор возмездного оказания услуг'],
  ];

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 28, position: 'relative' }}>
      <div style={{ padding: '14px 16px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <BackBtn onBack={onBack} />
        <div><h2 style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: 0 }}>Новый документ</h2><p style={{ color: C.muted, fontSize: 9, margin: 0 }}>Шаг {step} из 3</p></div>
      </div>
      <div style={{ padding: '7px 16px 0', display: 'flex', gap: 3 }}>
        {[1, 2, 3].map(s => <div key={s} style={{ flex: 1, height: 2.5, borderRadius: 2, background: s <= step ? C.blue : C.card2 }} />)}
      </div>

      <div style={{ padding: '12px 16px 0' }}>
        {step === 1 && (
          <>
            <p style={{ color: C.muted, fontSize: 10, margin: '0 0 10px' }}>Тип документа и контрагент</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
              {docTypes.map(([ic, t, c, d]) => (
                <button key={t} onClick={() => setDocType(t)} style={{ padding: '6px 11px', borderRadius: 10, border: `1.5px solid ${docType === t ? c : C.border}`, background: docType === t ? `${c}15` : 'transparent', color: docType === t ? c : C.muted, fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>{ic} {t}</button>
              ))}
            </div>
            <div style={{ background: C.card2, borderRadius: 10, padding: '8px 12px', marginBottom: 10 }}>
              <p style={{ color: C.muted, fontSize: 10, margin: 0 }}>{docTypes.find(d => d[1] === docType)?.[3] || ''}</p>
            </div>
            <button onClick={() => setShowCp(true)} style={{ width: '100%', padding: '10px 13px', borderRadius: 12, marginBottom: 8, background: cp ? `${C.blue}12` : C.card2, border: `1.5px solid ${cp ? C.blue : C.border}`, color: cp ? C.text : C.muted, fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
              <span>{cp ? `👤 ${cp.name}` : '📋 Выбрать контрагента'}</span>
              <span style={{ color: C.blue }}>›</span>
            </button>
            {cp && <div style={{ background: C.card, borderRadius: 10, padding: '9px 13px', marginBottom: 10, border: `1px solid ${C.border}` }}>
              <p style={{ color: C.text, fontSize: 11, fontWeight: 600, margin: '0 0 2px' }}>{cp.name}</p>
              <p style={{ color: C.muted, fontSize: 9, margin: 0 }}>БИН: {cp.bin} · {cp.nds ? 'Плательщик НДС' : 'Без НДС'}</p>
            </div>}
            <PBtn onClick={() => setStep(2)} col={C.blue}>Далее →</PBtn>
          </>
        )}

        {step === 2 && (
          <>
            <Fi label="Наименование товара/услуги *" value={service} onChange={setService} placeholder="Разработка веб-сайта" />
            {docType !== 'доверенность' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 8 }}>
                  <Fi label="Цена (₸)" value={amount} onChange={setAmount} placeholder="1 000 000" />
                  <Fi label="Кол-во" value={qty} onChange={setQty} placeholder="1" />
                </div>
                <div onClick={() => setWithNds(!withNds)} style={{ background: withNds ? `${C.orange}10` : C.card2, border: `1.5px solid ${withNds ? C.orange : C.border}`, borderRadius: 12, padding: '10px 13px', marginBottom: 10, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div><p style={{ color: C.text, fontSize: 12, fontWeight: 600, margin: '0 0 1px' }}>НДС 16%</p><p style={{ color: C.muted, fontSize: 9, margin: 0 }}>Обязательно для плательщиков НДС</p></div>
                  <Toggle on={withNds} onToggle={() => setWithNds(!withNds)} col={C.orange} />
                </div>
                {total > 0 && (
                  <div style={{ background: `${C.blue}10`, borderRadius: 13, padding: '12px', marginBottom: 10, border: `1px solid ${C.blue}20` }}>
                    {withNds && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><span style={{ color: C.muted, fontSize: 11 }}>Без НДС:</span><span style={{ color: C.text, fontSize: 11, fontWeight: 600 }}>{fmt(total - nds)}</span></div>}
                    {withNds && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span style={{ color: C.muted, fontSize: 11 }}>НДС 16%:</span><span style={{ color: C.orange, fontSize: 11, fontWeight: 600 }}>{fmt(nds)}</span></div>}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>ИТОГО:</span><span style={{ color: C.blue, fontSize: 18, fontWeight: 800 }}>{fmt(total)}</span></div>
                  </div>
                )}
              </>
            )}
            <Fi label="Примечание" value="" onChange={() => { }} placeholder="Согласно договору №..." />
            <div style={{ display: 'flex', gap: 7 }}>
              <SBtn onClick={() => setStep(1)} style={{ flex: 1 }}>← Назад</SBtn>
              <PBtn onClick={() => service && setStep(3)} col={service ? C.blue : C.dim} style={{ flex: 2 }} disabled={!service}>Далее →</PBtn>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <p style={{ color: C.muted, fontSize: 10, margin: '0 0 10px' }}>Предпросмотр и подписание</p>
            <div style={{ background: C.card, borderRadius: 14, padding: '13px', border: `1px solid ${DocColor[docType] || C.blue}28`, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${C.border}`, paddingBottom: 8, marginBottom: 8 }}>
                <div><p style={{ color: DocColor[docType] || C.blue, fontSize: 10, fontWeight: 800, margin: '0 0 1px', textTransform: 'uppercase' }}>{docType}</p><p style={{ color: C.muted, fontSize: 9, margin: 0 }}>{new Date().toLocaleDateString('ru-KZ')}</p></div>
                <NovaLogo size={22} />
              </div>
              {[['Поставщик', CO.name], ['Покупатель', cp?.name || '—'], ['Услуга', service || '—'], total > 0 && ['Сумма', fmt(total)], nds > 0 && ['НДС', fmt(nds)]].filter(Boolean).map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><span style={{ color: C.muted, fontSize: 10 }}>{l}</span><span style={{ color: C.text, fontSize: 10, fontWeight: 600, maxWidth: '55%', textAlign: 'right' }}>{v}</span></div>
              ))}
            </div>
            <div style={{ background: `${C.orange}10`, border: `1px solid ${C.orange}20`, borderRadius: 12, padding: '10px 13px', marginBottom: 10 }}>
              <p style={{ color: C.orange, fontSize: 11, fontWeight: 700, margin: '0 0 2px' }}>🔐 Требуется подпись ЭЦП</p>
              <p style={{ color: C.muted, fontSize: 10, margin: 0 }}>После сохранения подпишите через eGov Mobile</p>
            </div>
            <div style={{ display: 'flex', gap: 7, marginBottom: 8 }}>
              <SBtn onClick={() => setStep(2)} style={{ flex: 1 }}>← Назад</SBtn>
              <PBtn onClick={onDone} style={{ flex: 2 }}>📤 Сохранить</PBtn>
            </div>
            <SBtn onClick={onDone}>💾 Черновик</SBtn>
          </>
        )}
      </div>

      {/* Counterparty picker */}
      {showCp && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.88)', display: 'flex', alignItems: 'flex-end', zIndex: 100, borderRadius: 44 }}>
          <div style={{ background: C.card, borderRadius: '22px 22px 0 0', width: '100%', padding: '16px 16px 24px', maxHeight: '65%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: 36, height: 4, background: '#444', borderRadius: 2, margin: '0 auto 14px' }} />
            <p style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: '0 0 11px' }}>Выбрать контрагента</p>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {COUNTERPARTIES.map(c => (
                <div key={c.id} onClick={() => { setCp(c); setShowCp(false); }} style={{ background: C.card2, borderRadius: 12, padding: '11px 13px', marginBottom: 7, cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 17, background: `${C.blue}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: C.text, fontSize: 15, flexShrink: 0 }}>{c.name[0]}</div>
                  <div style={{ flex: 1 }}><p style={{ color: C.text, fontSize: 12, fontWeight: 600, margin: 0 }}>{c.name}</p><p style={{ color: C.dim, fontSize: 9, margin: '2px 0 0' }}>БИН: {c.bin} · {c.nds ? 'НДС' : 'Без НДС'}</p></div>
                </div>
              ))}
              <div onClick={() => setShowCp(false)} style={{ background: `${C.green}10`, border: `1px solid ${C.green}20`, borderRadius: 12, padding: '10px 13px', cursor: 'pointer', textAlign: 'center' }}>
                <p style={{ color: C.green, fontSize: 12, fontWeight: 600, margin: 0 }}>+ Добавить нового контрагента</p>
              </div>
            </div>
            <SBtn onClick={() => setShowCp(false)} style={{ marginTop: 10 }}>Закрыть</SBtn>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── BANK & FINANCE ───────────────────────────────────────────────
function BankScreen() {
  const [tab, setTab] = useState('bank');
  const ops = BANK_OPS;
  const balance = ops.reduce((s, o) => s + o.amount, 0);
  const income = ops.filter(o => o.type === 'in').reduce((s, o) => s + o.amount, 0);
  const expense = ops.filter(o => o.type === 'out').reduce((s, o) => s + Math.abs(o.amount), 0);

  const catSums = ops.filter(o => o.type === 'out').reduce((acc, o) => {
    acc[o.cat] = (acc[o.cat] || 0) + Math.abs(o.amount);
    return acc;
  }, {});

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
      <div style={{ padding: '14px 16px 0' }}>
        <h2 style={{ color: C.text, fontSize: 17, fontWeight: 700, margin: '0 0 10px' }}>Банк и касса</h2>
        <div style={{ display: 'flex', gap: 0, background: C.card2, borderRadius: 12, padding: '3px', marginBottom: 12 }}>
          {['bank', 'cash', 'sync'].map((t, i) => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '7px', borderRadius: 10, border: 'none', background: tab === t ? C.card : 'transparent', color: tab === t ? C.text : C.muted, fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>
              {['🏦 Банк', '💵 Касса', '🔄 Синхронизация'][i]}
            </button>
          ))}
        </div>

        {tab !== 'sync' ? (
          <>
            <div style={{ background: 'linear-gradient(135deg,#0e2248,#1a3a6e)', borderRadius: 18, padding: '16px', marginBottom: 12, border: '1px solid rgba(59,130,246,.2)' }}>
              <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 9, margin: 0, textTransform: 'uppercase' }}>Остаток · {tab === 'bank' ? 'Halyk Bank' : 'Касса'}</p>
              <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '4px 0 12px' }}>{fmt(Math.abs(balance > 0 ? balance : 500000))}</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                {[['+Приход', C.green], ['-Расход', C.red], ['⇄ Перевод', C.blue]].map(([l, c]) => (
                  <button key={l} style={{ flex: 1, padding: '7px', borderRadius: 10, background: `${c}20`, border: `1px solid ${c}30`, color: c, fontSize: 9, fontWeight: 600, cursor: 'pointer' }}>{l}</button>
                ))}
              </div>
            </div>

            {/* Category breakdown */}
            <Sec>Расходы по категориям · май</Sec>
            <div style={{ background: C.card, borderRadius: 14, padding: '12px', border: `1px solid ${C.border}`, marginBottom: 12 }}>
              {[['💼', 'ЗП сотрудников', catSums.salary || 0, C.blue], ['🏛', 'Налоги', catSums.tax || 0, C.orange], ['🏢', 'Операционные', catSums.expense || 0, C.muted]].map(([ic, l, v, c]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
                  <span style={{ fontSize: 16 }}>{ic}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ color: C.text, fontSize: 11 }}>{l}</span>
                      <span style={{ color: c, fontSize: 11, fontWeight: 700 }}>{fmt(v)}</span>
                    </div>
                    <div style={{ height: 4, background: C.dim, borderRadius: 2 }}>
                      <div style={{ height: '100%', width: `${Math.min(v / expense * 100, 100)}%`, background: c, borderRadius: 2 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Sec>Операции · май 2026</Sec>
            {ops.map(op => (
              <div key={op.id} style={{ background: C.card, borderRadius: 12, padding: '9px 12px', marginBottom: 6, display: 'flex', gap: 9, border: `1px solid ${C.border}` }}>
                <div style={{ width: 32, height: 32, borderRadius: 16, background: op.type === 'in' ? `${C.green}18` : `${C.red}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>
                  {op.type === 'in' ? '📈' : '📉'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: C.text, fontSize: 11, fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{op.desc}</p>
                  <p style={{ color: C.dim, fontSize: 9, margin: '2px 0 0' }}>{op.date}</p>
                </div>
                <p style={{ color: op.type === 'in' ? C.green : C.red, fontSize: 12, fontWeight: 700, margin: 0, flexShrink: 0 }}>{op.type === 'in' ? '+' : ''}{fmt(op.amount)}</p>
              </div>
            ))}
          </>
        ) : (
          <div>
            <Sec>Синхронизация с банками</Sec>
            {[['🏦', 'Halyk Bank', 'Подключён · последняя синхр. 10 мин. назад', C.green, true], ['💳', 'Kaspi Bank', 'Нажмите для подключения', C.muted, false], ['🏛️', 'Jusan Bank', 'Нажмите для подключения', C.muted, false], ['🏢', 'ForteBank', 'Нажмите для подключения', C.muted, false]].map(([ic, n, d, c, on]) => (
              <div key={n} style={{ background: C.card, borderRadius: 12, padding: '12px 13px', marginBottom: 7, border: `1px solid ${on ? C.green + '30' : C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 24 }}>{ic}</span>
                <div style={{ flex: 1 }}><p style={{ color: C.text, fontSize: 12, fontWeight: 600, margin: '0 0 2px' }}>{n}</p><p style={{ color: C.muted, fontSize: 10, margin: 0 }}>{d}</p></div>
                <Toggle on={on} onToggle={() => { }} col={C.green} />
              </div>
            ))}
            <div style={{ background: `${C.blue}10`, border: `1px solid ${C.blue}20`, borderRadius: 12, padding: '11px 13px', marginTop: 8 }}>
              <p style={{ color: C.blue, fontSize: 11, fontWeight: 700, margin: '0 0 4px' }}>🔄 Автосинхронизация</p>
              <p style={{ color: C.muted, fontSize: 10, margin: 0 }}>Выписки обновляются каждые 15 минут. Приход/расход/перевод сортируются автоматически.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TAXES & REPORTS ──────────────────────────────────────────────
function TaxesScreen({ nav }) {
  const [tab, setTab] = useState('taxes');
  const urgentAmt = TAXES_DATA.filter(t => t.status === 'urgent').reduce((s, t) => s + (t.amount || 0), 0);

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
      <div style={{ padding: '14px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: C.text, fontSize: 17, fontWeight: 700, margin: 0 }}>Налоги и отчёты</h2>
        <button onClick={() => nav('calculator')} style={{ background: `${C.gold}15`, border: `1px solid ${C.gold}28`, borderRadius: 10, padding: '5px 11px', color: C.gold, fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>🧮 Калькулятор</button>
      </div>
      <div style={{ margin: '8px 16px', display: 'flex', gap: 0, background: C.card2, borderRadius: 12, padding: '3px' }}>
        {['taxes', 'salary', 'reports'].map((t, i) => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '7px', borderRadius: 10, border: 'none', background: tab === t ? C.card : 'transparent', color: tab === t ? C.text : C.muted, fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>
            {['Налоги', 'ЗП', 'Отчёты'][i]}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 16px' }}>
        {tab === 'taxes' && (
          <>
            <div style={{ background: 'linear-gradient(135deg,#2a0e00,#471a00)', borderRadius: 16, padding: '15px', marginBottom: 12, border: `1px solid ${C.orange}28` }}>
              <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 9, margin: 0, textTransform: 'uppercase' }}>Срочно к уплате (до 15 мая)</p>
              <h2 style={{ color: C.orange, fontSize: 22, fontWeight: 800, margin: '4px 0 10px' }}>{fmt(urgentAmt)}</h2>
              <div style={{ display: 'flex', gap: 7 }}>
                <button style={{ flex: 1, padding: '8px', borderRadius: 10, background: C.orange, border: 'none', color: '#fff', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>💳 Оплатить</button>
                <button onClick={() => nav('report200')} style={{ flex: 1, padding: '8px', borderRadius: 10, background: 'rgba(255,255,255,.1)', border: 'none', color: '#fff', fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>📋 ФНО 200</button>
                <button style={{ flex: 1, padding: '8px', borderRadius: 10, background: 'rgba(255,255,255,.1)', border: 'none', color: '#fff', fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>📋 ФНО 300</button>
              </div>
            </div>

            <Sec>Налоги · ОУР · Плательщик НДС · НК РК 2026</Sec>
            {TAXES_DATA.map((t, i) => (
              <div key={i} style={{ background: C.card, borderRadius: 13, padding: '11px 12px', marginBottom: 7, border: `1px solid ${t.status === 'urgent' ? C.red + '32' : t.status === 'pending' ? C.orange + '22' : C.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 }}>
                  <div style={{ flex: 1, marginRight: 7 }}>
                    <p style={{ color: C.text, fontSize: 11, fontWeight: 700, margin: '0 0 1px' }}>{t.code} · {t.rate}</p>
                    <p style={{ color: C.muted, fontSize: 9, margin: 0 }}>{t.name}</p>
                  </div>
                  <span style={{ fontSize: 8, padding: '2px 7px', borderRadius: 10, fontWeight: 700, background: t.status === 'urgent' ? `${C.red}18` : t.status === 'pending' ? `${C.orange}14` : `${C.dim}20`, color: t.status === 'urgent' ? C.red : t.status === 'pending' ? C.orange : C.muted, flexShrink: 0 }}>
                    {t.status === 'urgent' ? '🔴 Срочно' : t.status === 'pending' ? '🟡 Ожидает' : '✅ Запланирован'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <span style={{ fontSize: 8, padding: '1px 6px', borderRadius: 7, background: C.card2, color: C.muted }}>{t.form}</span>
                    <span style={{ fontSize: 8, padding: '1px 6px', borderRadius: 7, background: C.card2, color: C.muted }}>📅 {t.deadline}</span>
                  </div>
                  {t.amount && <span style={{ color: t.status === 'urgent' ? C.red : C.text, fontSize: 12, fontWeight: 700 }}>{fmt(t.amount)}</span>}
                </div>
                {t.note && <p style={{ color: C.dim, fontSize: 8, margin: '4px 0 0', borderTop: `1px solid ${C.border}`, paddingTop: 3 }}>{t.note}</p>}
              </div>
            ))}

            <div style={{ background: `${C.blue}10`, border: `1px solid ${C.blue}20`, borderRadius: 13, padding: '11px 13px', marginTop: 6 }}>
              <p style={{ color: C.blue, fontSize: 11, fontWeight: 700, margin: '0 0 7px' }}>🔗 Интеграции с госсистемами</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {['КНП (salyk.kz)', 'Портал ЭСФ', 'e-Salyq Business', 'Казначейство', 'Казстат'].map((s, i) => (
                  <button key={i} style={{ padding: '4px 9px', borderRadius: 8, background: C.blue, border: 'none', color: '#fff', fontSize: 8, fontWeight: 600, cursor: 'pointer' }}>{s}</button>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === 'salary' && (
          <>
            <Sec>ЗП · NOVA COMP · май 2026 · НК РК</Sec>
            {EMPLOYEES.map(emp => {
              const calc = calcSalary(emp.salary, emp.type);
              return (
                <div key={emp.id} style={{ background: C.card, borderRadius: 14, padding: '12px', marginBottom: 9, border: `1px solid ${C.border}` }}>
                  <p style={{ color: C.text, fontSize: 12, fontWeight: 700, margin: '0 0 1px' }}>{emp.name}</p>
                  <p style={{ color: C.muted, fontSize: 9, margin: '0 0 9px' }}>{emp.pos}</p>
                  <div style={{ background: C.card2, borderRadius: 10, padding: '10px' }}>
                    {[
                      ['Оклад (gross)', fmt(calc.gross), C.text, false],
                      ['ОПВ 10% (удерж.)', '-' + fmt(calc.opv), C.red, false],
                      ['ВОСМС 2% (удерж.)', '-' + fmt(calc.vosms), C.red, false],
                      ['Вычет 30 МРП', '-' + fmt(30 * MRP), C.green, false],
                      ['ИПН ~10%', '-' + fmt(calc.ipn), C.red, false],
                      ['✅ К выплате (net)', fmt(calc.net), C.green, true],
                    ].map(([l, v, c, b]) => (
                      <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: b ? 0 : 4, paddingBottom: b ? 0 : 4, borderBottom: b ? 'none' : `1px solid ${C.border}` }}>
                        <span style={{ color: C.muted, fontSize: b ? 11 : 9 }}>{l}</span>
                        <span style={{ color: c, fontSize: b ? 13 : 9, fontWeight: b ? 800 : 600 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 8, background: `${C.orange}08`, borderRadius: 10, padding: '8px 10px' }}>
                    <p style={{ color: C.orange, fontSize: 9, fontWeight: 700, margin: '0 0 4px' }}>Расходы работодателя сверх оклада:</p>
                    {[['ОПВР 3.5% ↑', fmt(calc.opvr)], ['СО 5%', fmt(calc.so)], ['СН 6% ↓', fmt(calc.sn)], ['ВОСМС 2%', fmt(calc.vosmsEmp)], ['ИТОГО бизнес', fmt(calc.totalCost)]].map(([l, v]) => (
                      <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <span style={{ color: C.muted, fontSize: 9 }}>{l}</span>
                        <span style={{ color: l === 'ИТОГО бизнес' ? C.red : C.orange, fontSize: 9, fontWeight: l === 'ИТОГО бизнес' ? 800 : 600 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            <div style={{ background: `${C.purple}10`, border: `1px solid ${C.purple}20`, borderRadius: 13, padding: '11px 13px' }}>
              <p style={{ color: C.purple, fontSize: 11, fontWeight: 700, margin: '0 0 7px' }}>👥 Льготные категории 2026</p>
              {[
                ['🎓', 'Студент-очник', 'ВОСМС — 0% · ОПВ — есть · ИПН по вычету'],
                ['👴', 'Пенсионер', 'ОПВ — 0% · ОПВР — 0% · СО — 0% · ВОСМС — 0%'],
                ['♿', 'Инвалид I/II/III', 'Доп. вычет 882 МРП ≈ 3.8 млн ₸/год'],
                ['🌍', 'Нерезидент', 'ИПН 20% · без вычетов · ОПВ — 0%'],
              ].map(([ic, t, d]) => (
                <div key={t} style={{ marginBottom: 7, paddingBottom: 7, borderBottom: `1px solid ${C.border}` }}>
                  <p style={{ color: C.text, fontSize: 11, fontWeight: 600, margin: '0 0 2px' }}>{ic} {t}</p>
                  <p style={{ color: C.muted, fontSize: 9, margin: 0 }}>{d}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'reports' && (
          <>
            <div style={{ background: `${C.green}10`, border: `1px solid ${C.green}20`, borderRadius: 13, padding: '11px 13px', marginBottom: 12 }}>
              <p style={{ color: C.green, fontSize: 11, fontWeight: 700, margin: '0 0 2px' }}>🔐 Отправка через ЭЦП в КНП (ИСНА)</p>
              <p style={{ color: C.muted, fontSize: 10, margin: 0 }}>cabinet.salyk.kz · e-Salyq Business · Прямая интеграция</p>
            </div>
            {[
              ['ФНО 100.00', 'КПН · Раз в год', '10 апр 2027', 'Запланирован', null, C.dim],
              ['ФНО 200.00', 'ИПН+СН+соцплатежи · Квартально', '15 мая 2026', 'СРОЧНО', 329590, C.red],
              ['ФНО 300.00', 'НДС · Квартально', '15 мая 2026', 'СРОЧНО', 120690, C.red],
              ['ФНО 870.00', 'Имущественный налог · Раз в год', '1 окт 2026', 'Запланирован', null, C.dim],
              ['Статотчёт 2-МП', 'Малое предпринимательство · Квартально', '25 мая 2026', 'Ожидает', null, C.orange],
            ].map(([form, desc, dl, st, amt, c]) => (
              <div key={form} style={{ background: C.card, borderRadius: 13, padding: '11px 12px', marginBottom: 7, border: `1px solid ${st === 'СРОЧНО' ? C.red + '32' : C.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <p style={{ color: C.text, fontSize: 12, fontWeight: 700, margin: 0 }}>{form}</p>
                  <span style={{ fontSize: 8, padding: '2px 7px', borderRadius: 10, fontWeight: 700, background: st === 'СРОЧНО' ? `${C.red}18` : st === 'Ожидает' ? `${C.orange}14` : `${C.dim}20`, color: st === 'СРОЧНО' ? C.red : st === 'Ожидает' ? C.orange : C.muted }}>{st}</span>
                </div>
                <p style={{ color: C.muted, fontSize: 9, margin: '0 0 6px' }}>{desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 8, padding: '1px 6px', borderRadius: 7, background: C.card2, color: C.muted }}>📅 до {dl}</span>
                  {amt && (
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button style={{ padding: '4px 9px', borderRadius: 8, background: `${C.green}15`, border: `1px solid ${C.green}24`, color: C.green, fontSize: 8, fontWeight: 600, cursor: 'pointer' }}>📋 Заполнить</button>
                      <button style={{ padding: '4px 9px', borderRadius: 8, background: C.orange, border: 'none', color: '#fff', fontSize: 8, fontWeight: 700, cursor: 'pointer' }}>💳 {fmt(amt)}</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ─── CALCULATOR ───────────────────────────────────────────────────
function CalculatorScreen({ onBack }) {
  const [gross, setGross] = useState('550000');
  const [empType, setEmpType] = useState('standard');
  const [calcMode, setCalcMode] = useState('salary');
  const [ndsSumma, setNdsSumma] = useState('1180000');
  const [ndsMode, setNdsMode] = useState('from'); // from / to
  const calc = calcSalary(parseFloat(gross) || 0, empType);
  const ndsVal = parseFloat(ndsSumma) || 0;
  const ndsResult = ndsMode === 'from' ? Math.round(ndsVal * 16 / 116) : Math.round(ndsVal * 0.16);
  const ndsBase = ndsMode === 'from' ? ndsVal - ndsResult : ndsVal;
  const ndsTotal = ndsMode === 'from' ? ndsVal : ndsVal + ndsResult;

  const types = [['standard', 'Стандартный'], ['student', 'Студент-очник'], ['pensioner', 'Пенсионер'], ['disabled', 'Инвалид I/II/III'], ['nonresident', 'Нерезидент']];

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 28 }}>
      <div style={{ padding: '14px 16px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <BackBtn onBack={onBack} />
        <h2 style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: 0 }}>🧮 Налоговый калькулятор</h2>
      </div>

      <div style={{ margin: '10px 16px', display: 'flex', gap: 0, background: C.card2, borderRadius: 11, padding: '3px' }}>
        {['salary', 'nds'].map((t, i) => (
          <button key={t} onClick={() => setCalcMode(t)} style={{ flex: 1, padding: '7px', borderRadius: 9, border: 'none', background: calcMode === t ? C.card : 'transparent', color: calcMode === t ? C.text : C.muted, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
            {['💼 ЗП и налоги', '🔖 Калькулятор НДС'][i]}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 16px' }}>
        {calcMode === 'salary' && (
          <>
            <div style={{ background: `${C.gold}10`, border: `1px solid ${C.gold}24`, borderRadius: 12, padding: '10px 13px', marginBottom: 12 }}>
              <p style={{ color: C.gold, fontSize: 10, fontWeight: 700, margin: '0 0 2px' }}>НК РК 2026 · МРП {fmtN(MRP)} ₸ · МЗП {fmtN(MZP)} ₸</p>
              <p style={{ color: C.muted, fontSize: 9, margin: 0 }}>ОУР · Вычет 30 МРП = {fmtN(30 * MRP)} ₸/мес</p>
            </div>

            <Fi label="Оклад (gross) ₸" value={gross} onChange={setGross} placeholder="350 000" />

            <Sec>Категория сотрудника</Sec>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
              {types.map(([v, l]) => (
                <button key={v} onClick={() => setEmpType(v)} style={{ padding: '5px 10px', borderRadius: 9, border: `1.5px solid ${empType === v ? C.blue : C.border}`, background: empType === v ? `${C.blue}15` : 'transparent', color: empType === v ? C.blue : C.muted, fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>{l}</button>
              ))}
            </div>

            {gross && (
              <>
                <div style={{ background: C.card, borderRadius: 14, padding: '14px', border: `1px solid ${C.border}`, marginBottom: 10 }}>
                  <p style={{ color: C.text, fontSize: 12, fontWeight: 700, margin: '0 0 10px' }}>Расчёт за сотрудника</p>
                  {[
                    ['Оклад (gross)', fmt(calc.gross), C.text],
                    ['− ОПВ 10%', '-' + fmt(calc.opv), C.red],
                    ['− ВОСМС 2%', '-' + fmt(calc.vosms), C.red],
                    ['− Вычет 30 МРП', fmt(30 * MRP), C.green],
                    ['− ИПН', '-' + fmt(calc.ipn), C.red],
                    ['✅ К выплате (net)', fmt(calc.net), C.green],
                  ].map(([l, v, c], i, a) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, paddingBottom: 5, borderBottom: i === a.length - 2 ? `1.5px solid ${C.border}` : i < a.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                      <span style={{ color: C.muted, fontSize: 11 }}>{l}</span>
                      <span style={{ color: c, fontSize: i === a.length - 1 ? 14 : 11, fontWeight: i === a.length - 1 ? 800 : 600 }}>{v}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: `${C.orange}10`, borderRadius: 14, padding: '13px', border: `1px solid ${C.orange}20`, marginBottom: 10 }}>
                  <p style={{ color: C.orange, fontSize: 11, fontWeight: 700, margin: '0 0 9px' }}>💼 Расходы работодателя (сверх оклада)</p>
                  {[
                    ['ОПВР 3.5% ↑ (с 2026)', fmt(calc.opvr), C.orange],
                    ['СО 5%', fmt(calc.so), C.orange],
                    ['СН 6% ↓ (с 11%)', fmt(calc.sn), C.orange],
                    ['ВОСМС 2%', fmt(calc.vosmsEmp), C.orange],
                    ['📊 ИТОГО расходов бизнеса', fmt(calc.totalCost), C.red],
                  ].map(([l, v, c]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ color: C.muted, fontSize: 10 }}>{l}</span>
                      <span style={{ color: c, fontSize: 10, fontWeight: 700 }}>{v}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: `${C.purple}10`, borderRadius: 12, padding: '11px 13px', border: `1px solid ${C.purple}20` }}>
                  <p style={{ color: C.purple, fontSize: 11, fontWeight: 700, margin: '0 0 6px' }}>📊 Нагрузка</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ color: C.muted, fontSize: 10 }}>На работника</span>
                    <span style={{ color: C.text, fontSize: 10, fontWeight: 600 }}>{Math.round((calc.gross - calc.net) / calc.gross * 100)}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: C.muted, fontSize: 10 }}>На бизнес (сверх оклада)</span>
                    <span style={{ color: C.red, fontSize: 10, fontWeight: 600 }}>{Math.round((calc.totalCost - calc.gross) / calc.gross * 100)}%</span>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {calcMode === 'nds' && (
          <>
            <div style={{ background: `${C.orange}10`, border: `1px solid ${C.orange}24`, borderRadius: 12, padding: '10px 13px', marginBottom: 12 }}>
              <p style={{ color: C.orange, fontSize: 10, fontWeight: 700, margin: '0 0 2px' }}>НДС 16% · НК РК 2026</p>
              <p style={{ color: C.muted, fontSize: 9, margin: 0 }}>Порог постановки: 10 000 МРП = 43 250 000 ₸</p>
            </div>

            <Fi label="Сумма (₸)" value={ndsSumma} onChange={setNdsSumma} placeholder="1 000 000" />

            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
              {[['from', 'Выделить НДС из суммы'], ['to', 'Начислить НДС на сумму']].map(([v, l]) => (
                <button key={v} onClick={() => setNdsMode(v)} style={{ flex: 1, padding: '8px', borderRadius: 10, border: `1.5px solid ${ndsMode === v ? C.orange : C.border}`, background: ndsMode === v ? `${C.orange}15` : 'transparent', color: ndsMode === v ? C.orange : C.muted, fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>{l}</button>
              ))}
            </div>

            {ndsSumma && (
              <div style={{ background: C.card, borderRadius: 14, padding: '14px', border: `1px solid ${C.border}` }}>
                {[
                  ['Сумма без НДС', fmt(ndsBase), C.text],
                  ['НДС 16%', fmt(ndsResult), C.orange],
                  ['Итого с НДС', fmt(ndsTotal), C.blue],
                ].map(([l, v, c], i) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: i < 2 ? 8 : 0, paddingBottom: i < 2 ? 8 : 0, borderBottom: i < 2 ? `1px solid ${C.border}` : 'none' }}>
                    <span style={{ color: C.muted, fontSize: 12 }}>{l}</span>
                    <span style={{ color: c, fontSize: i === 2 ? 16 : 12, fontWeight: i === 2 ? 800 : 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── COUNTERPARTIES ───────────────────────────────────────────────
function CpScreen() {
  const [q, setQ] = useState('');
  const [showCheck, setShowCheck] = useState(false);
  const [checkBin, setCheckBin] = useState('');
  const filtered = COUNTERPARTIES.filter(c =>
    c.name.toLowerCase().includes(q.toLowerCase()) || c.bin.includes(q)
  );

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
      <div style={{ padding: '14px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: C.text, fontSize: 17, fontWeight: 700, margin: 0 }}>Контрагенты</h2>
        <button style={{ background: C.blue, border: 'none', borderRadius: 14, padding: '5px 13px', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>+ Добавить</button>
      </div>

      <div style={{ padding: '8px 16px 0' }}>
        <div style={{ background: `${C.blue}10`, border: `1px solid ${C.blue}20`, borderRadius: 13, padding: '11px 13px', marginBottom: 9 }}>
          <p style={{ color: C.blue, fontSize: 11, fontWeight: 700, margin: '0 0 7px' }}>🔍 Проверка контрагентов</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
            {['egov.kz', 'КГД РК', 'Елиценз (rge.kz)', 'Казстат', 'НРД'].map((s, i) => (
              <button key={i} style={{ padding: '3px 8px', borderRadius: 7, background: C.blue, border: 'none', color: '#fff', fontSize: 8, fontWeight: 600, cursor: 'pointer' }}>{s}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <input value={checkBin} onChange={e => setCheckBin(e.target.value)} placeholder="Введите БИН/ИИН для проверки..." style={{ flex: 1, background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, padding: '7px 11px', color: C.text, fontSize: 11, outline: 'none' }} />
            <button onClick={() => setShowCheck(true)} style={{ padding: '7px 12px', borderRadius: 8, background: C.blue, border: 'none', color: '#fff', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>Проверить</button>
          </div>
        </div>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="🔍 Поиск контрагентов..." style={{ width: '100%', background: C.card, border: `1px solid ${C.border}`, borderRadius: 11, padding: '9px 13px', color: C.text, fontSize: 11, outline: 'none', boxSizing: 'border-box', marginBottom: 8 }} />
      </div>

      <div style={{ padding: '0 16px' }}>
        {filtered.map(c => (
          <div key={c.id} style={{ background: C.card, borderRadius: 13, padding: '12px 13px', marginBottom: 7, display: 'flex', alignItems: 'center', gap: 10, border: `1px solid ${C.border}`, cursor: 'pointer' }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: `linear-gradient(135deg,${C.blue}38,${C.cyan}38)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 700, color: C.text, flexShrink: 0 }}>{c.name[0]}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: C.text, fontSize: 11, fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</p>
              <p style={{ color: C.dim, fontSize: 9, margin: '2px 0 4px' }}>БИН: {c.bin} · {c.contact}</p>
              <div style={{ display: 'flex', gap: 4 }}>
                <span style={{ fontSize: 8, padding: '1px 6px', borderRadius: 8, background: c.type === 'client' ? `${C.blue}15` : `${C.orange}15`, color: c.type === 'client' ? C.blue : C.orange, fontWeight: 600 }}>{c.type === 'client' ? 'Клиент' : 'Поставщик'}</span>
                {c.nds && <span style={{ fontSize: 8, padding: '1px 6px', borderRadius: 8, background: `${C.orange}14`, color: C.orange, fontWeight: 600 }}>НДС</span>}
                <span style={{ fontSize: 8, padding: '1px 6px', borderRadius: 8, background: `${C.green}14`, color: C.green, fontWeight: 600 }}>✅ Активен</span>
              </div>
            </div>
            <span style={{ color: C.blue, fontSize: 18 }}>›</span>
          </div>
        ))}
      </div>

      {showCheck && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.88)', display: 'flex', alignItems: 'flex-end', zIndex: 200 }}>
          <div style={{ background: C.card, borderRadius: '22px 22px 0 0', width: '100%', padding: '18px 18px 26px' }}>
            <div style={{ width: 36, height: 4, background: '#444', borderRadius: 2, margin: '0 auto 14px' }} />
            <h3 style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: '0 0 4px' }}>✅ Результаты проверки</h3>
            <p style={{ color: C.muted, fontSize: 10, margin: '0 0 13px' }}>БИН: {checkBin || '241040014477'} · egov.kz</p>
            {[
              ['Статус', 'Активный', C.green],
              ['Правовая форма', 'ТОО', C.text],
              ['Дата регистрации', '10.10.2024', C.text],
              ['Лицензии', '3 активные лицензии', C.blue],
              ['Плательщик НДС', 'Да · №НДС-2024', C.orange],
              ['Налог. задолженность', 'Нет', C.green],
              ['Судебные дела', 'Нет', C.green],
              ['Банкротство', 'Нет', C.green],
            ].map(([l, v, c]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, paddingBottom: 6, borderBottom: `1px solid ${C.border}` }}>
                <span style={{ color: C.muted, fontSize: 11 }}>{l}</span>
                <span style={{ color: c, fontSize: 11, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <SBtn onClick={() => setShowCheck(false)} style={{ marginTop: 8 }}>Закрыть</SBtn>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ANALYTICS ────────────────────────────────────────────────────
function AnalyticsScreen({ onBack }) {
  const [period, setPeriod] = useState('month');
  const income = DOCS_DATA.filter(d => d.dir === 'out' && d.payStatus === 'paid').reduce((s, d) => s + d.amount, 0);
  const expense = BANK_OPS.filter(o => o.type === 'out').reduce((s, o) => s + Math.abs(o.amount), 0);
  const profit = income - expense;

  const months = [
    { m: 'Янв', inc: 420000, exp: 380000 },
    { m: 'Фев', inc: 560000, exp: 410000 },
    { m: 'Мар', inc: 890000, exp: 520000 },
    { m: 'Апр', inc: 750000, exp: 490000 },
    { m: 'Май', inc: income, exp: expense },
  ];
  const maxVal = Math.max(...months.map(m => Math.max(m.inc, m.exp)));

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 28 }}>
      <div style={{ padding: '14px 16px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <BackBtn onBack={onBack} />
        <h2 style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: 0 }}>📊 Аналитика</h2>
      </div>

      <div style={{ margin: '8px 16px', display: 'flex', gap: 4 }}>
        {['month', 'quarter', 'half', 'year'].map((p, i) => (
          <button key={p} onClick={() => setPeriod(p)} style={{ flex: 1, padding: '6px 4px', borderRadius: 9, border: `1px solid ${period === p ? C.blue : C.border}`, background: period === p ? `${C.blue}15` : 'transparent', color: period === p ? C.blue : C.muted, fontSize: 9, fontWeight: 600, cursor: 'pointer' }}>
            {['Месяц', 'Квартал', 'Полугодие', 'Год'][i]}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 16px' }}>
        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7, marginBottom: 14 }}>
          {[['Доходы', fmt(income), C.green], ['Расходы', fmt(expense), C.red], ['Прибыль', fmt(profit), profit > 0 ? C.blue : C.red]].map(([l, v, c]) => (
            <div key={l} style={{ background: C.card, borderRadius: 13, padding: '11px 9px', border: `1px solid ${C.border}`, textAlign: 'center' }}>
              <p style={{ color: C.muted, fontSize: 8, margin: '0 0 4px', textTransform: 'uppercase' }}>{l}</p>
              <p style={{ color: c, fontSize: 10, fontWeight: 800, margin: 0 }}>{v}</p>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <Sec>Динамика доходов/расходов</Sec>
        <div style={{ background: C.card, borderRadius: 14, padding: '14px', border: `1px solid ${C.border}`, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100 }}>
            {months.map((m, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', width: '100%' }}>
                  <div style={{ flex: 1, background: C.green, borderRadius: '3px 3px 0 0', height: `${m.inc / maxVal * 80}px`, minHeight: 4 }} />
                  <div style={{ flex: 1, background: C.red, borderRadius: '3px 3px 0 0', height: `${m.exp / maxVal * 80}px`, minHeight: 4 }} />
                </div>
                <span style={{ color: C.muted, fontSize: 8 }}>{m.m}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}><div style={{ width: 8, height: 8, borderRadius: 2, background: C.green }} /><span style={{ color: C.muted, fontSize: 9 }}>Доходы</span></div>
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}><div style={{ width: 8, height: 8, borderRadius: 2, background: C.red }} /><span style={{ color: C.muted, fontSize: 9 }}>Расходы</span></div>
          </div>
        </div>

        {/* Category breakdown */}
        <Sec>Расходы по категориям</Sec>
        <div style={{ background: C.card, borderRadius: 14, padding: '13px', border: `1px solid ${C.border}` }}>
          {[['💼', 'ЗП', 1118700, C.blue], ['🏛', 'Налоги', 370000, C.orange], ['🏢', 'Аренда', 310200, C.purple], ['📡', 'Связь', 45000, C.cyan]].map(([ic, l, v, c]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
              <span style={{ fontSize: 16 }}>{ic}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ color: C.text, fontSize: 11 }}>{l}</span>
                  <span style={{ color: c, fontSize: 11, fontWeight: 700 }}>{fmt(v)}</span>
                </div>
                <div style={{ height: 4, background: C.dim, borderRadius: 2 }}>
                  <div style={{ height: '100%', width: `${v / 1843900 * 100}%`, background: c, borderRadius: 2 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── NEWS ─────────────────────────────────────────────────────────
function NewsScreen({ onBack }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 28 }}>
      <div style={{ padding: '14px 16px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <BackBtn onBack={onBack} />
        <h2 style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: 0 }}>📰 Новости · НК РК 2026</h2>
      </div>
      <div style={{ padding: '10px 16px 0' }}>
        <div style={{ background: `${C.blue}10`, border: `1px solid ${C.blue}20`, borderRadius: 13, padding: '10px 13px', marginBottom: 12 }}>
          <p style={{ color: C.blue, fontSize: 10, fontWeight: 700, margin: '0 0 2px' }}>🤖 ИИ мониторит изменения НК автоматически</p>
          <p style={{ color: C.muted, fontSize: 9, margin: 0 }}>Push + Email + SMS при изменении ставок и сроков</p>
        </div>
        {NEWS_DATA.map(n => (
          <div key={n.id} style={{ background: C.card, borderRadius: 13, padding: '12px 13px', marginBottom: 8, border: `1px solid ${n.hot ? C.red + '28' : C.border}` }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 8, padding: '2px 7px', borderRadius: 10, background: `${C.blue}15`, color: C.blue, fontWeight: 700 }}>{n.tag}</span>
              {n.hot && <span style={{ fontSize: 8, padding: '2px 7px', borderRadius: 10, background: `${C.red}15`, color: C.red, fontWeight: 700 }}>🔴 Важно</span>}
              <span style={{ color: C.dim, fontSize: 8, marginLeft: 'auto' }}>{n.date}</span>
            </div>
            <p style={{ color: C.text, fontSize: 12, fontWeight: 700, margin: '0 0 5px' }}>{n.title}</p>
            <p style={{ color: C.muted, fontSize: 10, margin: 0, lineHeight: 1.5 }}>{n.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CALENDAR ─────────────────────────────────────────────────────
function CalendarScreen({ onBack }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 28 }}>
      <div style={{ padding: '14px 16px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <BackBtn onBack={onBack} />
        <h2 style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: 0 }}>📅 Налоговый календарь 2026</h2>
      </div>
      <div style={{ padding: '10px 16px 0' }}>
        <div style={{ background: `${C.blue}10`, border: `1px solid ${C.blue}20`, borderRadius: 13, padding: '10px 13px', marginBottom: 12 }}>
          <p style={{ color: C.blue, fontSize: 10, fontWeight: 700, margin: '0 0 2px' }}>🔔 Уведомления: за 14, 7, 3 дня и в день срока</p>
          <p style={{ color: C.muted, fontSize: 9, margin: 0 }}>Push · Email · SMS · Telegram · автоматически</p>
        </div>
        {TAX_CALENDAR.map((item, i) => (
          <div key={i} style={{ background: C.card, borderRadius: 14, padding: '13px 13px', marginBottom: 9, border: `1px solid ${item.urgent ? C.red + '30' : C.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: item.urgent ? `${C.red}16` : C.card2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: item.urgent ? C.red : C.muted, fontSize: 10, fontWeight: 800, textAlign: 'center', lineHeight: 1.2 }}>{item.date}</span>
                </div>
                <div>{item.items.map((it, j) => <p key={j} style={{ color: C.text, fontSize: 11, margin: '0 0 2px', fontWeight: j === 0 ? 600 : 400 }}>{it}</p>)}</div>
              </div>
              {item.amount && <p style={{ color: item.urgent ? C.red : C.muted, fontSize: 12, fontWeight: 700, margin: 0, flexShrink: 0 }}>{fmt(item.amount)}</p>}
            </div>
            {item.urgent && (
              <button style={{ width: '100%', padding: '7px', borderRadius: 10, background: C.red, border: 'none', color: '#fff', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>💳 Оплатить сейчас</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AI ASSISTANT ─────────────────────────────────────────────────
function AIScreen({ onBack }) {
  const [msgs, setMsgs] = useState([{
    role: 'ai',
    text: `Привет! Я ИИ-ассистент BizBook KZ 🤖\n\nЗнаю всё о NOVA COMP (ОУР+НДС) и могу:\n• Рассчитать налоги и соцплатежи\n• Выписать ЭСФ, ЭАВР, доверенности\n• Заполнить ФНО 200, 300, 100\n• Проверить контрагентов по БИН\n• Рассчитать ЗП любой категории\n• Разобрать изменения НК РК 2026\n• Рассчитать дивиденды\n\nЧем могу помочь?`
  }]);
  const [inp, setInp] = useState('');
  const endRef = useRef();
  const suggestions = ['Срочные налоги?', 'Расчёт ЗП май', 'Создай ЭСФ', 'Проверь контрагента', 'ОПВР 3.5%?', 'Дивиденды ТОО', 'Что нового в НК?'];

  const send = (text) => {
    if (!text.trim()) return;
    setMsgs(m => [...m, { role: 'user', text }]);
    setInp('');
    setTimeout(() => {
      const t = text.toLowerCase();
      let r;
      if (t.includes('налог') || t.includes('срочн')) {
        r = `**Срочно до 15 мая 2026:**\n\n📊 ФНО 200.00 (ИПН+СН за Q1):\n• ИПН с ФОТ: 130 000 ₸\n• СН 6%: 78 900 ₸\n\n🔖 ФНО 300.00 (НДС за Q1):\n• НДС к уплате: 120 690 ₸\n\nИТОГО срочно: 329 590 ₸\n\nЗаполнить автоматически и отправить в КНП через ЭЦП?`;
      } else if (t.includes('дивиден')) {
        r = `**Дивиденды ТОО «NOVA COMP» 2026:**\n\nДивиденды для учредителей-резидентов:\n• ИПН: 5% (льготная ставка ст.350 НК)\n• ОПВ: НЕ удерживается\n• СО: НЕ начисляется\n\nПример: выплата 1 000 000 ₸\n• ИПН 5% = 50 000 ₸\n• К выплате: 950 000 ₸\n\nОсновение: ст.350 п.2 НК РК 2026\n\nВыплата возможна только из чистой прибыли. Нужна помощь с расчётом?`;
      } else if (t.includes('зп') || t.includes('зарплат')) {
        r = `**ЗП NOVA COMP · май 2026:**\n\n👔 Иванов А.С. (600 000 ₸ gross)\n→ Нетто: ~503 000 ₸\n→ Расходы работодателя: +71 100 ₸\n\n👩 Петрова А.В. (380 000 ₸)\n→ Нетто: ~320 700 ₸\n→ Расходы работодателя: +45 050 ₸\n\n👨 Сейткали М.Б. (350 000 ₸)\n→ Нетто: ~295 000 ₸\n→ Расходы работодателя: +41 500 ₸\n\nВсего к выплате: 1 118 700 ₸\nИТОГО расходы бизнеса: 1 318 350 ₸\n\nСформировать платёжные поручения?`;
      } else if (t.includes('опвр') || t.includes('3.5')) {
        r = `**ОПВР 3.5% — новшество 2026:**\n\nОбязательные пенсионные взносы работодателя (ОПВР) повышены с 2.5% до 3.5% с 01.01.2026.\n\nБаза: оклад (max 50 МЗП = 4 250 000 ₸)\nПлательщик: работодатель (сверх оклада)\n\nПример (оклад 350 000 ₸):\n350 000 × 3.5% = 12 250 ₸/мес доп. расход\n\nОсвобождены: пенсионеры, ряд инвалидов\n\nЭто прямой расход бизнеса! Включается в ФНО 200.`;
      } else if (t.includes('нк') || t.includes('нов') || t.includes('2026')) {
        r = `**Ключевые изменения НК РК 2026:**\n\n📊 Для ОУР (NOVA COMP):\n• СН ↓ с 11% до 6% (экономия!)\n• ОПВР ↑ с 2.5% до 3.5%\n• Вычет 30 МРП = 129 750 ₸/мес\n• КПН 20% · НДС 16% (не изменились)\n\n⚡ Для СНР:\n• Ставка 4% ИПН/КПН\n• ЭСФ обязательны для всех\n• Запретительный список ОКЭД\n\n🔖 НДС:\n• Порог ↓ до 43.25 млн ₸ (10 000 МРП)\n\nПрогрессивный ИПН: 10% до 230 000 МРП, 15% сверх`;
      } else {
        r = `Понял! По теме «${text}»:\n\nДля NOVA COMP (ОУР+НДС) НК РК 2026:\n\n✅ ЭСФ обязательны по всем сделкам с НДС\n✅ ФНО 200, 300 — ежеквартально\n✅ КПН авансы — ежемесячно до 25 числа\n✅ ОПВР 3.5% от ФОТ — новшество 2026\n✅ Прогрессивный ИПН от 230 000 МРП\n\nУточни вопрос — дам точный расчёт!`;
      }
      setMsgs(m => [...m, { role: 'ai', text: r }]);
    }, 650);
  };

  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [msgs]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 16px 8px', display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0, borderBottom: `1px solid ${C.border}` }}>
        <BackBtn onBack={onBack} />
        <div style={{ width: 34, height: 34, borderRadius: 17, background: `linear-gradient(135deg,${C.purple},${C.blue})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🤖</div>
        <div>
          <p style={{ color: C.text, fontSize: 13, fontWeight: 700, margin: 0 }}>ИИ-ассистент BizBook</p>
          <p style={{ color: C.green, fontSize: 9, margin: 0 }}>● Онлайн · НК РК 2026 · IgnisCantet.kz</p>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 16px' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
            <div style={{ maxWidth: '86%', padding: '10px 13px', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: m.role === 'user' ? C.blue : C.card, border: m.role === 'ai' ? `1px solid ${C.border}` : 'none' }}>
              <p style={{ color: '#fff', fontSize: 11, lineHeight: 1.65, margin: 0, whiteSpace: 'pre-line' }}>{m.text.replace(/\*\*(.*?)\*\*/g, (_, p) => p)}</p>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div style={{ padding: '7px 16px 12px', flexShrink: 0, borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 7, overflowX: 'auto', paddingBottom: 2 }}>
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => send(s)} style={{ padding: '4px 9px', borderRadius: 11, background: `${C.purple}15`, border: `1px solid ${C.purple}24`, color: C.purple, fontSize: 8, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>{s}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 7 }}>
          <input value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(inp)} placeholder="Задайте вопрос по НК РК..." style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '10px 13px', color: C.text, fontSize: 11, outline: 'none' }} />
          <button onClick={() => send(inp)} style={{ width: 40, height: 40, borderRadius: 12, background: C.blue, border: 'none', color: '#fff', fontSize: 16, cursor: 'pointer' }}>↑</button>
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────
function ProfileScreen({ nav }) {
  const integrations = [
    ['🏛️', 'КНП (cabinet.salyk.kz)', 'Сдача ФНО, налоговые проверки', true],
    ['🧾', 'Портал ЭСФ (esf.gov.kz)', 'Выписка и получение ЭСФ, ЭАВР', true],
    ['🇰🇿', 'eGov (egov.kz)', 'Данные компании, реестры, справки', true],
    ['📊', 'Казстат (stat.gov.kz)', 'Статистическая отчётность', false],
    ['🏦', 'Halyk Bank API', 'Выписки и платежи', true],
    ['🔐', 'NCA PKI (pki.gov.kz)', 'ЭЦП и подписание документов', true],
    ['📋', 'Елиценз (rge.kz)', 'Лицензии и разрешения', false],
    ['🏢', 'ГКБ МЮРК', 'Регистрация, изменения в ТОО', false],
  ];

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
      <div style={{ padding: '14px 16px 0' }}>
        <h2 style={{ color: C.text, fontSize: 17, fontWeight: 700, margin: '0 0 12px' }}>Профиль и настройки</h2>

        <div style={{ background: 'linear-gradient(135deg,#0c1f3d,#1a3560)', borderRadius: 20, padding: '16px', marginBottom: 14, border: '1px solid rgba(59,130,246,.24)', display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ padding: 8, background: 'rgba(255,255,255,.1)', borderRadius: 14 }}><NovaLogo size={34} /></div>
          <div>
            <h3 style={{ color: '#fff', fontSize: 13, fontWeight: 800, margin: '0 0 2px' }}>{CO.name}</h3>
            <p style={{ color: 'rgba(255,255,255,.55)', fontSize: 9, margin: '0 0 6px' }}>БИН: {CO.bin} · с {CO.reg}</p>
            <div style={{ display: 'flex', gap: 4 }}>
              {['ОУР', 'НДС 16%', 'Алматы', 'НСФО'].map((t, i) => (
                <span key={i} style={{ fontSize: 8, padding: '2px 6px', borderRadius: 8, background: 'rgba(59,130,246,.3)', color: '#fff', fontWeight: 600 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        <Sec>Реквизиты компании</Sec>
        {[['Директор', CO.director], ['Адрес', CO.address], ['Телефон', CO.phone], ['Email', CO.email], ['Банк', CO.bank + ' · ' + CO.bik], ['ИИК', CO.iik], ['ОКВЭД', CO.okved], ['Номер НДС', CO.ndsNum]].map(([l, v]) => <Fd key={l} label={l} value={v} />)}

        <Sec>Сотрудники</Sec>
        {EMPLOYEES.map(emp => (
          <div key={emp.id} style={{ background: C.card, borderRadius: 12, padding: '10px 12px', marginBottom: 6, border: `1px solid ${C.border}`, display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 38, height: 38, borderRadius: 19, background: `linear-gradient(135deg,${C.blue}35,${C.purple}35)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: C.text, flexShrink: 0 }}>{emp.name[0]}</div>
            <div style={{ flex: 1 }}><p style={{ color: C.text, fontSize: 11, fontWeight: 600, margin: 0 }}>{emp.name}</p><p style={{ color: C.muted, fontSize: 9, margin: '1px 0 0' }}>{emp.pos} · с {emp.hired}</p></div>
            <p style={{ color: C.blue, fontSize: 11, fontWeight: 700, margin: 0 }}>{fmt(emp.salary)}</p>
          </div>
        ))}

        <Sec>Интеграции с госсистемами</Sec>
        {integrations.map(([ic, t, d, on], i) => (
          <div key={i} style={{ background: C.card, borderRadius: 12, padding: '10px 12px', marginBottom: 5, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>{ic}</span>
            <div style={{ flex: 1 }}><p style={{ color: C.text, fontSize: 11, fontWeight: 600, margin: '0 0 1px' }}>{t}</p><p style={{ color: C.muted, fontSize: 9, margin: 0 }}>{d}</p></div>
            <Toggle on={on} onToggle={() => { }} col={C.green} />
          </div>
        ))}

        <Sec>Настройки</Sec>
        <div style={{ background: C.card, borderRadius: 14, overflow: 'hidden', border: `1px solid ${C.border}`, marginBottom: 12 }}>
          {[['🏢', 'Данные компании'], ['📋', 'Налоговый режим'], ['🏦', 'Банковские счета'], ['🔐', 'ЭЦП и сертификаты'], ['📊', 'Тарифный план'], ['🔔', 'Уведомления'], ['📰', 'Новости НК'], ['❓', 'Поддержка 24/7']].map(([ic, l], i, a) => (
            <div key={i} style={{ padding: '11px 13px', borderBottom: i < a.length - 1 ? `1px solid ${C.border}` : 'none', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <span style={{ fontSize: 16 }}>{ic}</span>
              <span style={{ color: C.text, fontSize: 11, fontWeight: 500, flex: 1 }}>{l}</span>
              <span style={{ color: C.dim, fontSize: 17 }}>›</span>
            </div>
          ))}
        </div>

        <div style={{ background: C.card, borderRadius: 13, padding: '11px 13px', marginBottom: 12, border: `1px solid ${C.border}`, textAlign: 'center' }}>
          <p style={{ color: C.muted, fontSize: 9, margin: '0 0 2px' }}>© 2026 IgnisCantet.kz · Все права защищены</p>
          <p style={{ color: C.dim, fontSize: 8, margin: 0 }}>Авторские права защищены Законом РК «Об авторском праве» №6-I</p>
          <p style={{ color: C.dim, fontSize: 8, margin: '1px 0 0' }}>BizBook KZ v{APP_VERSION} · {AUTHOR}</p>
        </div>

        <button onClick={() => nav('splash')} style={{ width: '100%', padding: '12px', borderRadius: 12, background: `${C.red}0e`, border: `1px solid ${C.red}20`, color: C.red, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}

// ─── SUCCESS ──────────────────────────────────────────────────────
function SuccessScreen({ onDone, title = 'Готово!', sub = 'Документ создан и готов к подписанию ЭЦП' }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
      <div style={{ fontSize: 58, marginBottom: 14 }}>🎉</div>
      <h2 style={{ color: C.text, fontSize: 21, fontWeight: 800, margin: '0 0 7px', textAlign: 'center' }}>{title}</h2>
      <p style={{ color: C.muted, fontSize: 11, textAlign: 'center', margin: '0 0 24px', lineHeight: 1.6 }}>{sub}</p>
      <div style={{ display: 'flex', gap: 6, width: '100%', marginBottom: 9 }}>
        {[['💬', 'WhatsApp'], ['✈️', 'Telegram'], ['📧', 'Email'], ['📱', 'SMS']].map(([ic, l], i) => (
          <button key={i} onClick={onDone} style={{ flex: 1, padding: '9px 3px', borderRadius: 11, background: C.card, border: `1px solid ${C.border}`, color: C.text, fontSize: 8, fontWeight: 600, cursor: 'pointer' }}>{ic}<br />{l}</button>
        ))}
      </div>
      <PBtn onClick={onDone}>← На главную</PBtn>
    </div>
  );
}

// ─── NAVIGATION ───────────────────────────────────────────────────
const NAV_TABS = [
  { icon: '🏠', label: 'Главная', key: 'home' },
  { icon: '📁', label: 'Документы', key: 'docs' },
  { icon: '🏦', label: 'Банк', key: 'bank' },
  { icon: '📊', label: 'Налоги', key: 'taxes' },
  { icon: '🏢', label: 'Кабинет', key: 'cp' },
];
const MAIN_SCREENS = new Set(['home', 'docs', 'bank', 'taxes', 'cp', 'profile']);
const AUTH_SCREENS = new Set(['splash', 'onboard1', 'onboard2', 'onboard3', 'onboard4', 'onboard5']);

// ─── APP ROOT ─────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('splash');
  const [selDoc, setSelDoc] = useState(null);
  const nav = useCallback(s => setScreen(s), []);

  const showNav = MAIN_SCREENS.has(screen);
  const isAuth = AUTH_SCREENS.has(screen);

  const render = () => {
    switch (screen) {
      case 'splash': return <SplashScreen nav={nav} />;
      case 'onboard1': return <OnboardScreen nav={nav} step={1} />;
      case 'onboard2': return <OnboardScreen nav={nav} step={2} />;
      case 'onboard3': return <OnboardScreen nav={nav} step={3} />;
      case 'onboard4': return <OnboardScreen nav={nav} step={4} />;
      case 'onboard5': return <OnboardScreen nav={nav} step={5} />;
      case 'home': return <HomeScreen nav={nav} setSelDoc={setSelDoc} />;
      case 'docs': return <DocsScreen nav={nav} setSelDoc={setSelDoc} />;
      case 'docDetail': return <DocDetail doc={selDoc} onBack={() => nav('docs')} docs={DOCS_DATA} />;
      case 'newDoc': return <NewDocScreen onBack={() => nav('home')} onDone={() => nav('success')} />;
      case 'bank': return <BankScreen />;
      case 'taxes': return <TaxesScreen nav={nav} />;
      case 'calculator': return <CalculatorScreen onBack={() => nav('taxes')} />;
      case 'cp': return <CpScreen />;
      case 'profile': return <ProfileScreen nav={nav} />;
      case 'ai': return <AIScreen onBack={() => nav('home')} />;
      case 'analytics': return <AnalyticsScreen onBack={() => nav('home')} />;
      case 'news': return <NewsScreen onBack={() => nav('home')} />;
      case 'calendar': return <CalendarScreen onBack={() => nav('home')} />;
      case 'report200': return <SuccessScreen onDone={() => nav('taxes')} title="ФНО 200.00 заполнена" sub="Отправлена в КНП через ЭЦП · eGov Cloud · cabinet.salyk.kz" />;
      case 'success': return <SuccessScreen onDone={() => nav('home')} />;
      default: return <HomeScreen nav={nav} setSelDoc={setSelDoc} />;
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#03030a', fontFamily: "-apple-system,'SF Pro Display',system-ui,sans-serif" }}>
      {/* Anti-plagiarism watermark */}
      <div style={{ position: 'fixed', bottom: 0, right: 0, opacity: .016, fontSize: 6, color: '#fff', writingMode: 'vertical-rl', padding: '3px', letterSpacing: 2, pointerEvents: 'none', userSelect: 'none', zIndex: 9999, lineHeight: 1.2 }}>
        {'BizBook KZ © 2026 IgnisCantet.kz All Rights Reserved Unauthorized reproduction prohibited Закон РК «Об авторском праве» №6-I '.repeat(5)}
      </div>

      <div style={{ width: 375, height: 780, background: C.bg, borderRadius: 44, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 50px 160px rgba(0,0,0,.99), 0 0 0 1px rgba(255,255,255,.04)' }}>
        {!isAuth && !['ai', 'calculator', 'analytics', 'news', 'calendar', 'report200'].includes(screen) && (
          <div style={{ padding: '11px 24px 3px', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
            <span style={{ color: C.text, fontSize: 11, fontWeight: 600 }}>9:41</span>
            <span style={{ color: C.text, fontSize: 9 }}>●●●● WiFi 🔋88%</span>
          </div>
        )}

        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {render()}
        </div>

        {showNav && (
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '7px 0 14px', borderTop: `1px solid ${C.border}`, background: C.bg, flexShrink: 0 }}>
            {NAV_TABS.map(tab => (
              <button key={tab.key} onClick={() => nav(tab.key)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '0 8px' }}>
                <span style={{ fontSize: 19 }}>{tab.icon}</span>
                <span style={{ fontSize: 8, fontWeight: 600, color: screen === tab.key ? C.blue : C.dim }}>{tab.label}</span>
                {screen === tab.key && <div style={{ width: 4, height: 4, borderRadius: 2, background: C.blue }} />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
