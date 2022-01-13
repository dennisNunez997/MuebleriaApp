import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ProductoService } from 'src/app/services/producto.service'; 
import { ModalPedidoPage } from '../modal-pedido/modal-pedido.page';
import { PedidosListPage } from '../pedidos-list/pedidos-list.page';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.page.html',
  styleUrls: ['./product-info.page.scss'],
})
export class ProductInfoPage implements OnInit {
  /*
    id_prod: string;
    pedido: number = 0;
    total_prod:number = 0;
    comentario: string;

    isDisabled = false;

  */

  /*
    @Input() name_prod;
    @Input() descripcion_prod;
    @Input() precio_prod;
    @Input() cantidad_prod;
    @Input() empresa_prov;
    @Input() nombre_prov;
    @Input() apellido_prov;

  */

  productos = [];
  categoria = [];
  productsFiltered = [];
  categoriaFiltered: boolean;
  selection: boolean;
  prepedidoIsEmpty: boolean = true;
  textoBuscarProd='';

  prepedido = [];

  @Input() id;
  @Input() img_empresa;
  @Input() nom_empresa;

  //categorias
  @Input() nombre_categoria;
  categorySelected = [];

  constructor(
    private modalCtrl: ModalController,
    public alertController: AlertController,
    private prodServ: ProductoService
  ) { }

  ngOnInit() {
    this.getListProd();
    this.showCategorias();
    this.CategorySelected();
    this.showPrepedido()
  }
  


  showPrepedido(){
    this.prodServ.geteditPedidos().subscribe(data => {
      data.map((item => {
        if(item.empresa === this.nom_empresa){
          this.prepedido.push({
            nombre_pedido: item.nombre_pedido
            
          })
          if(this.prepedido.length){
            console.log("arreglo vacio")
            this.prepedidoIsEmpty = false;
          }
          
          //console.log("arreglo prepedido: "+this.prepedido)          
        }
      }))
    })
  }

  async goToPedidoList(){
    console.log("empresa1: "+this.nom_empresa)
    const modal = await this.modalCtrl.create({
      component: PedidosListPage,
      componentProps: {
        empresa_prepedido: this.nom_empresa
      }
    })
    await modal.present()
  }

  CategorySelected(){
    this.categoriaFiltered = false;
    this.selection = true;
    this.prodServ.getProduct().subscribe(data => {
      data.map((item => {
        if((item.categoria_producto === this.nombre_categoria) && (item.empresa_proveedor === this.nom_empresa))
        {          
          this.categorySelected.push({
            nombre_producto: item.nombre_producto,
            descripcion: item.descripcion_producto,
            categoria_producto: item.categoria_producto,
            empresa: item.empresa_proveedor,
            precio: item.precio_producto,
            imagen: item.image_producto,
            cantidad: item.cantidad_producto,
            uid: item.uid_user,
            id: item.id_prod          
          })
        }
        
      }))
    })
  } 
  

  buscarProducto(event){
    this.textoBuscarProd = event.detail.value;

  }

  listByCategory(nombre){
    
    this.productsFiltered = [];
    console.log("categoria: "+nombre)
    this.prodServ.getProduct().subscribe(data => {
      data.map((item) => {
        if((item.categoria_producto === nombre) && (item.uid_user === this.id)){
          console.log("nombre: "+item.nombre_producto+" empresa: "+item.empresa_proveedor) 
          this.productsFiltered.push({
            nombre_producto: item.nombre_producto,
            descripcion: item.descripcion_producto,
            categoria_producto: item.categoria_producto,
            empresa: item.empresa_proveedor,
            precio: item.precio_producto,
            imagen: item.image_producto,
            cantidad: item.cantidad_producto,
            uid: item.uid_user,
            id: item.id_prod
          })
          
        }
      })
    })
    

  }

  showCategorias(){
    this.prodServ.getCategory().subscribe(data => {
      data.map((item) => {
        this.categoria.push({
          id: item.id_categoria,
          categoria: item.nombre_categoria
        })        
      })
    })

  }


  async modalPedido(nombre_empresa, id_prod, nombre_producto,nombre_proveedor, descripcion_producto, categoria_producto, cantidad_producto, precio_producto, uid_user,image_producto){
    const modal = await this.modalCtrl.create({
      component: ModalPedidoPage,
      componentProps: {
        id: id_prod,
        nombre: nombre_producto,
        proveedor: nombre_proveedor,
        descripcion: descripcion_producto,
        categoria_prod: categoria_producto,
        cantidad: cantidad_producto,
        precio: precio_producto, 
        nombre_empresa: nombre_empresa,
        image: image_producto
      }
    })
    return await modal.present();
  }
  
  getListProd(){
    this.prodServ.getProduct().subscribe(data => {
      data.map((item) => {
        if(item.uid_user === this.id){
          this.productos.push({
            nombre: item.nombre_producto,
            descripcion: item.descripcion_producto,
            categoria: item.categoria_producto,
            empresa: item.empresa_proveedor,
            precio: item.precio_producto,
            imagen: item.image_producto,
            cantidad: item.cantidad_producto,
            uid: item.uid_user,
            id: item.id_prod
          })
          
        }
      })
    })

    
    /*
      this.prodServ.getProduct().subscribe(
      list => {
        this.productos = list.map(item => {
          return {
            $key: item.key,
            ...item.payload.val()
          }
        })
                
          this.productos.map(item => {
            
            if(item.uid_user === this.id){
            item.nombre_producto;
            item.empresa_producto;
            console.log("nombre producto: "+item.nombre_producto)
          
          }
          
        }) 
        
      }
    )  
    */
    
    
  }
  
  /*
  
  rate=0;
  onRate(rate) {
    console.log(rate)
    this.rate = rate;
    //console.log("comentario:"+this.comentario)
    return this.rate

  }

  SendComentary(){    
    //let calificacion = this.onRate()
    console.log("rate: "+this.rate)
    console.log("comntario: "+this.comentario)
  }
  suma(){
    let stock = 0;
    stock = this.cantidad_prod - this.pedido;
    //console.log("stock: "+stock)
    this.pedido = this.pedido + 1
    //console.log("pedido: "+this.pedido)
    this.total_prod = this.pedido * this.precio_prod
    //console.log("total"+this.total_prod)
    if((stock -1) == 0){
      console.log("stock agotado")
      this.isDisabled = true;
      this.emptyStock()
    }
  }

  resta(){
    let stock = 0;
    this.pedido = this.pedido - 1
    console.log("decremento: "+this.pedido)
    stock = this.cantidad_prod - this.pedido
    if((this.pedido -1 ) <= 0){
      console.log("error")
      this.emptyStock()
      this.isDisabled = true;
      this.pedido = 0
    }
  }
  


  async emptyStock() {
    const alert = await this.alertController.create({
      header: 'Stock Agotado',
      subHeader: 'Lo sentimos',
      message: 'El stock se ha acabado.',
      buttons: ['OK']
    });

    await alert.present();
  }
  

  Comprar(pedido, precio){
    console.log("pedido: "+pedido)
    console.log("precio: "+precio)
    if(pedido == 0){
      
    }
  }

  
  */


  salir(){
    this.modalCtrl.dismiss();
  }
  
  
}
