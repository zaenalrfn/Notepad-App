let noteArr = [];
const noteKey = 'NOTE_KEY';
const noteEvent = 'NOTE_EVENT';
const noteFetch = 'FETCH_EVENT';


function generateNoteObject(id, title, note, clock, days) {
	return {id, title, note, clock, days}
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
	noteNote();
}

function isLocal() {
	if (typeof(Storage) === undefined) {
		return false
	}
	return true
}

function noteNote() {
	if (isLocal()) {
		localStorage.setItem(noteKey, JSON.stringify(noteArr));
		document.dispatchEvent(new Event(noteFetch));
	}
}

function fetchNote() {
	const pickNote = localStorage.getItem(noteKey);
	let note = JSON.parse(pickNote);
	if (note !== null) {
		for(const noteItem of note) {
			noteArr.push(noteItem);
		}
	}

	document.dispatchEvent(new Event(noteEvent));
}
document.addEventListener(noteEvent, function() {
	const isNote = document.getElementById('isNote');
	isNote.innerHTML = ''
	for(const noteItem of noteArr) {
		isNote.append(makeNote(noteItem));
	}
})
