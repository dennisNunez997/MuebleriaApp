import { importExpr } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { PromocionService } from 'src/app/services/promocion.service';

@Component({
  selector: 'app-promocion',
  templateUrl: './promocion.page.html',
  styleUrls: ['./promocion.page.scss'],
})
export class PromocionPage implements OnInit {

  promociones = []
  textoBuscar = '';

  constructor(
    private menuCtr: MenuController,
    private promocion: PromocionService) { }

  ngOnInit() {
    this.getPromocion()
  }

  buscar(event: CustomEvent){
    this.textoBuscar = event.detail.value;
  }

  getPromocion(){
    this.promocion.getPromocion().subscribe(
      list => {
        this.promociones = list.map(item => {
          return{
            $key: item.key,
            ...item.payload.val()
          }
        })

        this.promociones.map(item => {
          item.titulo_promo
          item.descripcion_promo
          item.image_promo
          item.nombre_empresa
        })
      }
    )
  }

  closeMenu(){
    this.menuCtr.toggle();
  }
}
