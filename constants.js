/**
 * ╔══════════════════════════════════════════════════════╗
 * ║  BizBook KZ — Константы и данные                   ║
 * ║  © 2026 IgnisCantet.kz. Все права защищены.        ║
 * ║  Закон РК «Об авторском праве» №6-I               ║
 * ╚══════════════════════════════════════════════════════╝
 */

export const MRP = 4325;
export const MZP = 85000;
export const APP_VERSION = '1.0.0';
export const AUTHOR = 'IgnisCantet.kz';

export const CO = {
  name: 'ТОО «NOVA COMP»',
  bin: '241040014477',
  reg: '10.10.2024',
  city: 'Алматы',
  regime: 'ОУР',
  nds: true,
  address: 'г. Алматы, Турксибский р-н, мкр ЖУЛДЫЗ-2, д.35, кв.64',
  phone: '+7 705 474 1612',
  email: 'info@novacomp.kz',
  director: 'Иванов Алексей Сергеевич',
  bank: 'Halyk Bank',
  bik: 'HSBKKZKX',
  iik: 'KZ89 601A 1234 5678 9100',
  kbe: '17',
  okved: '62010',
  ndsNum: 'НДС-2024-00-123456',
};

export const EMPLOYEES = [
  { id: 1, name: 'Иванов Алексей Сергеевич', pos: 'Генеральный директор', salary: 600000, iin: '850312300145', hired: '01.11.2024', type: 'standard' },
  { id: 2, name: 'Петрова Анна Владимировна', pos: 'Менеджер по продажам', salary: 380000, iin: '920618400217', hired: '01.11.2024', type: 'standard' },
  { id: 3, name: 'Сейткали Марат Бекович', pos: 'Маркетолог', salary: 350000, iin: '950225501034', hired: '15.11.2024', type: 'standard' },
];

export const DOCS_DATA = [
  { id: 1, no: 'ЭСФ-0001', type: 'ЭСФ', dir: 'out', cp: 'ТОО «Digital Solutions»', cpBin: '200340015877', amount: 1180000, ndsAmt: 163448, date: '05.05.2026', service: 'Разработка CRM-системы', payStatus: 'paid', shipStatus: 'shipped', signed: true, linked: null },
  { id: 2, no: 'ЭАВР-0001', type: 'ЭАВР', dir: 'out', cp: 'ТОО «Digital Solutions»', cpBin: '200340015877', amount: 1180000, ndsAmt: 163448, date: '05.05.2026', service: 'Разработка CRM-системы', payStatus: 'paid', shipStatus: 'shipped', signed: true, linked: 1 },
  { id: 3, no: 'СЧ-0002', type: 'счёт', dir: 'out', cp: 'ИП Сейткалиева Г.А.', cpBin: '850101300211', amount: 250000, ndsAmt: 0, date: '07.05.2026', service: 'SEO-оптимизация сайта', payStatus: 'partial', shipStatus: 'unshipped', signed: false, linked: null },
  { id: 4, no: 'АВР-0001', type: 'АВР', dir: 'out', cp: 'ИП Сейткалиева Г.А.', cpBin: '850101300211', amount: 120000, ndsAmt: 0, date: '07.05.2026', service: 'Консультационные услуги', payStatus: 'paid', shipStatus: 'shipped', signed: true, linked: 3 },
  { id: 5, no: 'ДВР-0001', type: 'доверенность', dir: 'out', cp: 'ТОО «Digital Solutions»', cpBin: '200340015877', amount: 0, ndsAmt: 0, date: '06.05.2026', service: 'Доверенность на получение ТМЦ', payStatus: 'paid', shipStatus: 'shipped', signed: true, linked: null },
  { id: 6, no: 'НАК-0001', type: 'накладная', dir: 'out', cp: 'ТОО «Digital Solutions»', cpBin: '200340015877', amount: 340000, ndsAmt: 0, date: '06.05.2026', service: 'Компьютерное оборудование', payStatus: 'unpaid', shipStatus: 'unshipped', signed: false, linked: null },
  { id: 7, no: 'ЭСФ-ВХ-4521', type: 'ЭСФ', dir: 'in', cp: 'ТОО «КазАренда»', cpBin: '180930021455', amount: 310200, ndsAmt: 42993, date: '01.05.2026', service: 'Аренда офиса май 2026', payStatus: 'paid', shipStatus: 'shipped', signed: true, linked: null },
  { id: 8, no: 'АКТ-ВХ-0012', type: 'акт', dir: 'in', cp: 'Beeline Kazakhstan', cpBin: '970341000003', amount: 45000, ndsAmt: 0, date: '01.05.2026', service: 'Услуги связи май', payStatus: 'paid', shipStatus: 'shipped', signed: true, linked: null },
  { id: 9, no: 'ДВР-0002', type: 'доверенность', dir: 'out', cp: 'ИП Сейткалиева Г.А.', cpBin: '850101300211', amount: 0, ndsAmt: 0, date: '09.05.2026', service: 'Генеральная доверенность на представление интересов', payStatus: 'paid', shipStatus: 'shipped', signed: false, linked: null },
  { id: 10, no: 'СФ-0001', type: 'СФ', dir: 'out', cp: 'ТОО «Digital Solutions»', cpBin: '200340015877', amount: 340000, ndsAmt: 47241, date: '06.05.2026', service: 'Компьютерное оборудование HP', payStatus: 'unpaid', shipStatus: 'unshipped', signed: false, linked: 6 },
];

export const BANK_OPS = [
  { id: 1, date: '05.05.2026', desc: 'Оплата от ТОО «Digital Solutions» за CRM', amount: 1180000, type: 'in', cat: 'revenue' },
  { id: 2, date: '04.05.2026', desc: 'Выплата ЗП Иванов А.С.', amount: -503000, type: 'out', cat: 'salary' },
  { id: 3, date: '04.05.2026', desc: 'Выплата ЗП Петрова А.В.', amount: -320700, type: 'out', cat: 'salary' },
  { id: 4, date: '04.05.2026', desc: 'Выплата ЗП Сейткали М.Б.', amount: -295000, type: 'out', cat: 'salary' },
  { id: 5, date: '05.05.2026', desc: 'Налоги: ИПН + СН за Q1 2026', amount: -158000, type: 'out', cat: 'tax' },
  { id: 6, date: '05.05.2026', desc: 'Соцплатежи: ОПВ+СО+ОСМС+ОПВР', amount: -212000, type: 'out', cat: 'tax' },
  { id: 7, date: '01.05.2026', desc: 'Аренда офиса (ТОО «КазАренда»)', amount: -310200, type: 'out', cat: 'expense' },
  { id: 8, date: '07.05.2026', desc: 'Частичная оплата ИП Сейткалиева', amount: 125000, type: 'in', cat: 'revenue' },
  { id: 9, date: '08.05.2026', desc: 'Услуги связи Beeline', amount: -45000, type: 'out', cat: 'expense' },
  { id: 10, date: '09.05.2026', desc: 'Оплата за SEO ИП Сейткалиева (аванс)', amount: 100000, type: 'in', cat: 'revenue' },
];

export const COUNTERPARTIES = [
  { id: 1, name: 'ТОО «Digital Solutions»', bin: '200340015877', type: 'client', contact: 'Ержан Омаров', phone: '+7 701 234 56 78', email: 'e.omarov@dsol.kz', nds: true, status: 'active' },
  { id: 2, name: 'ИП Сейткалиева Г.А.', bin: '850101300211', type: 'client', contact: 'Гүлнар Сейткалиева', phone: '+7 702 345 67 89', email: 'gulnar@mail.ru', nds: false, status: 'active' },
  { id: 3, name: 'ТОО «КазАренда»', bin: '180930021455', type: 'supplier', contact: 'Бекзат Нуров', phone: '+7 707 456 78 90', email: 'b.nurov@kazarenda.kz', nds: true, status: 'active' },
  { id: 4, name: 'Beeline Kazakhstan', bin: '970341000003', type: 'supplier', contact: 'B2B поддержка', phone: '0611', email: 'b2b@beeline.kz', nds: true, status: 'active' },
];

export const TAXES_DATA = [
  { code: 'КПН', name: 'Корпоративный подоходный налог', rate: '20%', form: 'ФНО 100.00', period: 'Раз в год', deadline: '10 апр 2027', status: 'planned', amount: null, note: 'Авансы ежемесячно до 25 числа' },
  { code: 'НДС', name: 'Налог на добавленную стоимость', rate: '16%', form: 'ФНО 300.00', period: 'Квартально', deadline: '15 мая 2026', status: 'urgent', amount: 120690, note: 'Порог: 10 000 МРП = 43.25 млн ₸' },
  { code: 'ИПН', name: 'Индив. подоходный налог (ФОТ)', rate: '10/15%', form: 'ФНО 200.00', period: 'Квартально', deadline: '15 мая 2026', status: 'urgent', amount: 130000, note: 'Прогрессивная ставка > 230 000 МРП' },
  { code: 'СН', name: 'Социальный налог', rate: '6%', form: 'ФНО 200.00', period: 'Квартально', deadline: '15 мая 2026', status: 'urgent', amount: 78900, note: 'Снижен с 11% до 6% с 2026' },
  { code: 'ОПВ', name: 'Обяз. пенсионные взносы', rate: '10%', form: 'ФНО 200.00', period: 'Ежемесячно', deadline: '25 мая 2026', status: 'pending', amount: 133000, note: 'Макс. база: 50 МЗП = 4 250 000 ₸' },
  { code: 'ОПВР', name: 'ОПВ работодателя', rate: '3.5%', form: 'ФНО 200.00', period: 'Ежемесячно', deadline: '25 мая 2026', status: 'pending', amount: 46550, note: '↑ Повышен с 2.5% до 3.5% с 2026!' },
  { code: 'СО', name: 'Социальные отчисления', rate: '5%', form: 'ФНО 200.00', period: 'Ежемесячно', deadline: '25 мая 2026', status: 'pending', amount: 32500, note: 'Макс 7 МЗП · мин 1 МЗП' },
  { code: 'ВОСМС', name: 'Взносы ОСМС (работодатель)', rate: '2%', form: 'ФНО 200.00', period: 'Ежемесячно', deadline: '25 мая 2026', status: 'pending', amount: 26600, note: 'Работник дополнительно 2%' },
];

export const TAX_CALENDAR = [
  { date: '15 мая', month: 5, items: ['ФНО 200.00 (ИПН+СН за Q1)', 'ФНО 300.00 (НДС за Q1)'], urgent: true, amount: 329590 },
  { date: '25 мая', month: 5, items: ['ОПВ за апрель', 'ОПВР за апрель', 'СО+ВОСМС за апрель'], urgent: true, amount: 238650 },
  { date: '25 июня', month: 6, items: ['КПН авансовый платёж за май', 'ОПВ+СО+ОСМС за май'], urgent: false, amount: 180000 },
  { date: '15 авг', month: 8, items: ['ФНО 200.00 за Q2', 'ФНО 300.00 за Q2'], urgent: false, amount: null },
  { date: '25 авг', month: 8, items: ['КПН авансы июль', 'ОПВ+СО+ОСМС июль'], urgent: false, amount: null },
  { date: '15 ноя', month: 11, items: ['ФНО 200.00 за Q3', 'ФНО 300.00 за Q3'], urgent: false, amount: null },
];

export const NEWS_DATA = [
  { id: 1, date: '12.05.2026', tag: 'НК РК', title: 'ОПВР вырос до 3.5% — важно для расчёта ФОТ', text: 'С 1 января 2026 ставка ОПВР увеличена с 2.5% до 3.5%. Расходы бизнеса на ФОТ выросли.', hot: true },
  { id: 2, date: '10.05.2026', tag: 'НДС', title: 'Порог НДС снижен до 43.25 млн ₸', text: 'Новый порог: 10 000 МРП = 43 250 000 ₸. Следите за оборотом — может потребоваться постановка на учёт.', hot: true },
  { id: 3, date: '05.05.2026', tag: 'ЭСФ', title: 'ЭСФ обязательны для всех ИП на упрощёнке', text: 'С 2026 ИП на СНР обязаны выписывать ЭСФ по каждой сделке (пп.7 п.1 ст.208 НК).', hot: true },
  { id: 4, date: '01.05.2026', tag: 'СН', title: 'Социальный налог снижен до 6% (был 11%)', text: 'Значительное снижение ставки СН для ОУР. ОПВР выросло — итоговая нагрузка изменилась.', hot: false },
  { id: 5, date: '25.04.2026', tag: 'СНР', title: 'СНР сокращены с 7 до 3 режимов', text: 'Остались: упрощённая декларация (4%), самозанятые, КФХ. Патент и розничный налог упразднены.', hot: false },
];

export const DocColor = {
  'ЭСФ': '#f59e0b', 'ЭАВР': '#06b6d4', 'АВР': '#22c55e',
  'акт': '#22c55e', 'счёт': '#3b82f6', 'доверенность': '#a855f7',
  'накладная': '#64748b', 'СФ': '#f59e0b', 'договор': '#ec4899',
};
export const DocIcon = {
  'ЭСФ': '🧾', 'ЭАВР': '📋', 'АВР': '✅', 'акт': '✅',
  'счёт': '📄', 'доверенность': '📜', 'накладная': '📦', 'СФ': '🗂', 'договор': '📑',
};

// Salary calculator НК РК 2026
export function calcSalary(gross, empType = 'standard') {
  const isPensioner = empType === 'pensioner';
  const isStudent = empType === 'student';
  const isDisabled = empType === 'disabled';
  const isNonresident = empType === 'nonresident';

  const opvRate = (isPensioner || isNonresident) ? 0 : 0.10;
  const opvBase = Math.min(gross, 50 * MZP);
  const opv = Math.round(opvBase * opvRate);

  const vosms = isStudent ? 0 : isPensioner ? 0 : Math.round(gross * 0.02);

  const stdDeduction = 30 * MRP; // 129 750 ₸
  const disabledDeduction = isDisabled ? 882 * MRP : 0;
  const ipnRate = isNonresident ? 0.20 : 0.10;
  const ipnBase = isNonresident
    ? Math.max(0, gross)
    : Math.max(0, gross - opv - vosms - stdDeduction - disabledDeduction);
  const ipn = Math.round(ipnBase * ipnRate);

  const net = gross - opv - vosms - ipn;

  const opvrBase = Math.min(gross, 50 * MZP);
  const opvr = isPensioner ? 0 : Math.round(opvrBase * 0.035);
  const soBase = Math.min(Math.max(gross - opv, MZP), 7 * MZP);
  const so = isPensioner ? 0 : Math.round(soBase * 0.05);
  const sn = Math.max(0, Math.round(gross * 0.06) - so);
  const vosmsEmp = Math.round(gross * 0.02);
  const totalCost = gross + opvr + so + sn + vosmsEmp;

  return { gross, opv, vosms, ipn, net, opvr, so, sn, vosmsEmp, totalCost, empType };
}
