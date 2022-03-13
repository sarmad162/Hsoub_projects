import React , { useState, useEffect } from 'react';
import './App.css';
import Preview from './component/Preview';
import Message from './component/messages';
import NotesContainer from './component/Notes/NotesContainer';
import NotesList from './component/Notes/NotesList';
import Note from './component/Notes/Note';
import NoteForm from './component/Notes/NoteForm';
import Alert from './component/Alert';

function App() {

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [creating , setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [validationError, setValidationError] = useState([]);

  useEffect(() => {
    if(localStorage.getItem('notes')){
      setNotes(JSON.parse( localStorage.getItem('notes')));
    }else{
      localStorage.setItem('notes', JSON.stringify([]));
    }
  }, []);

  useEffect( () =>{
    if(validationError.length !== 0){
      setTimeout( () =>{
        setValidationError([]);
      }, 3000)
    }
  }, [validationError]);

  const saveToLocalStorage = (key, value) =>{
    localStorage.setItem(key, JSON.stringify(value));
  };

  const validate = () =>{
    const validationError = [];
    let pass = true;
    if(!title){
      validationError.push('الرجاء ادخال عنوان الملاحظة!');
      pass = false;
    }
    if(!content){
      validationError.push('الرجاء ادخال محتوى الملاحظة !');
      pass = false;
    }
    setValidationError(validationError);
    return pass;
  }

  const changeTitleHandler = (event) => {
    setTitle(event.target.value);
  }
  
  const changeContentHandler = (event) => {
    setContent(event.target.value);
  }

  const saveNoteHandler = () => {

    if(!validate()) return ;

    const note = {
      id: new Date(),
      title: title,
      content: content
    };

    const updatedNote = [...notes, note];
    saveToLocalStorage('notes', updatedNote);

    setNotes(updatedNote);
    setCreating(false);
    setSelectedNote(note.id);

    setTitle('');
    setContent('');
  }
  // choose note
  const selectNoteHandler = noteId =>{
    setSelectedNote(noteId);
    setCreating(false);
    setEditing(false);
  }
  //Edit note
  const editNoteHandler = () =>{
    const note= notes.find(note => note.id === selectedNote);
    setEditing(true);
    setTitle(note.title);
    setContent(note.content);
  }
  const updateNoteHandler = () => {
    if(!validate()) return ;
    
    const updatedNotes = [...notes];
    const noteIndex = notes.findIndex(note => note.id === selectedNote);
    updatedNotes[noteIndex]= {
      id:selectedNote,
      title:title,
      content:content
    };
    saveToLocalStorage('notes', updatedNotes);
    setNotes(updatedNotes);
    setEditing(false);
    setTitle('');
    setContent('');
  }

  const addNoteHandler = () => {
    setCreating (true);
    setEditing(false);
    setTitle('');
    setContent('');
  }
  // delete note
  const deleteNoteHandler = () => {
    const updatedNotes = [...notes];
    const noteIndex = updatedNotes.findIndex(note => note.id === selectedNote);
    notes.splice(noteIndex, 1);
    saveToLocalStorage('notes', notes);
    setNotes(notes);
    setSelectedNote(null);

  }

  const getAddNote = () => {

    return (
      <NoteForm 
        formTitle = "ملاحظة جديدة"
        title = {title}
        content = {content}
        titleChanged = {changeTitleHandler}
        contentChanged = {changeContentHandler}
        submitText = "حفظ"
        submitClicked = {saveNoteHandler}
      />
    );
  };

  const getPreview = () => {

    if(notes.length === 0){
      return <Message title="لايوجد ملاحظة "/> 
    }
    if(!selectedNote){
      return <Message title="الرجاء ادخال ملاحظة"/> 
    }

    const note = notes.find(note => {
      return note.id === selectedNote;
    });
      
   let noteDisplay = (
     <div>
       <h2>{ note.title} </h2>
       <p>{ note.content }</p>
     </div>
   )
   if (editing) {
     noteDisplay=(
      <NoteForm 
      formTitle = "تعديل جديدة"
      title = {title}
      content = {content}
      titleChanged = {changeTitleHandler}
      contentChanged = {changeContentHandler}
      submitText = "تعديل"
      submitClicked = {updateNoteHandler}
    />
     );
       
     
   }

    return (
      <div>
        {!editing && 
          <div className="note-operations">
          <a href="#" onClick={ editNoteHandler }>
            <i className="fa fa-pencil-alt" />
          </a>
          <a href="#" onClick = {deleteNoteHandler}>
            <i className="fa fa-trash" />
          </a>
        </div>
        }
        
        {noteDisplay}
      </div>
    );
  };

  

  return (
    <div className="App">
      <NotesContainer>
        <NotesList>
         {notes.map(note => 
         <Note 
         key = {note.id} 
         title = {note.title} 
         noteClicked ={ () => selectNoteHandler(note.id)}
         active = {selectedNote === note.id}
         />
         )}

        </NotesList>
        <button className="add-btn" onClick = {addNoteHandler} >+</button>
      </NotesContainer>
      <Preview>
       { creating ? getAddNote() : getPreview()}
     </Preview>
     {validationError.length !== 0 && <Alert validationMessages = {validationError} />}
      
    </div>
  );
}

export default App;
