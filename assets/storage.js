const noteFetch = 'FETCH_EVENT';
const noteKey = 'NOTE_KEY';
let noteArr = [];



// bagian object note
function generateNoteObject(id, title, note, clock, days) {
	return {id, title, note, clock, days}
}


// mengecek apakah Storage dibrowser ada?
function isLocal() {
	return typeof(Storage) !== undefined
}

// bagian mengubah data menjadi string dari object ke localStorage
function noteNote() {
	if (isLocal()) {
		localStorage.setItem(noteKey, JSON.stringify(noteArr));
		document.dispatchEvent(new Event(noteFetch));
	}
}

// bagian mengambil data dari localStorage lalu ditambahkan ke array
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
