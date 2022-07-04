const noteEvent = 'NOTE_EVENT';
let isField = 'buat';
let isNoteObject = '';

// bagian ketika content dom sudah di load
document.addEventListener('DOMContentLoaded', function(){
	const noteForm = document.getElementById('noteForm');
	noteForm.addEventListener('submit', function(e) {
		e.preventDefault();
		addNote();
		noteForm.reset();
	});
	generateClock();
	textAreaRisize();
	
	if (isLocal()) {
		fetchNote();
	}
});

// bagian menambahkan note
function addNote() {
	const noteInputTitle = document.getElementById('noteInputTitle').value;
	const noteInputCatatan = document.getElementById("noteInputCatatan").value;
	const noteId = +new Date();
	const noteClock = generateClock();
	const noteDay = generateDay();
	const noteObject = generateNoteObject(noteId, noteInputTitle, noteInputCatatan, noteClock, noteDay);

	noteArr.push(noteObject);
	console.log(noteArr)
	document.dispatchEvent(new Event(noteEvent));
	noteNote();
}

// bagian membuat textarea auto resize height
function textAreaRisize() {
	const textArea = document.querySelectorAll("textarea.form-control");
	for(const areaSize of textArea) {
		areaSize.addEventListener('input', function() {
			this.style.height = "auto";
			this.style.height = this.scrollHeight + "px"
		})
	}
}

// bagian membuat jam
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

// bagian membuat bulan
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

// bagian item note yang sudah ditambahkan
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
	noteLihat.setAttribute("data-bs-target", "#Modal-Edit");
	noteLihat.setAttribute("id", "lihatNote");
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

	// bagian edit note
	noteLihat.addEventListener('click', function(e) {
		e.stopPropagation();
		fieldNote(noteObject);
	});

	return noteCard
}

// bagian item yang akan dihapus
function removeIsNote(noteObject) {
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

	const btnRemoveNote = document.createElement("button");
	btnRemoveNote.innerText = 'Hapus';
	btnRemoveNote.classList.add("btn", "text-white", "btn-danger")

	const carddate = document.createElement("div");
	carddate.classList.add("card-date" , "d-flex");
	carddate.append(noteClock, noteDate);

	const cardAction = document.createElement("div");
	cardAction.classList.add("card-action", "d-flex", "justify-content-between", "align-items-center");
	cardAction.append(carddate, btnRemoveNote);

	const noteCardBody = document.createElement("div");
	noteCardBody.classList.add("card-body");
	noteCardBody.append(noteTitle, noteCatatan, cardAction);

	const noteCard = document.createElement("div");
	noteCard.classList.add("card");
	noteCard.setAttribute("id", `${noteObject.id}`);
	noteCard.append(noteCardBody);

	btnRemoveNote.addEventListener('click', function() {
		removeIsFormNote(noteObject.id);
	})

	return noteCard
}


// bagian mengisi input lihat dan edit
var editTitle = document.getElementById("editTitle"),
	editCatatan = document.getElementById("editCatatan");
function fieldNote(noteObject) {
	editTitle.value = noteObject.title;
	editCatatan.value = noteObject.note;
	isField = 'baru';
	isNoteObject = noteObject.id;
}

const editNote = document.getElementById("editNote");
editNote.addEventListener('submit', function(e) {
	e.preventDefault();
	if (isField === 'baru') {
		editIsFormNote(isNoteObject);
	}
})

// bagian edit bedasarkan id notenya
function editIsFormNote(isNoteId) {
	const noteIndex = noteArr.findIndex((item => item.id === isNoteId));
	noteArr[noteIndex].title = editTitle.value;
	noteArr[noteIndex].note = editCatatan.value;
	document.dispatchEvent(new Event(noteEvent));
	noteNote()
	isField = 'buat';
	isNoteObject = '';
}

// bagian remove note
function removeIsFormNote(noteId) {
	const noteTarget = findToIndex(noteId);
	if (noteTarget === null) return
	noteArr.splice(noteTarget, 1);
	document.dispatchEvent(new Event(noteEvent))
	noteNote();
}
// bagian remove note bedasarkan id notenya
function findToIndex(noteId) {
	for(const noteItemId in noteArr) {
		if (noteArr[noteItemId].id === noteId) {
			return noteItemId
		}
	}
	return -1
}

// Event render note memasukkan data array ke element isNote dan isNoteHapus
document.addEventListener(noteEvent, function() {
	const isNote = document.getElementById('isNote');
	isNote.innerHTML = ''
	const isNoteHapus = document.getElementById("isNoteHapus");
	isNoteHapus.innerHTML = '';
	for(const noteItem of noteArr) {
		isNote.append(makeNote(noteItem));
		isNoteHapus.append(removeIsNote(noteItem));
	}
}) 





