//Get all the elements needed
const calendarElement = document.getElementById("calendar");
const calendarTitle = document.getElementById("calendar-title");
const weekdayHeaders = document.getElementById("weekdays");
const smallCalendarElement = document.getElementById("smallcalendar");

//Weekdays in English and Turkish
const weekdaysEnglish = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const weekdaysTurkish = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

//Counter for moving forward or backward in calendar
var currentMonthCounter = 0;
var currentYearCounter = 0;

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
		date.setFullYear(new Date().getFullYear() + currentYearCounter);
	}

	//Get the month and year based on the date we got before
	const month = date.getMonth(); //months start at 0
	const year = date.getFullYear();

	//These variables are for checking current day
	const today = date.getDate();
	const currentMonth = new Date().toLocaleDateString("en-uk", { month: "long" })
	const currentYear = new Date().toLocaleDateString("en-uk", { year: "numeric" })

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
		scWeekday.classList.add("sc-day");
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
			dayLabel.classList.add("day-label");
			dayEvents.classList.add("day-event");

			scDayElement.classList.add("sc-day");
			
			if (dayCount <= paddingDays) {
				//Check if we are rendering padding days
				//Render padding days in main calendar
				dayLabel.textContent = (daysInPrevMonth - (paddingDays - dayCount)).toString();
				dayElement.classList.add("notcurrent");
				
				//Render padding days in small calendar
				scDayElement.textContent = (daysInPrevMonth - (paddingDays - dayCount)).toString();
				scDayElement.classList.add("sc-notcurrent");
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
				scDayElement.classList.add("sc-notcurrent");
				
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
	}
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
		renderCalendar();
	});
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
}

function openModal(modalType, selectedDate = null) {
	//new event modal
	//jump to date modal
	//view event modal
}

//Finally call the functions on window load
window.onload = () => {
	renderCalendar();
	initButtons();
	initShortcuts();
}