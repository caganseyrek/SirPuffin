//Calendar elements
const calendarElement = document.getElementById("calendar");
const calendarTitle = document.getElementById("calendartitle");
const weekdayHeaders = document.getElementById("weekdays");
const smallCalendarElement = document.getElementById("smallcalendar");
//Modal elements
const modalBackground = document.getElementById("modalbackground");
const modalContainer = document.getElementById("modalcontainer");
const modalTitle = document.getElementById("modaltitle");
const modalContent = document.getElementById("modalcontent");
//Weekdays and months
const weekdaysEnglish = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const weekdaysTurkish = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//National holidays
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
	//Remove elements from previous render
	calendarElement.textContent = "";
	calendarTitle.textContent = "";
	weekdayHeaders.textContent = "";
	smallCalendarElement.textContent = "";
	const date = new Date();
	//Setup month counter
	if (currentMonthCounter !== 0) {
		date.setMonth(new Date().getMonth() + currentMonthCounter);
	}
	//Setup year counter
	if (currentYearCounter !== 0) {
		var setYear = new Date().getFullYear() + currentYearCounter;
		//Year must be between 1-9999
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
	//Get current month as string
	const currentMonth = new Date().toLocaleDateString("en-uk", { month: "long" });
	//Get current year as string
	const currentYear = new Date().toLocaleDateString("en-uk", { year: "numeric" });
	const firstDayInMonth = new Date(year, month, 1);
	const firstDayInNextMonth = new Date(year, month + 1, 1);
	//Get day count from previous month
	const daysInPrevMonth = new Date(year, month, 0).getDate();
	//Get day count from current month
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	//Get full date as string
	const dateString = firstDayInMonth.toLocaleDateString("tr-TR", {
		weekday: "long",
		year: "numeric",
		month: "numeric",
		day: "numeric"
	});
	//Get current and next month as string
	const monthString = firstDayInMonth.toLocaleDateString("en-TR", { month: "long" });
	const nextMonthString = firstDayInNextMonth.toLocaleDateString("en-TR", { month: "long" });
	//Calculate the number of padding days before the 1st of the selected month
	//by determining which day of the week the month starts.
	const paddingDays = weekdaysTurkish.indexOf(dateString.split(" ")[1]);
	//Setup calendar header / topbar
	const monthElement = document.createElement("b");
	monthElement.textContent = monthString + " ";
	const yearElement = document.createElement("span");
	yearElement.textContent = year.toString();
	calendarTitle.appendChild(monthElement);
	calendarTitle.appendChild(yearElement);
	//Setup document title
	document.title = monthString + " " + year.toString() + " - SirPuffin";
	//Setup calendars' headers
	for (let i = 0; i <= 6; i++) {
		//For main calendar
		const weekday = document.createElement("div");
		weekday.textContent = weekdaysEnglish[i].slice(0, 3);
		weekdayHeaders.appendChild(weekday);
		//For small calendar
		const scWeekday = document.createElement("div");
		scWeekday.textContent = weekdaysEnglish[i].charAt(0);
		scWeekday.classList.add("scday");
		scWeekday.classList.add("header");
		smallCalendarElement.appendChild(scWeekday);
	}
	var dayCount = 1;
	var nextMontDayCount = 1;
	//Loop each row in calendar
	for (let row = 1; row <= 6; row++) {
		//Create a row for the table
		const calendarRow = document.createElement("tr");
		//Loop each column in calendar for days
		for (let column = 1; column <= 7; column++) {
			const dayElement = document.createElement("td");
			const dayLabel = document.createElement("div");
			const dayEvents = document.createElement("div");
			const scDayElement = document.createElement("div");
			dayLabel.classList.add("daylabel");
			dayEvents.classList.add("dayevent");
			scDayElement.classList.add("scday");
			if (dayCount <= paddingDays) {
				//Check if we are rendering padding days
				//Render padding days for main calendar
				dayLabel.textContent = (daysInPrevMonth - (paddingDays - dayCount)).toString();
				dayElement.classList.add("notcurrent");
				//Render padding days for small calendar
				scDayElement.textContent = (daysInPrevMonth - (paddingDays - dayCount)).toString();
				scDayElement.classList.add("scnotcurrent");
			} else {
				//Else we are rendering current month's days
				//Render current month's days for main calendar
				dayLabel.textContent = (dayCount - paddingDays).toString();
				scDayElement.textContent = (dayCount - paddingDays).toString();
				//Add the first 3 letters of the current month's name in front of the first day
				if ((dayCount - paddingDays) === 1) {
					dayLabel.textContent = monthString.slice(0, 3) + " " + (dayCount - paddingDays);
				}
				//Highlight the current day
				if (dayCount === today && currentMonth === monthString && year.toString() === currentYear) {
					dayLabel.classList.add("today");
					scDayElement.classList.add("today");
				}
				//to-do
				dayElement.addEventListener("click", () => { console.log("test") });
			}
			//Check if dayCount went over the selected month's total days
			if (dayCount > (daysInMonth + paddingDays)) {
				//Render next month's visible days in main calendar
				dayLabel.textContent = nextMontDayCount.toString();
				//Add the first 3 letters of the next month's name in front of the next month's first day
				if (nextMontDayCount === 1) {
					dayLabel.textContent = nextMonthString.slice(0, 3) + " " + nextMontDayCount.toString();
				}
				dayElement.classList.add("notcurrent");
				//Render next month's visible days in small calendar
				scDayElement.textContent = nextMontDayCount.toString();
				scDayElement.classList.add("scnotcurrent");
				nextMontDayCount++;
			}
			dayCount++;
			//Append day label and day event to day element
			dayElement.appendChild(dayLabel);
			dayElement.appendChild(dayEvents);
			//Append day element to the calendar row
			calendarRow.appendChild(dayElement);
			//Append day element to small calendar
			smallCalendarElement.appendChild(scDayElement);
		}
		//Append the row to the main calendar
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
	//Remove previous error prompts if there is any
	const errorMessages = modalContainer.querySelectorAll("div.errorprompt");
	errorMessages.forEach(element => { modalContainer.removeChild(element); });
	//Show an error propmt if no year value is given
	if (yearInputValue.value === "") {
		const errorMessage = document.createElement("div");
		errorMessage.classList.add("errorprompt");
		errorMessage.textContent = "Invalid date. Please try again.";
		modalContainer.append(errorMessage);
		return;
	}
	//Check if the year is between 1-9999
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
	//Get the difference between current month and selected month
	var currentMonth = new Date().getMonth();
	var selectedMonthIndex = months.indexOf(monthInputValue.value) + 1;
	var monthDifference = selectedMonthIndex - (currentMonth + 1);
	//Get the difference between current year and selected year
	var currentYear = new Date().getFullYear();
	var yearDifference = yearInputValue.value - currentYear;
	//Set the month and year difference and re-render the calendar
	currentMonthCounter = monthDifference;
	currentYearCounter = yearDifference;
	renderCalendar();
	//Close the modal after re-renderin the calendar
	if (modalState) closeModal();
}
function openModal(modalType, selectedDate = null) {
	//Create the modal title element
	const currentModalTitle = document.createElement("h2");
	//Create the selection grid element for using flexbox
	const selectionGrid = document.createElement("div");
	selectionGrid.setAttribute("id", "dateselectiongrid");
	//Create the month selector dropdown
	const monthSelector = document.createElement("select");
	monthSelector.setAttribute("id", "monthdropdown");
	for (let month = 0; month < 12; month++) {
		const _year = new Date().getFullYear();
		//Get month as a string from the date
		const currentIterationMonth = new Date(_year, month).toLocaleTimeString("en-uk", { month: "long" });
		//Create an option for that month to append to selector
		const monthSelectorOption = document.createElement("option");
		monthSelectorOption.textContent = currentIterationMonth.split(" ")[0];
		monthSelector.appendChild(monthSelectorOption);
	}
	//Create the day input
	const dayInput = document.createElement("input");
	dayInput.setAttribute("type", "number");
	dayInput.setAttribute("id", "dayinput");
	dayInput.setAttribute("class", "modalinput");
	//Create the year input
	const yearInput = document.createElement("input");
	yearInput.setAttribute("type", "number");
	yearInput.setAttribute("id", "yearinput");
	yearInput.setAttribute("class", "modalinput");
	//Check modal type
	if (modalType === "settings") {
		//Setup the title for current modal
		currentModalTitle.textContent = "Settings";
		modalTitle.appendChild(currentModalTitle);
		//Create a row for a setting element
		const settingsRow = document.createElement("div");
		settingsRow.setAttribute("class", "settingsrow");
		const label = document.createElement("span");
	}
	if (modalType === "jumpToDate") {
		//Setup the title for current modal
		currentModalTitle.textContent = "Jump to Date";
		modalTitle.appendChild(currentModalTitle);
		//Set year input as current year
		yearInput.value = new Date().getFullYear();
		//Create and setup the jump action button
		const jumpButton = document.createElement("a");
		jumpButton.setAttribute("id", "jumpaction");
		jumpButton.textContent = "Jump!";
		jumpButton.addEventListener("click", () => { jumpToDate() });
		//Append all the elements to selection grid
		selectionGrid.appendChild(yearInput);
		selectionGrid.appendChild(monthSelector);
		selectionGrid.appendChild(jumpButton);
		//Append selection grid to modal content
		modalContent.appendChild(selectionGrid);
	}
	if (modalType === "newEvent") {
		currentModalTitle.textContent = "Add New Event";
		modalTitle.appendChild(currentModalTitle);
		const newEventDate = selectedDate;
		//to-d-
	}
	//Show the modal
	modalBackground.style.display = "flex";
	modalState = true;
}
function closeModal() {
	//Remove all error prompts if there is any
	const errorMessages = modalContainer.querySelectorAll("div.errorprompt");
	errorMessages.forEach(element => { modalContainer.removeChild(element); });
	//Reset each modal element's contents
	modalContent.textContent = "";
	modalTitle.textContent = "";
	modalBackground.style.display = "none";
	modalState = false;
}
function initButtons() {
	//Increase the month counter by 1 and re-render the calendar
	document.getElementById("nextbtn").addEventListener("click", () => {
		currentMonthCounter++;
		renderCalendar();
	});
	//Decrease the month counter by 1 and re-render the calendar
	document.getElementById("prevbtn").addEventListener("click", () => {
		currentMonthCounter--;
		renderCalendar();
	});
	//Set month counter 0 to return to current month and re-render the calendar
	document.getElementById("todaybtn").addEventListener("click", () => {
		currentMonthCounter = 0;
		currentYearCounter = 0;
		renderCalendar();
	});
	//Add event listeners to each button
	document.getElementById("jumpbtn").addEventListener("click", () => { openModal("jumpToDate"); });
	document.getElementById("settingsbtn").addEventListener("click", () => { openModal("settings"); });
	document.getElementById("closebtn").addEventListener("click", () => { closeModal(); });
}
function initShortcuts() {
	//Setup month counter control shortcut with right and left arrow key
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
	//Close modal when esc key pressed
	document.addEventListener("keyup", (target) => {
		if (modalState && target.key === "Escape") { closeModal(); }
	});
}
window.onload = () => {
	//Finally call the functions on window load
	renderCalendar();
	initButtons();
	initShortcuts();
	//openModal("newEvent");
}