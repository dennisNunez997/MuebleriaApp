import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireObject, snapshotChanges } from '@angular/fire/compat/database';
import { NavController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MenuController } from '@ionic/angular';


import { Plugins } from '@capacitor/core';
import { CameraOptions, CameraResultType } from '@capacitor/camera';

const { Camera } = Plugins




@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {


  private isDisabled: boolean=true;
  user =[];
  nombre: string;
  apellido: string;
  email: string;
  tlfono: number;
  img: string;
  id: string;

  //datos editados
  nombre_edited: string;
  apellido_edited: string;
  email_edited: string;
  tlfono_edited: string;
  img_edited: string;

  userRef: AngularFireObject<any>

  //mostrar boton para guardar cambios
  saveChanges: boolean = false;

  constructor(
    private afs: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    private storage: AngularFireStorage,
    private menu:  MenuController 
  ) { }

  ngOnInit() {
    this.afAuth.onAuthStateChanged(user => {
      if(user){
        this.showProfile(user.uid)
      }      
    })
  }

  showProfile(uid){
    
    this.afs.list('usuario/'+uid).valueChanges().subscribe(_data => {
      this.user = _data
      this.nombre = this.user[3];
      this.apellido = this.user[0];
      this.email = this.user[1];
      this.tlfono = this.user[4];
      this.img = this.user[2]
      console.log('nombre: '+this.nombre)
      console.log('apellido: '+this.apellido)      
      console.log('email: '+this.email)
      console.log('telefono: '+this.tlfono)
    })
  }

  editProfile(){
    this.isDisabled = false;
    this.saveChanges = true;
    
  }

  takePicture(){
    let options: CameraOptions={
      quality: 100,
      resultType: CameraResultType.DataUrl,
      saveToGallery: true
    }
    Camera.getPhoto(options).then((result) => {
      if(result.dataUrl){
        this.img_edited = result.dataUrl;
        this.afAuth.authState.subscribe(user=>{
          const uid = user.uid;
          this.storage.storage.ref('usuario/'+uid).putString(this.img_edited, 'data_url').then(async(datos) => {
            await datos.ref.getDownloadURL().then((downloadURL)=>{
              this.img_edited = downloadURL;
              this.afs.database.ref('usuario/'+user.uid).update({
                imagen: this.img_edited

              })
            })
          })

        })
        //console.log("image: "+this.src)
      }
    },(err)=>{
      alert(JSON.stringify(err));
    }
    )
  }


  GuardarCambios(){
    
    this.saveChanges=false;     
    this.isDisabled = false;
    this.afAuth.onAuthStateChanged(user => {
      if(user){
        this.afs.database.ref('usuario/'+user.uid).update({
          nombre: this.nombre_edited,
          apellido: this.apellido_edited,
          telefono: this.tlfono_edited,
          email: this.email_edited
        })
      }
    })
    
  }

  toggleMenu(){
    this.menu.toggle()
  }

  
}
