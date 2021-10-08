"use strict";

// getting elements
var body = document.getElementsByTagName("body")[0];
var container = document.getElementsByClassName("container")[0];
var noteForm = document.getElementsByClassName("note-form")[0];
var titleInput = document.getElementById("title");
var textInput = document.getElementById("note-text");
var popupOverlay = document.getElementsByClassName("overlay")[0];

// all notes
var notes = [];

// returns the html for the note
// I'm using destructuring here. Basically I'm extracting these props from the passed obj
var noteTextBox = function ({ title, content, id }) {
  return `<article class="box">
            <div class="content-container">
            <h1 class="title">${title}</h1>
                <p class="content">${content}</p>
            </div>
            <button data-id=${id} type="button" class="btn btn-delete">Delete</button>
          </article>`;
};

var showNote = function () {
  // getting the notes
  var prevNotes = localStorage.getItem("noteBoxs");
  // checking if any prevNotes exists
  if (prevNotes) {
    notes = JSON.parse(prevNotes);
  } else {
    notes = [];
  }

  // adding note box for every note obj
  notes.forEach(function (note) {
    var noteBox = noteTextBox(note);
    container.insertAdjacentHTML("afterbegin", noteBox);
  });
};

// adding the submit form to the form
noteForm.addEventListener("submit", function (e) {
  e.preventDefault();

  var noteObj = {
    id: Math.random() * 10000,
    title: titleInput.value,
    content: textInput.value,
  };
  // adding the object to notes array
  notes.push(noteObj);
  // setting the local storage again
  localStorage.setItem("noteBoxs", JSON.stringify(notes));

  // adding the the new node to the dom
  container.insertAdjacentHTML("afterbegin", noteTextBox(noteObj));

  // reseting the form
  titleInput.value = textInput.value = "";
});

var noteId;
var nodeToDel;

body.addEventListener("click", function (e) {
  // checking if the click happened on the delete button
  if (e.target.classList.contains("btn-delete")) {
    // activating popup
    popupOverlay.classList.add("overlay-active");

    // getting the need values to find the element to delete
    noteId = e.target.getAttribute("data-id");
    nodeToDel = e.target.parentElement;
  }

  // checking if user confirms the delete
  if (e.target.classList.contains("btn-confirm")) {
    // findIndex method findes the element which matches the given condition
    var noteToDelete = notes.findIndex(function (note) {
      return note.id == noteId;
    });

    // removing the item from the notes element
    notes.splice(noteToDelete, 1);

    // setting the localstorage with the new notes array
    localStorage.setItem("noteBoxs", JSON.stringify(notes));

    // setting the display none to the deleted note
    nodeToDel.style.display = "none";
    // diactivating the popup
    popupOverlay.classList.remove("overlay-active");

    // removing the reference to deleted element's values
    nodeToDel = "";
    noteId = "";
  }

  // checking if the user cancels the popup
  if (e.target.classList.contains("btn-cancel")) {
    popupOverlay.classList.remove("overlay-active");

    // removing the reference to deleted element's values
    nodeToDel = "";
    noteId = "";
  }
});

// initialzing the notes
showNote();
