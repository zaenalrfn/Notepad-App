const noteEvent = 'NOTE_EVENT';
let isField = 'buat';
let isNoteObject = '';

// bagian ketika content dom sudah di load
document.addEventListener('DOMContentLoaded', function(){
	const noteForm = document.getElementById('noteForm');
	let buatNote = document.getElementById("buatNote");
	noteForm.addEventListener('submit', function(e) {
		const noteInputTitle = document.getElementById("noteInputTitle").value;
		const noteInputCatatan = document.getElementById("noteInputCatatan").value;
		e.preventDefault();
		if (noteInputTitle == '' && noteInputCatatan == '') {
			swal("Mohon isi catatan dulu!");
		} else {
			swal({
				text: "catatan berhasil dibuat!",
				icon: "success"
			})
			.then((text) => {
				if (text) {
					addNote();
					noteForm.reset();
					buatNote.removeAttribute("data-bs-dismiss", "modal");
				}
			})
		}
	});
	generateClock();
	textAreaRisize();
	
	if (isLocal()) {
		fetchNote();
	}
	const searchCatatan = document.getElementById("searchCatatan");
	const searchNoteCatatan = document.getElementById("searchNoteCatatan");
	searchNoteCatatan.addEventListener('input', function() {
		noteSearch(searchNoteCatatan.value);
		searchCatatan.addEventListener('submit', function(e) {
			e.preventDefault()
			noteSearch(searchNoteCatatan.value);
		})
	})
	const addIsNote = document.querySelector(".addNote");
	addIsNote.addEventListener('click', function() {
		buatNote.setAttribute("data-bs-dismiss", "modal");
	})
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
	noteLihat.innerHTML = '<i class="bi bi-check-circle"></i>';
	noteLihat.setAttribute("data-bs-toggle", "modal");
	noteLihat.setAttribute("data-bs-target", "#Modal-Edit");
	noteLihat.setAttribute("id", "lihatNote");
	noteLihat.classList.add("btn", "btn-modal", "text-white");

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
	btnRemoveNote.innerHTML = '<i class="bi bi-trash"></i>';
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
		swal({
			text: "Yakin menghapus catatan ini?",
			icon: "warning",
			buttons: true,
			dangerMode: true,
		})
		.then((willDelete) => {
			if (willDelete) {
				swal("Catatan berhasil dihapus!", {
					icon: "success",
				});
				removeIsFormNote(noteObject.id);
			}
		});
	})

	return noteCard
}



// bagian mengisi input lihat dan edit
var editTitle = document.getElementById("editTitle"),
editCatatan = document.getElementById("editCatatan");
function fieldNote(noteObject) {
	const notedateEdit = document.getElementById("notedateEdit");
	notedateEdit.innerText = noteObject.days;
	const noteClockEdit = document.getElementById("noteClockEdit");
	noteClockEdit.innerText = noteObject.clock
	editTitle.value = noteObject.title;
	editCatatan.value = noteObject.note;
	isField = 'baru';
	isNoteObject = noteObject.id;
}

const editNote = document.getElementById("editNote");
editNote.addEventListener('submit', function(e) {
	e.preventDefault();
	if (isField === 'baru') {
		swal({
			text: "Berhasil mengedit catatan!",
			icon: "success",
		})
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

// bagian mengfilter search note bedasarkan title
function noteSearch(keyword) {
	const titleFilter = keyword.toUpperCase();
	const titleTagElement = document.getElementsByTagName('h2');
	for(let i = 0; i < titleTagElement.length; i++) {
		const titleText = titleTagElement[i].innerText || titleTagElement[i].textContent
		if (titleText.toUpperCase().indexOf(titleFilter) > -1) {
			titleTagElement[i].closest(".card").style.display = "";
		} else {
			titleTagElement[i].closest(".card").style.display = "none";
		}
	}
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
