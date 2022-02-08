import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { VendedorService } from 'src/app/services/vendedor.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MenuController, ModalController } from '@ionic/angular';
import { HistorialpedidosPage } from '../historialpedidos/historialpedidos.page';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/compat/database';
@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.page.html',
  styleUrls: ['./pedido.page.scss'],
})
export class PedidoPage implements OnInit {

  vendedores = []
  pedidos = []
  duplicados = []
  duplicado_vendedores = []

  //pedidos
  pedidosFltr: any[];
  pedidosAngularList: AngularFireList<any>
  filtrpedidos: any[];

  pedidos_duplicados= [];

  constructor(
    private afs: AngularFireDatabase,
    private productServ: ProductoService,
    private VendedorServ: VendedorService,
    private auth: AngularFireAuth,
    private MenuCtrl: MenuController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.auth.onAuthStateChanged(user => {
      //this.pedidoFinal(user.uid)
      this.showEmpresa(user.uid)
    })
  }

  
  showEmpresa(id_user){
    this.pedidosAngularList = this.afs.list('pedido_final/')
    this.pedidosAngularList.snapshotChanges().subscribe(
      list => {
        this.pedidosFltr = list.map(item => {
          return{
            $key: item.key,
            ...item.payload.val()
          }
        })
        this.filtrpedidos = this.pedidosFltr.filter(value => value.id_usuario === id_user)
        this.pedidos_duplicados = Array.from(this.filtrpedidos.reduce((map, obj) => map.set(obj.fecha_pedido, obj), new Map()).values())
        this.pedidos_duplicados.map(dta => {
          console.log("fecha; "+dta.empresa_pedido)
        })
      }

    )

    /*
      this.productServ.getPedidoFinal().subscribe(data => {
      data.map((item) => {
        if(id_user === item.id_usuario){
          this.pedidos.push({
            empresa: item.empresa_pedido,
            imagen: item.imagen_empresa
          })
          this.duplicados = Array.from(this.pedidos.reduce((map, obj) => map.set(obj.empresa, obj), new Map()).values())
          this.duplicados.map((duplicado) => {
           console.log("duplicado: "+duplicado.empresa)
            
          })
        }
      })
    })
    */

    
    
  }

  
  pedidoFinal(id_user){


    this.productServ.getPedidoFinal().subscribe(data => {
      data.map((item) => {
        if(id_user === item.id_usuario){
          this.pedidos.push(
            {
              empresa: item.empresa_pedido
            }
          )
          this.duplicados = Array.from(this.pedidos.reduce((map, obj) => map.set(obj.empresa, obj), new Map()).values())
          this.duplicados.map((item) => {
            //console.log("empresas usuario: "+item.empresa)
            this.VendedorServ.getVendedores().subscribe(data => {
              data.map((vendedor) => {
                //console.log("vendedor pedido: "+item.empresa)
                //console.log("proveedor: "+vendedor.nombre_empresa)
                if(item.empresa === vendedor.nombre_empresa){
                  //console.log("empresa verificada")
                  this.vendedores.push({
                    imagen: vendedor.image_vendedor,
                    nombre: vendedor.nombre_empresa
                  })
                  this.duplicado_vendedores = Array.from(this.vendedores.reduce((map, obj) => map.set(obj.nombre_empresa, obj), new Map()).values())
                  
                }  
              })
            })
          })
          //console.log("duplicados: "+this.duplicados)
        }
      })
    }
      
    )
  }

  
  async getListpedidos(nombre){
    const modal = await this.modalCtrl.create({
      component: HistorialpedidosPage,
      componentProps: {
        nombre_empresa: nombre
      }
    })
    await modal.present()
  }
  

  toggleMenu(){
    this.MenuCtrl.toggle()
  }

}
