import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  email_recover: string;
  constructor(private authservice: AuthService) { }

  ngOnInit() {
  }

  sendLinkReset(){
    if(this.email_recover != ""){
      
      this.authservice.resetPassword(this.email_recover).then(() => {
        console.log('enviado')
      }).catch(()=>{
        console.log('error')
      })
    }else{
      alert('Ingrese su correo electrónico')
    }
  }

}
