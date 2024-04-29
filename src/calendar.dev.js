const calendarElement = document.getElementById("calendar");
const calendarTitle = document.getElementById("calendartitle");
const weekdayHeaders = document.getElementById("weekdays");
const smallCalendarElement = document.getElementById("smallcalendar");
const modalBackground = document.getElementById("modalbackground");
const modalContainer = document.getElementById("modalcontainer");
const modalTitle = document.getElementById("modaltitle");
const modalContent = document.getElementById("modalcontent");
const weekdaysEnglish = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const weekdaysTurkish = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const holidays_de = [
	{ "title": "Yew Year's Day", "date": "1 January" },
	{ "title": "Epiphany", "date": "6 January" },
	{ "title": "Labour Day", "date": "1 May" },
	{ "title": "Assumption Day", "date": "15 August" },
	{ "title": "World Children's Day", "date": "20 September" },
	{ "title": "German Unity Day", "date": "3 October" },
	{ "title": "Reformation Day", "date": "31 October" },
	{ "title": "All Saint's Day", "date": "1 November" },
	{ "title": "Christmas Day", "date": "25 December" },
	{ "title": "Second Day of Christmas", "date": "26 December" }
];
const holidays_tr = [
	{ "title": "Yew Year's Day", "date": "1 January" },
	{ "title": "National Sovereignity and Children's Day", "date": "23 April" },
	{ "title": "Labour and Solidarity Day", "date": "1 May" },
	{ "title": "Commemoration of Atatürk, Youth and Sports Day", "date": "19 May" },
	{ "title": "Victory Day", "date": "30 August" },
	{ "title": "Republic Day", "date": "29 October" }
];
var currentMonthCounter = 0;
var currentYearCounter = 0;
var modalState = false;
function renderCalendar() {
	calendarElement.textContent = "";
	calendarTitle.textContent = "";
	weekdayHeaders.textContent = "";
	smallCalendarElement.textContent = "";
	const date = new Date();
	if (currentMonthCounter !== 0) {
		date.setMonth(new Date().getMonth() + currentMonthCounter);
	}
	if (currentYearCounter !== 0) {
		var setYear = new Date().getFullYear() + currentYearCounter;
		if (setYear < 1) {
			setYear = 1;
		} else if (setYear > 9999) {
			setYear = 9999;
		} else {
			date.setFullYear(setYear);
		}
	}
	const month = date.getMonth();
	const year = date.getFullYear();
	const today = date.getDate();
	const currentMonth = new Date().toLocaleDateString("en-uk", { month: "long" });
	const currentYear = new Date().toLocaleDateString("en-uk", { year: "numeric" });
	const firstDayInMonth = new Date(year, month, 1);
	const firstDayInNextMonth = new Date(year, month + 1, 1);
	const daysInPrevMonth = new Date(year, month, 0).getDate();
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const dateString = firstDayInMonth.toLocaleDateString("tr-TR", {
		weekday: "long",
		year: "numeric",
		month: "numeric",
		day: "numeric"
	});
	const monthString = firstDayInMonth.toLocaleDateString("en-TR", { month: "long" });
	const nextMonthString = firstDayInNextMonth.toLocaleDateString("en-TR", { month: "long" });
	const paddingDays = weekdaysTurkish.indexOf(dateString.split(" ")[1]);
	const monthElement = document.createElement("b");
	monthElement.textContent = monthString + " ";
	const yearElement = document.createElement("span");
	yearElement.textContent = year.toString();
	calendarTitle.appendChild(monthElement);
	calendarTitle.appendChild(yearElement);
	document.title = monthString + " " + year.toString() + " - SirPuffin";
	for (let i = 0; i <= 6; i++) {
		const weekday = document.createElement("div");
		weekday.textContent = weekdaysEnglish[i].slice(0, 3);
		weekdayHeaders.appendChild(weekday);
		const scWeekday = document.createElement("div");
		scWeekday.textContent = weekdaysEnglish[i].charAt(0);
		scWeekday.classList.add("scday");
		scWeekday.classList.add("header");
		smallCalendarElement.appendChild(scWeekday);
	}
	var dayCount = 1;
	var nextMontDayCount = 1;
	for (let row = 1; row <= 6; row++) {
		const calendarRow = document.createElement("tr");
		for (let column = 1; column <= 7; column++) {
			const dayElement = document.createElement("td");
			const dayLabel = document.createElement("div");
			const dayEvents = document.createElement("div");
			const scDayElement = document.createElement("div");
			dayLabel.classList.add("daylabel");
			dayEvents.classList.add("dayevent");
			scDayElement.classList.add("scday");
			if (dayCount <= paddingDays) {
				dayLabel.textContent = (daysInPrevMonth - (paddingDays - dayCount)).toString();
				dayElement.classList.add("notcurrent");
				scDayElement.textContent = (daysInPrevMonth - (paddingDays - dayCount)).toString();
				scDayElement.classList.add("scnotcurrent");
			} else {
				dayLabel.textContent = (dayCount - paddingDays).toString();
				if ((dayCount - paddingDays) === 1) {
					dayLabel.textContent = monthString.slice(0, 3) + " " + (dayCount - paddingDays);
				}
				scDayElement.textContent = (dayCount - paddingDays).toString();
				if (dayCount === today && currentMonth === monthString && year.toString() === currentYear) {
					dayLabel.classList.add("today");
					scDayElement.classList.add("today");
				}
				dayElement.addEventListener("click", () => { console.log("test") });
			}
			if (dayCount > (daysInMonth + paddingDays)) {
				dayLabel.textContent = nextMontDayCount.toString();
				if (nextMontDayCount === 1) {
					dayLabel.textContent = nextMonthString.slice(0, 3) + " " + nextMontDayCount.toString();
				}
				dayElement.classList.add("notcurrent");
				scDayElement.textContent = nextMontDayCount.toString();
				scDayElement.classList.add("scnotcurrent");
				nextMontDayCount++;
			}
			dayCount++;
			dayElement.appendChild(dayLabel);
			dayElement.appendChild(dayEvents);
			calendarRow.appendChild(dayElement);
			smallCalendarElement.appendChild(scDayElement);
		}
		calendarElement.appendChild(calendarRow);
		renderEvents();
	}
}
function renderEvents() {
	// to-do
}
function jumpToDate() {
	const yearInputValue = document.getElementById("yearinput");
	const monthInputValue = document.getElementById("monthdropdown");
	const errorMessages = modalContainer.querySelectorAll("div.errorprompt");
	errorMessages.forEach(element => { modalContainer.removeChild(element); });
	if (yearInputValue.value === "") {
		const errorMessage = document.createElement("div");
		errorMessage.classList.add("errorprompt");
		errorMessage.textContent = "Invalid date. Please try again.";
		modalContainer.append(errorMessage);
		return;
	}
	if (yearInputValue.value < 1 || yearInputValue.value > 9999) {
		const errorMessage = document.createElement("div");
		errorMessage.classList.add("errorprompt");
		errorMessage.textContent = "The year must be between 1-9999. Please try again.";
		modalContainer.append(errorMessage);
		if (yearInputValue.value < 1) {
			yearInputValue.value = 1;
		} else if (yearInputValue > 9999) {
			yearInputValue.value = 9999;
		}
		return;
	}
	var currentMonth = new Date().getMonth();
	var selectedMonthIndex = months.indexOf(monthInputValue.value) + 1;
	var monthDifference = selectedMonthIndex - (currentMonth + 1);
	var currentYear = new Date().getFullYear();
	var yearDifference = yearInputValue.value - currentYear;
	currentMonthCounter = monthDifference;
	currentYearCounter = yearDifference;
	renderCalendar();
	if (modalState) closeModal();
}
function openModal(modalType, selectedDate = null) {
	const currentModalTitle = document.createElement("h2");
	const selectionGrid = document.createElement("div");
	selectionGrid.setAttribute("id", "dateselectiongrid");
	const monthSelector = document.createElement("select");
	monthSelector.setAttribute("id", "monthdropdown");
	for (let month = 0; month < 12; month++) {
		const _year = new Date().getFullYear();
		const currentIterationMonth = new Date(_year, month).toLocaleTimeString("en-uk", { month: "long" });
		const monthSelectorOption = document.createElement("option");
		monthSelectorOption.textContent = currentIterationMonth.split(" ")[0];
		monthSelector.appendChild(monthSelectorOption);
	}
	const yearInput = document.createElement("input");
	yearInput.setAttribute("type", "number");
	yearInput.setAttribute("id", "yearinput");
	yearInput.setAttribute("class", "modalinput");
	if (modalType === "settings") {
		currentModalTitle.textContent = "Settings";
		modalTitle.appendChild(currentModalTitle);
		const settingsRow = document.createElement("div");
		settingsRow.setAttribute("class", "settingsrow");
		const label = document.createElement("span");
	}
	if (modalType === "jumpToDate") {
		yearInput.value = new Date().getFullYear();
		currentModalTitle.textContent = "Jump to Date";
		modalTitle.appendChild(currentModalTitle);
		const jumpButton = document.createElement("a");
		jumpButton.setAttribute("id", "jumpaction");
		jumpButton.textContent = "Jump!";
		jumpButton.addEventListener("click", () => { jumpToDate() });
		selectionGrid.appendChild(jumpButton);
		selectionGrid.appendChild(yearInput);
		selectionGrid.appendChild(monthSelector);
		modalContent.appendChild(selectionGrid);
	}
	if (modalType === "newEvent" || modalType === "viewEvent") {
		const newEventDate = selectedDate;
		const selectionGrid = document.createElement("div");
		selectionGrid.setAttribute("id", "dateselectiongrid");
		const monthSelector = document.createElement("select");
		monthSelector.setAttribute("id", "monthdropdown");
		selectionGrid.appendChild(monthSelector);
		switch (modalType) {
			case "newEvent":
				currentModalTitle.textContent = "Add New Event";
				modalTitle.appendChild(currentModalTitle);
				break;
			case "viewEvent":
				currentModalTitle.textContent = "Event Details";
				modalTitle.appendChild(currentModalTitle);
				break;
		}
	}
	modalState = true;
	modalBackground.style.display = "flex";
	// -> new event modal
	//view event modal
}
function closeModal() {
	const errorMessages = modalContainer.querySelectorAll("div.errorprompt");
	errorMessages.forEach(element => { modalContainer.removeChild(element); });
	modalContent.textContent = "";
	modalTitle.textContent = "";
	modalBackground.style.display = "none";
	modalState = false;
}
function initButtons() {
	document.getElementById("nextbtn").addEventListener("click", () => {
		currentMonthCounter++;
		renderCalendar();
	});
	document.getElementById("prevbtn").addEventListener("click", () => {
		currentMonthCounter--;
		renderCalendar();
	});
	document.getElementById("todaybtn").addEventListener("click", () => {
		currentMonthCounter = 0;
		currentYearCounter = 0;
		renderCalendar();
	});
	document.getElementById("jumpbtn").addEventListener("click", () => { openModal("jumpToDate"); });
	document.getElementById("settingsbtn").addEventListener("click", () => { openModal("settings"); });
	document.getElementById("closebtn").addEventListener("click", () => { closeModal(); });
}
function initShortcuts() {
	document.addEventListener("keydown", (target) => {
		switch (target.key) {
			case "ArrowLeft":
				currentMonthCounter--;
				renderCalendar();
				break;
			case "ArrowRight":
				currentMonthCounter++;
				renderCalendar();
				break;
		}
	});
	document.addEventListener("keyup", (target) => {
		if (modalState && target.key === "Escape") {
			closeModal();
		}
	});
}
window.onload = () => {
	renderCalendar();
	initButtons();
	initShortcuts();
	//openModal("newEvent");
}