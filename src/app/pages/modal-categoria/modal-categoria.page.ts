import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-modal-categoria',
  templateUrl: './modal-categoria.page.html',
  styleUrls: ['./modal-categoria.page.scss'],
})
export class ModalCategoriaPage implements OnInit {

  @Input() categoria;
  textoBuscarProd = '';
  productos= [];
  
  constructor(
    private modalCtrl: ModalController,
    public alertController: AlertController,
    public prodServ: ProductoService
    ) { }

  ngOnInit() {
    console.log("categoria: "+this.categoria)
    this.getProd()
  }

  buscarProd(event: CustomEvent){
    this.textoBuscarProd = event.detail.value;
    console.log("busqueda: "+this.textoBuscarProd)
  }

  getProd(){
    this.prodServ.getProduct().subscribe(data => {
      data.map((item) => {
        console.log("item_categoria: "+item.categoria_producto)
        console.log("categ: "+this.categoria)
        
      if(item.categoria_producto === this.categoria){
        this.productos.push({
          nombre_producto: item.nombre_producto,
          descripcion_producto: item.descripcion_producto,
          cantidad_producto: item.cantidad_producto,
          categoria_producto: item.categoria_producto,
          empresa_proveedor: item.proveedor_empresa,
          precio_producto: item.precio_producto,
          image_producto: item.image_producto

        })
      }
     
      })
    })
  }

  salir(){
    this.modalCtrl.dismiss();
  }
  

}
