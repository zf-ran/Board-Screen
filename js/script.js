const LOCALE = 'id-ID';
const dateLocale = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'full' });
const weekdayLocale = new Intl.DateTimeFormat(LOCALE, { weekday: 'long' });

//* TIMETABLE
/**
 * @typedef {Object} Period - A *row* of a timetable.
 * @property {string} subject
 * @property {string} start - The start time in `HH:MM` format.
 *
 * @typedef {Period[]} Schedule
 * @typedef {Object<string, Period[]>} Schedules
 */

/**
 * @type {Schedules}
 */
const schedules = {
	Senin: [
		{ subject: 'SKI', start: '07:30' },
		{ subject: 'Biologi', start: '08:10' },
		{ subject: 'Sosiologi', start: '08:50' },
		{ subject: 'Fisika', start: '09:30' },
		{ subject: 'BMR', start: '10:10' },
		{ subject: 'Salat Duha', start: '10:50' }
	],
	Selasa: [
		{ subject: 'Al-Qur\'an Hadis', start: '07:30' },
		{ subject: 'Geografi', start: '08:10' },
		{ subject: 'Fikih', start: '08:50' },
		{ subject: 'Pendidikan Pancasila', start: '09:30' },
		{ subject: 'Matematika', start: '10:10' },
		{ subject: 'Salat Duha', start: '11:10' }
	],
	Rabu: [
		{ subject: 'Akidah Akhlak', start: '07:30' },
		{ subject: 'Sejarah', start: '08:10' },
		{ subject: 'Bahasa Indonesia', start: '08:50' },
		{ subject: 'Informatika', start: '09:50' },
		{ subject: 'Ekonomi', start: '10:30' },
		{ subject: 'Salat Duha', start: '11:10' }
	],
	Kamis: [
		{ subject: 'Seni Budaya', start: '07:30' },
		{ subject: 'PJOK', start: '08:10' },
		{ subject: 'Kimia', start: '08:50' },
		{ subject: 'BK', start: '09:30' },
		{ subject: 'Bahasa Arab', start: '09:50' },
		{ subject: 'Salat Duha', start: '11:10' }
	],
	Jumat: [
		{ subject: 'Bahasa Inggris', start: '07:30' },
		{ subject: 'Kokurikuler', start: '08:30' },
		{ subject: 'Olimpiade', start: '09:30' },
		{ subject: 'Salat Duha', start: '10:50' }
	]
};

const timetableElement = document.getElementById('timetable');
const alertElement = document.getElementById('alert');

//- Initialize
const weekday = weekdayLocale.format(new Date());

if (schedules[weekday]) {
	for (const period of schedules[weekday]) {
		const timerow = new ElementBuilder('div')
			.classes(['timerow'])
			.id(`subject-${period.subject}`)
			.appendTo(timetableElement);

		new ElementBuilder('span')
			.classes(['start'])
			.text(period.start)
			.appendTo(timerow);

		new ElementBuilder('span')
			.classes(['subject'])
			.text(period.subject)
			.appendTo(timerow);
	}
}

//- Refresh
let lastPeriod = getCurrentPeriod();
refreshTimetable();

/** Timetable refresh rate in **milliseconds**. @type {number} */
const TIMETABLE_INTERVAL = 60 * 1_000;

/** Time for alert to disappear in **milliseconds**. @type {number} */
const ALERT_DISMISS = 60 * 1_000;

setInterval(() => {
	const currentPeriod = getCurrentPeriod();

	if (currentPeriod.subject == lastPeriod.subject)
		return;

	alertElement.innerHTML = `!⃝ ${currentPeriod.subject}`;

	setTimeout(() => {
		alertElement.innerHTML = '';
	}, ALERT_DISMISS)

	lastPeriod = currentPeriod;
	refreshTimetable();
}, TIMETABLE_INTERVAL);

function refreshTimetable() {
	const timerowElements = document.getElementsByClassName('timerow');

	for (const timerow of timerowElements) {
		if (timerow.id != `subject-${lastPeriod.subject}`)
			timerow.classList.remove('now');
		else
			timerow.classList.add('now');
	}
}

/** @returns {Period} */
function getCurrentPeriod() {
	const date = new Date();
	const hours = twoDigit(date.getHours());
	const minutes = twoDigit(date.getMinutes());
	const time = `${hours}:${minutes}`;

	const todaySchedule = schedules[weekday];
	if (!todaySchedule)
		return null;

	for (let i = todaySchedule.length - 1; i >= 0; i--) {
		const period = todaySchedule[i];

		if (time >= period.start)
			return period;
	}
}

//* DATE AND TIME
const dateElement = document.getElementById('date');
const hourMinuteElement = document.getElementById('hour-minute');
const secondElement = document.getElementById('second');

dateElement.innerHTML = dateLocale.format(new Date());

/** Clock refresh rate in **milliseconds**. @type {number} */
const CLOCK_INTERVAL = 1_000;

setInterval(() => {
	const date = new Date();

	const hours = twoDigit(date.getHours());
	const minutes = twoDigit(date.getMinutes());
	const seconds = twoDigit(date.getSeconds());

	hourMinuteElement.innerHTML = `${hours}:${minutes}`;
	secondElement.innerHTML = `:${seconds}`;
}, CLOCK_INTERVAL);

/** 
 * Convert a number to always two digits by leading zero.
 * @param {number} number - Number to convert.
 * @returns {string}
 */
function twoDigit(number) {
	return number.toString().padStart(2, '0');
}