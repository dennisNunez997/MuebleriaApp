import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProductoService } from 'src/app/services/producto.service';
import { VendedorService } from 'src/app/services/vendedor.service';

import { EmpresaSelectedPage } from '../empresa-selected/empresa-selected.page';
@Component({
  selector: 'app-pedido-final',
  templateUrl: './pedido-final.page.html',
  styleUrls: ['./pedido-final.page.scss'],
})
export class PedidoFinalPage implements OnInit {
  @Input() nombre_empresa;
  @Input() total;
  @Input() uid;

  
  pedidos = []
  vendedores = []
  vendedoreSelected = []
  subtotalArray = []


  subtotalfinal = 0;
  constructor(
    private modalCtrl: ModalController,
    private prodServ: ProductoService,
    private vendedorServ: VendedorService
  ) { }

  ngOnInit() {
    this.showPedidoFinal()  
    this.showEmpresa()
    this.subTotalFinal()
  }

  async subTotalFinal(){
    this.prodServ.getPedidoFinal().subscribe(data => {
      data.map(item => {
        if((item.empresa_pedido === this.nombre_empresa) && (item.id_usuario === this.uid)){
          console.log("empresa: "+item.empresa)
          console.log("usuario: "+item.id_usuario)
          let subtotal = parseFloat(item.subtotal)
          this.subtotalArray.push(subtotal)
          this.subtotalfinal = this.subtotalArray.reduce((a,b) => a+b, 0)
          console.log("subtotal final: "+this.subtotalfinal)
        }
      })
    })
  }

  showEmpresa(){
    this.vendedorServ.getVendedor().subscribe(
      list => {
        this.vendedores = list.map(item => {
          return {
            $key: item.key,
            ...item.payload.val()
          }
        })
        this.vendedores.map(item => {
          console.log("empresa a: "+item.nombre_empresa+" empresa b: "+this.nombre_empresa)
          if(item.nombre_empresa === this.nombre_empresa){
            this.vendedoreSelected.push({
              direccion: item.direccion_vendedor,
              email: item.email_vendedor,
              telefono: item.telefono_vendedor,
              imagen: item.image_vendedor,
              nombre: item.nombre_empresa
            })
          }
        })
      }
    )
  }

  showPedidoFinal(){
    
    this.prodServ.getPedidoFinal().subscribe(data => {
      data.map((item) => {
        //console.log("item: "+item.empresa_proveedor)
        if(item.empresa_pedido === this.nombre_empresa){
          //console.log("item: "+item.empresa_proveedor +' empresa: '+this.nombre_empresa)
          console.log("nombre_pedido: "+item.nombre_pedido)
          this.pedidos.push({
            cantidad_pedido: item.cantidad_pedido,
            categoria_pedido: item.categoria_pedido,
            empresa_pedido: item.empresa_pedido,
            id_pedido: item.id_pedido,
            id_prod: item.id_prod,
            imagen_pedido: item.imagen_pedido,
            nombre_pedido: item.nombre_pedido,
            precio_pedido: item.precio_pedido
          })
        }
      })
    })
  }
  async salir(){
    this.modalCtrl.dismiss()
  }

}
