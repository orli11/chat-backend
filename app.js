var firebaseConfig = {
    apiKey: "AIzaSyCTTah8AicYUR7gdMtxeiof4DgwRqj0beY",
    authDomain: "chat-backend-df017.firebaseapp.com",
    projectId: "chat-backend-df017",
    storageBucket: "chat-backend-df017.appspot.com",
    messagingSenderId: "322320092302",
    appId: "1:322320092302:web:e78e348a95df7495060ddf"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig)
  
  const botones = document.querySelector('#btn')
  const nombUsuario = document.querySelector('#nUsu')
  const contenidoProtegido = document.querySelector('#contProtegido')
  const formulario = document.querySelector('#form')
  const inputChat = document.querySelector('#inputChat')

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log(user)
        botones.innerHTML = /*html*/`<button class="btn btn-outline-danger" id="btnCerrar">Cerrar Sesión</button>`

        nombUsuario.innerHTML = user.displayName
        cerrarSesion()
        
        formulario.classList = 'input-group  py-3 fixed-bottom container'
        conteChat(user)
    } else {
        console.log('No hay usuario logueado')  
        botones.innerHTML = /*html*/`<button class="btn btn-outline-success mr-2" id="btnAcceder">Acceder</button>` 
        
        iniciarSesion()
        nombUsuario.innerHTML = 'Chat'
        contenidoProtegido.innerHTML = /*html*/` <p class="p-ini mt-5">Debes iniciar sesión</p>`
        formulario.classList = 'input-group  fixed-bottom container d-none'
    }
  })

  //Para iniciar sesion una vez el else haya sido presionado el botón acceder 
  const iniciarSesion = () => {
    const btnAcceder = document.querySelector('#btnAcceder')
    btnAcceder.addEventListener('click', async() => { //Se agrega el evento 'click' al precionar el btn Acceder
        try {
            const provider = new firebase.auth.GoogleAuthProvider() //Ya que estamos usando los servicios de Google para logiarnos
            await firebase.auth().signInWithPopup(provider) //Abrir un Popup
        }catch (error) {
            console.log(error)
        }
    })
  }

  //Para cerrar sesión 
  const cerrarSesion = () => {
    const btnCerrar = document.querySelector('#btnCerrar')
    btnCerrar.addEventListener('click', () => {
        firebase.auth().signOut() //Cerrar sesión
        })
  }

  //Función que recibe el contenido del chat 
  const conteChat = (user) => {
    
    formulario.addEventListener('submit', (e) => {
      e.preventDefault() //NO se actualice y no haga nada por defecto ya que el servidor hace una petición en GET 
      console.log(inputChat.value)

      if(!inputChat.value.trim()){
        console.log('input vacío')
        return
      } 

      firebase.firestore().collection('chat').add({   //Pata crear la colección en firebase
        texto: inputChat.value,
        uid: user.uid,
        fecha: Date.now()
      })
        .then(res => {console.log('Mensaje correctamente guardado')})
        .catch(e => console.log(e))

        inputChat.value = ''
      })

      //Operaciones para que nuestros mensajes sean dinámicos y se extraigan de la base de datos
      firebase.firestore().collection('chat').orderBy('fecha').onSnapshot(query =>{
        contenidoProtegido.innerHTML = ''
        query.forEach(doc => {
          console.log(doc.data())
          if(doc.data().uid === user.uid){
            contenidoProtegido.innerHTML += /*html*/`
              <div class="d-flex justify-content-end m-2">
                <span class="mnsa badge badge-pill bg-primary p-2">${doc.data().texto}</span>
              </div>`
          } else {
            contenidoProtegido.innerHTML += /*html*/ `
              <div class="d-flex justify-content start m-2">
                <span class="mnsa badge bg-secondary p-2">${doc.data().texto}</span>
              </div>`
          }
          contenidoProtegido.scrollTop = contenidoProtegido.scrollHeight //Calcula: Top = Alto, el alto va aumentar y por lo tanto el top va a bajar
        })
      })
  }