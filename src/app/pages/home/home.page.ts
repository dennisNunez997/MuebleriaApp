import { Component, OnInit } from '@angular/core';

import { MenuController } from '@ionic/angular';
import { ProductoService } from 'src/app/services/producto.service';

import { ModalController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/compat/database';

import { ProductInfoPage } from '../product-info/product-info.page';
import { VendedorService } from 'src/app/services/vendedor.service';
import { ModalCategoriaPage } from '../modal-categoria/modal-categoria.page';
import { ModalSearchPage } from '../modal-search/modal-search.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  productos = [];
  vendedores= []
  name_prod : string;
  
  

  textoBuscar = '';
  constructor(
    private menu:  MenuController,
    private prodService: ProductoService,
    private modalCtrl: ModalController,
    private afs: AngularFireDatabase,
    private vendedorService: VendedorService
  ) { }

  ngOnInit() {
    //this.getProducto()
    this.getEmpresa()
  }
  
  buscar(event: CustomEvent){    
    this.textoBuscar = event.detail.value;
    //console.log("busqueda: "+this.textoBuscar)
  }
  getEmpresa(){
    this.vendedorService.getVendedor().subscribe(
      list => {
        this.vendedores = list.map(item => {
          return {
            $key: item.key,
            ...item.payload.val()
          }
        })
        this.vendedores.map(item => {
          item.nombre_empresa
          item.image_vendedor
          item.direccion_vendedor
          item.telefono_vendedor
          item.uid_vendedor
          //console.log("nombre: "+item.nombre_empresa)
        })
      }
    )
  }

  /*
    getProducto(){
    this.prodService.getProduct().subscribe(
      list => {
        this.productos = list.map(item => {
          return{
            $key: item.key,
            ...item.payload.val()
          }
        })
        this.productos.map(item => {
          item.nombre_producto
          item.descripcion_producto
          item.cantidad_producto
          item.precio_producto
          item.categoria_producto
          item.id_prod
        })
      }
    )
  }

  */

  toggleMenu(){
    this.menu.toggle()
  }

  async modalSearch(){
    const modal = await this.modalCtrl.create({
      component: ModalSearchPage,
                
    })
    return await modal.present();
  }

  async showCategoria(nombre){
    //console.log("categorias: "+nombre)
    const modal = await this.modalCtrl.create({
      component: ModalCategoriaPage,
      componentProps: {
        categoria: nombre
      }
      
      
    })
    return await modal.present();
  }

  async showDetails(id_empresa, image_empresa, nombre_empresa){
    const modal = await this.modalCtrl.create({
      component: ProductInfoPage,
      componentProps: {
        id: id_empresa,
        img_empresa: image_empresa,
        nom_empresa: nombre_empresa
        
      }
    })
    return await modal.present();
  }

  /*
    async showDetails(id_prod,nombre_producto,descripcion_producto, 
                    image_producto, precio_producto, cantidad_producto, 
                    empresa_producto,nombre_proveedor, apellido_proveedor){

    const modal = await this.modalCtrl.create({
      component: ProductInfoPage,
      componentProps: {
        id_producto: id_prod,
        
        name_prod: nombre_producto,
        descripcion_prod: descripcion_producto,
        image_prod: image_producto,
        precio_prod: precio_producto,
        cantidad_prod: cantidad_producto,
        empresa_prov: empresa_producto,
        nombre_prov: nombre_proveedor,
        apellido_prov: apellido_proveedor
      }
    })
    return await modal.present();
  }
  */

  
  
}
