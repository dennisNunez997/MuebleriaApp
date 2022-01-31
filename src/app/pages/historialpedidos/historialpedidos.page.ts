import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { VendedorService } from 'src/app/services/vendedor.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-historialpedidos',
  templateUrl: './historialpedidos.page.html',
  styleUrls: ['./historialpedidos.page.scss'],
})
export class HistorialpedidosPage implements OnInit {

  @Input() nombre_empresa
  pedidos = []
  vendedores = []
  vendedoreSelected = []
  subtotalArray = []

  subtotalfinal = null;

  direccion: string;
  telefono: string;
  email: string;

  constructor(
    private modalCtrl: ModalController,
    private vendedorServ: VendedorService,
    private prodServ: ProductoService
  ) { }

  ngOnInit() {
    this.showPedidoFinal()
    this.subTotalFinal()
    this.showEmpresa()
  }

  subTotalFinal(){
    this.prodServ.getPedidoFinal().subscribe(data => {
      data.map(item => {
        if(item.empresa_pedido === this.nombre_empresa){
          let subtotal = parseFloat(item.subtotal)
          this.subtotalArray.push(subtotal)
          this.subtotalfinal = this.subtotalArray.reduce((a,b) => a+b, 0)
          //console.log("subtotal final: "+this.subTotalFinal)
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
           
          if(item.nombre_empresa === this.nombre_empresa){
            this.direccion = item.direccion_vendedor
            this.telefono = item.telefono_vendedor
            this.email = item.email_vendedor
            console.log("direccion: "+this.direccion)
            console.log("telefono: "+this.telefono)
            console.log("email: "+this.email)
          }
        })
      }
    )
  }

  showPedidoFinal()
  {
    this.prodServ.getPedidoFinal().subscribe(data => {
      data.map((item) => {
        if(item.empresa_pedido === this.nombre_empresa){
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

  close(){
    this.modalCtrl.dismiss()
  }

}
