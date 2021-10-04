import React, { useState } from 'react';
import './App.css';

import * as firebase from 'firebase/app';
import * as fstore from'firebase/firestore';
import {getAuth ,GoogleAuthProvider ,signInWithPopup} from  'firebase/auth';


import {useAuthState} from 'react-firebase-hooks/auth';
import{useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyBwbLYY2lku5wXLkctx_fPWrPPjZ2mwKyo",
  authDomain: "superchat-e8ce7.firebaseapp.com",
  projectId: "superchat-e8ce7",
  storageBucket: "superchat-e8ce7.appspot.com",
  messagingSenderId: "226557595479",
  appId: "1:226557595479:web:980657ad122aa6f5ce3812",
  measurementId: "G-VLVQPX4PQ2"
})

const auth =getAuth();
const firestore=fstore.getFirestore();



function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header" >
        
      </header>
      <section className="App-main">
        {user ? <ChatRoom /> :<SignIn />}
      </section>
    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () =>{
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth ,provider);
  }

return(
<button onClick={signInWithGoogle}>Sign in With Google</button>

 )
}

function SignOut(){
  return auth.currentUser &&(
    
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}
function ChatRoom() {
  const messagesRef=firestore.collection('messages');
  const query =messagesRef.orderBy('createdAt').limit(25);

  const[messages] =useCollectionData(query ,{idField :'id'});
    const[formValue , setFormValue]= useState('');


  const sendMessage =async(e) => {
    e.preventDefault();
    const {uid ,photoURL} =auth.currentUser;

    await messagesRef.add({
      text : formValue,
      createdAt : firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue(''); 
  
  }




return(

  <>

    <div>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

    </div>

    <form onSubmit={sendMessage}>
          <input  value={formValue}  onChange={(e) =>setFormValue(e.target.value)}/>

          <button type ="submit">🕊️</button>


    </form>

    </>
 )
}

function ChatMessage(props) {
  const {text ,uid , photoUrL} =props.message;

  const messageClass =uid ===auth.currentUser.uid ? 'sent' : 'received' ;

  return (<div className ={`message ${messageClass}`}>
    <img src={photoUrL} />
  <p>{text}</p>
     </div>
    )
}

export default App;
