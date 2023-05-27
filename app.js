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

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log(user)
        botones.innerHTML = /*html*/`<button class="btn btn-outline-danger" id="btnCerrar">Cerrar Sesión</button>`

        nombUsuario.innerHTML = user.displayName
        cerrarSesion()
    } else {
        console.log('No hay usuario logueado')  
        botones.innerHTML = /*html*/`<button class="btn btn-outline-success mr-2" id="btnAcceder">Acceder</button>` 
        
        iniciarSesion()
        nombUsuario.innerHTML = 'Chat'
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