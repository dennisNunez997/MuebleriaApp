import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ProductoService } from 'src/app/services/producto.service';
import { PedidosListPage } from '../pedidos-list/pedidos-list.page';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-modal-pedido',
  templateUrl: './modal-pedido.page.html',
  styleUrls: ['./modal-pedido.page.scss'],
})
export class ModalPedidoPage implements OnInit {
  @Input() nombre;
  @Input() proveedor;
  @Input() descripcion;
  @Input() categoria_prod;
  @Input() precio;
  @Input() cantidad;
  @Input() image;
  @Input() id;
  @Input() nombre_empresa;

  isDisabled = false;
  isDisabled_resta = false;
  isDisabled_suma = false;
  pedido: number = 1;
  total_prod:number = 0;
  user_id: string;

  productos = [];
  constructor(
    private modalCrtl: ModalController,
    private alertCtrl: AlertController,
    private prodServ: ProductoService,
    private auth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.auth.onAuthStateChanged(user => {
      this.user_id = user.uid
      this.total_prod = this.pedido * this.precio
    })
  }

  

  suma(){
    let stock = 1;
    stock = this.cantidad - this.pedido;
    //console.log("stock: "+stock)
    this.pedido = this.pedido + 1
    //console.log("pedido: "+this.pedido)
    this.total_prod = this.pedido * this.precio
    //console.log("total"+this.total_prod)
    /*
      if((stock -1) == 0){
      console.log("stock agotado")
      this.isDisabled = true;
      this.emptyStock()
    }
    */
    
  }

  resta(){
    let stock = 1;
    this.pedido = this.pedido - 1    
    this.total_prod = this.pedido * this.precio
    //console.log("decremento: "+this.pedido)
    stock = this.cantidad - this.pedido
    if((this.pedido -1 ) <= 0){
      console.log("error")
      this.emptyStock()
      this.isDisabled_resta = true;
      this.pedido = 0
    }
  }
  
  async contactoEmpresa(id_usuario, nombre_producto, precio, cantidad, imagen, subtotal){
    //console.log("cantidad: "+cantidad)
    //console.log("id: "+id_usuario)
    this.prodServ.addeditPedidos(id_usuario, this.nombre_empresa ,this.id, this.categoria_prod, nombre_producto,precio, cantidad, imagen, subtotal)
          
    
    this.pedido_guardado()
    this.modalCrtl.dismiss()
    
    /*
     const modal = await this.modalCrtl.create({
      component: PedidosListPage,
      componentProps: {
        id_prod: this.id,
        categoria: this.categoria_prod,
        nombre: nombre_producto,
        precio: precio,
        cantidad: cantidad,
        imagen: imagen,
        id_user: this.nombre_empresa,
        id_usuario: id_usuario  
           
      }
    })
    await modal.present();

    */
    
  }

  async pedido_guardado() {
    const alert = await this.alertCtrl.create({
      header: 'Pedido guardado',
      message: 'Producto añadido al pedido.',
      buttons: ['OK']
    });

    await alert.present();
  }


  async emptyStock() {
    const alert = await this.alertCtrl.create({
      header: 'Stock Agotado',
      subHeader: 'Lo sentimos',
      message: 'El stock se ha acabado.',
      buttons: ['OK']
    });

    await alert.present();
  }

  salir(){
    this.modalCrtl.dismiss()
  }

}
