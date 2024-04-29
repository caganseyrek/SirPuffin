import saveSettings from "./data/datamanager";

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

//Weekdays and months in English and Turkish
const weekdaysEnglish = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const weekdaysTurkish = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

//Counter for moving forward or backward in calendar
var currentMonthCounter = 0;
var currentYearCounter = 0;

//For closing modal when esc key pressed
var modalState = false;

function renderCalendar() {
	//Remove the elements in calendar if they exist
	calendarElement.textContent = "";
	calendarTitle.textContent = "";
	weekdayHeaders.textContent = "";
	smallCalendarElement.textContent = "";

	//Get the date
	const date = new Date();

	//Check if the user moved the calendar to previous or next months
	if (currentMonthCounter !== 0) {
		date.setMonth(new Date().getMonth() + currentMonthCounter);
	}

	//Check if the user moved the calendar to previous or next years
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

	//Get the month and year based on the date we got before
	const month = date.getMonth(); //months start at 0
	const year = date.getFullYear();

	//These variables are for checking current day
	const today = date.getDate();
	const currentMonth = new Date().toLocaleDateString("en-uk", { month: "long" });
	const currentYear = new Date().toLocaleDateString("en-uk", { year: "numeric" });

	//Get first days in selected month and next month
	const firstDayInMonth = new Date(year, month, 1);
	const firstDayInNextMonth = new Date(year, month + 1, 1);

	//Get number of days in selected month and next month
	const daysInPrevMonth = new Date(year, month, 0).getDate();
	const daysInMonth = new Date(year, month + 1, 0).getDate();

	//Get date as a string with format options
	const dateString = firstDayInMonth.toLocaleDateString("tr-TR", {
		weekday: "long",
		year: "numeric",
		month: "numeric",
		day: "numeric"
	});

	//Get selected month's and next month's names
	const monthString = firstDayInMonth.toLocaleDateString("en-TR", { month: "long" });
	const nextMonthString = firstDayInNextMonth.toLocaleDateString("en-TR", { month: "long" });

	//Calculate the number of padding days before the 1st of the selected month
	//by determining which day of the week the month starts.
	const paddingDays = weekdaysTurkish.indexOf(dateString.split(" ")[1]);

	//Setup calendar title that shows selected month and year
	const monthElement = document.createElement("b");
	monthElement.textContent = monthString + " ";

	const yearElement = document.createElement("span");
	yearElement.textContent = year.toString();

	calendarTitle.appendChild(monthElement);
	calendarTitle.appendChild(yearElement);

	//Setup the page title
	document.title = monthString + " " + year.toString() + " - SirPuffin";

	//Render weekday headers in calendars
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

	//Loop each row in calendar
	var dayCount = 1;
	var nextMontDayCount = 1;
	for (let row = 1; row <= 6; row++) {
		//Create a table row
		const calendarRow = document.createElement("tr");

		//Loop each column (day) in calendar
		for (let column = 1; column <= 7; column++) {
			//Create a td element for day, day label and day events
			const dayElement = document.createElement("td");
			const dayLabel = document.createElement("div");
			const dayEvents = document.createElement("div");

			//Create a day element for the small calendar
			const scDayElement = document.createElement("div");

			//Add classes to day label and day events
			dayLabel.classList.add("daylabel");
			dayEvents.classList.add("dayevent");

			scDayElement.classList.add("scday");

			if (dayCount <= paddingDays) {
				//Check if we are rendering padding days
				//Render padding days in main calendar
				dayLabel.textContent = (daysInPrevMonth - (paddingDays - dayCount)).toString();
				dayElement.classList.add("notcurrent");

				//Render padding days in small calendar
				scDayElement.textContent = (daysInPrevMonth - (paddingDays - dayCount)).toString();
				scDayElement.classList.add("scnotcurrent");
			} else {
				//Else we are rendering selected month's days
				//Render selected month's days in main calendar
				dayLabel.textContent = (dayCount - paddingDays).toString();

				//Add the first 3 letters of the selected month's name in front of the first day 
				if ((dayCount - paddingDays) === 1) {
					dayLabel.textContent = monthString.slice(0, 3) + " " + (dayCount - paddingDays);
				}

				//Render selected month's days in small calendar
				scDayElement.textContent = (dayCount - paddingDays).toString();

				//Highlight the current day
				if (dayCount === today && currentMonth === monthString && year.toString() === currentYear) {
					dayLabel.classList.add("today");
					scDayElement.classList.add("today");
				}

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

			//Append day label and day events to day element
			dayElement.appendChild(dayLabel);
			dayElement.appendChild(dayEvents);

			//Append day element to the row
			calendarRow.appendChild(dayElement);

			//Append day element to small calendar
			smallCalendarElement.appendChild(scDayElement);
		}

		//Append the row to the main calendar elements
		calendarElement.appendChild(calendarRow);
		
		//Render events
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

	//Close the modal if it is open
	if (modalState) closeModal();
}

//Prepare the modal
function openModal(modalType, selectedDate = null) { //Selected date will be for creating events
	//Create the modal title
	const currentModalTitle = document.createElement("h2");

	//Create an element for using flexbox
	const selectionGrid = document.createElement("div");
	selectionGrid.setAttribute("id", "dateselectiongrid");
	selectionGrid.appendChild(monthSelector);

	//Create the month selector dropdown
	const monthSelector = document.createElement("select");
	monthSelector.setAttribute("id", "monthdropdown");
	//Loop 12 times for 12 months
	for (let month = 0; month < 12; month++) {
		//Get current year
		const _year = new Date().getFullYear();
		//Get month as a string from the date
		const currentIterationMonth = new Date(_year, month).toLocaleTimeString("en-uk", { month: "long" });
		//Create an option for that month to append to selector
		const monthSelectorOption = document.createElement("option");
		monthSelectorOption.textContent = currentIterationMonth.split(" ")[0];
		//Append the month option to selector
		monthSelector.appendChild(monthSelectorOption);
	}

	//Create the year input
	const yearInput = document.createElement("input");
	yearInput.setAttribute("type", "number");
	yearInput.setAttribute("id", "yearinput");
	yearInput.setAttribute("class", "modalinput");
	yearInput.value = new Date().getFullYear();
	selectionGrid.appendChild(yearInput);

	if (modalType === "settings") {
		//Setup and append the title
		currentModalTitle.textContent = "Settings";
		modalTitle.appendChild(currentModalTitle);
	}

	if (modalType === "jumpToDate") {
		//Setup and append the title
		currentModalTitle.textContent = "Jump to Date";
		modalTitle.appendChild(currentModalTitle);

		//Create the jump button 
		const jumpButton = document.createElement("a");
		jumpButton.setAttribute("id", "jumpaction");
		jumpButton.textContent = "Jump!";
		jumpButton.addEventListener("click", () => { jumpToDate() });
		selectionGrid.appendChild(jumpButton);

		//Append the grid to the modal-content element
		modalContent.appendChild(selectionGrid);
	}

	if (modalType === "newEvent" || modalType === "viewEvent") {
		const newEventDate = selectedDate;

		//Create an element for using flexbox
		const selectionGrid = document.createElement("div");
		selectionGrid.setAttribute("id", "dateselectiongrid");

		//Create the year input
		const startDate = document.createElement("input");
		startDate.setAttribute("type", "number");
		startDate.setAttribute("id", "startdate");
		startDate.setAttribute("class", "modalinput");
		startDate.value = new Date().getFullYear();
		selectionGrid.appendChild(startDate);

		//Create the month selector dropdown
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

	//Show the modal background
	modalBackground.style.display = "flex";

	// -> new event modal
	//view event modal
}

//Remove all elements and error prompts from modal-content element
function closeModal() {
	//Remove all error prompts if there is any
	const errorMessages = modalContainer.querySelectorAll("div.errorprompt");
	errorMessages.forEach(element => { modalContainer.removeChild(element); });

	//Reset the contents
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

	//Open jump modal
	document.getElementById("jumpbtn").addEventListener("click", () => { openModal("jumpToDate"); });
	
	//Open settings modal
	document.getElementById("settingsbtn").addEventListener("click", () => { openModal("settings"); });

	//Close button in modal
	document.getElementById("closebtn").addEventListener("click", () => { closeModal(); });
}

function initShortcuts() {
	//Month counter controls with right and left arrow key
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
		if (modalState && target.key === "Escape") {
			closeModal();
		}
	});
}

//Finally call the functions on window load
window.onload = () => {
	renderCalendar();
	initButtons();
	initShortcuts();
	//openModal("newEvent");
}