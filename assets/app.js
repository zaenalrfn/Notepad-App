let noteArr = [];
const noteEvent = 'NOTE_EVENT';
document.addEventListener('DOMContentLoaded', function(){
	const noteForm = document.getElementById('noteForm');
	noteForm.addEventListener('submit', function(e) {
		e.preventDefault();
		addNote();
		noteForm.reset();
	});
	generateClock();
	textAreaRisize();
});

function textAreaRisize() {
	const textArea = document.querySelectorAll("textarea.form-control");
	for(const areaSize of textArea) {
		areaSize.addEventListener('input', function() {
			this.style.height = "auto";
			this.style.height = this.scrollHeight + "px"
		})
	}
}

function addNote() {
	const noteInputTitle = document.getElementById('noteInputTitle').value;
	const noteInputCatatan = document.getElementById("noteInputCatatan").value;
	const noteId = +new Date();
	const noteClock = generateClock();
	const noteDay = generateDay();
	const noteObject = generateNoteObject(noteId, noteInputTitle, noteInputCatatan, noteClock, noteDay);

	noteArr.push(noteObject);
	document.dispatchEvent(new Event(noteEvent));
}

function generateNoteObject(id, title, note, clock, days) {
	return {id, title, note, clock, days}
}

function generateClock() {
	const noteClock = document.getElementById('noteClock');
	const date = new Date()
	let h = date.getHours()
	let m = date.getMinutes()

	m = (m < 10) ? "0" + m : m;
	const result = h + ":" + m; 
	noteClock.innerText = result
	return result + ","
}

function generateDay() {
	const nameMonth = [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];
	const d = new Date()
	let date = d.getDate();
	date = (date < 10) ? "0" + date : date;
	const result = nameMonth[d.getMonth()] + " " + date + "," + d.getFullYear();
	return result
}

function makeNote(noteObject) {
	const noteTitle = document.createElement("h2");
	noteTitle.innerText = noteObject.title;

	const noteCatatan = document.createElement("p");
	noteCatatan.classList.add("pCatatan")
	noteCatatan.innerText = noteObject.note;

	const noteDate = document.createElement("p");
	noteDate.classList.add("pdate");
	noteDate.innerText = noteObject.days;

	const noteClock = document.createElement("p");
	noteClock.classList.add("pClock");
	noteClock.innerText = noteObject.clock;

	const noteLihat = document.createElement("button");
	noteLihat.innerText = 'Lihat';
	noteLihat.setAttribute("data-bs-toggle", "modal");
	noteLihat.setAttribute("data-bs-target", "#Modal-Edit")
	noteLihat.classList.add("btn", "bg-dark" , "text-white");

	const carddate = document.createElement("div");
	carddate.classList.add("card-date" , "d-flex");
	carddate.append(noteClock, noteDate);

	const cardAction = document.createElement("div");
	cardAction.classList.add("card-action", "d-flex", "justify-content-between", "align-items-center");
	cardAction.append(carddate, noteLihat);

	const noteCardBody = document.createElement("div");
	noteCardBody.classList.add("card-body");
	noteCardBody.append(noteTitle, noteCatatan, cardAction);

	const noteCard = document.createElement("div");
	noteCard.classList.add("card");
	noteCard.setAttribute("id", `${noteObject.id}`);
	noteCard.append(noteCardBody);

	return noteCard
}

document.addEventListener(noteEvent, function() {
	const isNote = document.getElementById('isNote');
	isNote.innerHTML = ''
	for(const noteItem of noteArr) {
		isNote.append(makeNote(noteItem));
	}
})