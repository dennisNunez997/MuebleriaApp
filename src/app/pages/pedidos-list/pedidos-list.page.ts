import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ProductoService } from 'src/app/services/producto.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ProductInfoPage } from '../product-info/product-info.page';
import { PedidoFinalPage } from '../pedido-final/pedido-final.page';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { alertController } from '@ionic/core';
import { VendedorService } from 'src/app/services/vendedor.service';
@Component({
  selector: 'app-pedidos-list',
  templateUrl: './pedidos-list.page.html',
  styleUrls: ['./pedidos-list.page.scss'],
})
export class PedidosListPage implements OnInit {

  @Input() empresa_prepedido;
  pedidos = []
  subtotal = []
  pedidos_duplicados = []

  cantidad_pedido: number = 0;
  sub_TotalFinal=null;
  nombre_empresa_pedido: string;
  user_id: string;
  constructor(
    private modalCtrl: ModalController,
    private productService: ProductoService,
    private afs: AngularFireDatabase,
    private auth: AngularFireAuth,
    private alertCtrl: AlertController,
    private VendedorServ: VendedorService) { }

  ngOnInit() {
    this.auth.onAuthStateChanged(user => {
      this.user_id = user.uid
    })
    this.showPrepedidos()
    this.subTotalFinal()
  }
  
    async subTotalFinal(){ 
    this.pedidos_duplicados = [];
    this.sub_TotalFinal = 0;   
    
    this.productService.geteditPedidos().subscribe(data => {
      data.map(item => {
        if(item.empresa === this.empresa_prepedido){
          let subtotal = parseFloat(item.subtotal)
          this.subtotal.push(subtotal)
          console.log("subtotal_productos: "+this.subtotal)
          
          this.sub_TotalFinal = this.subtotal.reduce((a,b) => a+b, 0)
          console.log("suma: "+this.sub_TotalFinal)
          
        }
      })
    })
  }

  

  
  
  showPrepedidos(){
    this.pedidos = []    
    this.productService.geteditPedidos().subscribe(data => {
      data.map((item) => {
        if(item.empresa === this.empresa_prepedido){
          this.nombre_empresa_pedido = item.empresa
          //console.log("nombre empresa: "+item.empresa+" empresa: "+this.empresa_prepedido)
          this.pedidos.push({
            nombre_pedido: item.nombre_pedido,
            precio: (item.precio_pedido * item.cantidad_pedido),
            categoria: item.categoria_pedido,
            cantidad: item.cantidad_pedido,
            empresa: item.empresa,
            imagen: item.imagen_pedido,
            id: item.id_prepedido,
            id_prod: item.id_prod,
            subtotal: item.subtotal          
          })
          
          this.pedidos_duplicados = Array.from(this.pedidos.reduce((map, obj) => map.set(obj.nombre_pedido, obj), new Map()).values())
          //poner aqui subtotal
          this.pedidos_duplicados.map((data => {
            console.log("data; "+data.subtotal)

            //this.sub_TotalFinal = 0;
            //let subtotal = parseFloat(data.subtotal)
            //this.subtotal.push(data.subtotal)
            //console.log("subtotal_productos: "+this.subtotal)
            //this.sub_TotalFinal = this.subtotal.reduce((a,b) => a+b, 0)
            //console.log("suma: "+this.sub_TotalFinal) 
          }))
              
          

        }       
      })
    })
  }

  suma(id, cantidad,categoria, empresa, id_prod, imagen, nombre, precio){    
    this.sub_TotalFinal=0;
    
    //console.log("nombre: "+nombre_selected)
    console.log("id_prepedido: "+id)
    console.log("cantidad: "+cantidad)
    console.log("categoria: "+categoria)
    console.log("id_prd: "+id_prod)
    console.log("imagen: "+imagen)
    console.log("nombre: "+nombre)
        
    
    const division = precio/cantidad  
    cantidad = cantidad + 1    
    console.log("division: "+division)
    console.log("cantidad: "+cantidad)  
    console.log("subtotal: "+division +"/"+ cantidad)
    const subtotal = division * cantidad
    this.pedidos = []    
    this.afs.database.ref('/prepedido/'+id).update({
      cantidad_pedido: cantidad,
      categoria_pedido: categoria,
      empresa: empresa,
      id_prepedido: id,
      id_prod: id_prod,
      imagen_pedido: imagen,
      nombre_pedido: nombre,
      precio_pedido: division,
      subtotal: subtotal
    })
    
    
  }

  resta(id, cantidad,categoria, empresa, id_prod, imagen, nombre, precio){    
    //console.log("nombre: "+nombre_selected)
    const division = precio/cantidad  
    cantidad = cantidad - 1    
    console.log("division: "+division)
    console.log("cantidad: "+cantidad)  
    console.log("subtotal: "+division +"/"+ cantidad)
    const subtotal = division * cantidad
    
    this.afs.database.ref('/prepedido/'+id).update({
      cantidad_pedido: cantidad,
      categoria_pedido: categoria,
      empresa: empresa,
      id_prepedido: id,
      id_prod: id_prod,
      imagen_pedido: imagen,
      nombre_pedido: nombre,
      precio_pedido: division,
      subtotal: subtotal
    })
    this.pedidos = []    
    this.sub_TotalFinal=null;

  }

  deletePrepedidos(){
    this.productService.geteditPedidos().subscribe(data =>{
      data.map((item) => {
        if(item.empresa === this.empresa_prepedido){
          this.productService.deleteprepedidos(item.id_prepedido)
        }
      })
    }) 
  }

  async guardarPedidos(uid, nomb_empresa, subtotal){
       
   this.productService.geteditPedidos().subscribe(data => {
      data.map((item) => {
        if(item.empresa === this.empresa_prepedido){
          const subtotal = item.precio_pedido*item.cantidad_pedido;
          this.VendedorServ.getVendedores().subscribe(data => {
            data.map((vendedor) => {
              if(vendedor.nombre_empresa === this.empresa_prepedido ){
                this.productService.addPedidoFinal(item.id_usuario, item.nombre_pedido, subtotal, item.categoria_pedido, item.cantidad_pedido, item.empresa, item.imagen_pedido, item.id_prod, subtotal, vendedor.image_vendedor)
              }
            })
          })
         
        }
      })
    })
    this.pedidoGuardado()
    this.modalCtrl.dismiss()
    this.deletePrepedidos()
    const modal = this.modalCtrl.create({
      component: PedidoFinalPage,
      componentProps: {
        nombre_empresa: nomb_empresa,
        total: subtotal,
        uid: uid
      }      
    })
    return  (await modal).present();   
       
    
  }

  async pedidoGuardado(){
    const alert = await this.alertCtrl.create({
      animated: true,
      cssClass: 'success',
      header: 'Pedido guardado',
      message: 'Su pedido se ha hecho satisfactoriamente',
      buttons: ['OK']

    })
    await alert.present();
  }

  delete(id){
    this.productService.deleteprepedidos(id)
    this.pedidos = []
  }

  salir(){
    this.modalCtrl.dismiss() 
    
    //this.exitAlert()
  }
  async exitAlert(){
    const alert = await this.alertCtrl.create({
      animated: true,
      cssClass: 'alert',
      header: '¿Seguro que desea salir?',
      message: 'Al salir su pedido se eliminará',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Ok',
          role: 'ok',
          handler: () => {
            this.productService.geteditPedidos().subscribe(data =>{
              data.map((item) => {
                if(item.empresa === this.empresa_prepedido){
                  this.productService.deleteprepedidos(item.id_prepedido)
                }
              })
            })
            this.modalCtrl.dismiss()
          }
        }
        
      ]

    })
    await alert.present();
  }
  

}
