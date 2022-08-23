import { LightningElement, api, track } from 'lwc';
import {
    FlowAttributeChangeEvent
} from 'lightning/flowSupport';
import getStatesByCity from '@salesforce/apex/DynamicPicklistCityController.getStatesByCity';

export default class DynamicPicklistCity extends LightningElement {

    @track _cidadeSelecionada;
    @track estados;
    @track cidades;
    @track estadoSelecionado;
    @track cidadesByEstado;

    @api
    get cidadeSelecionada(){
        return this._cidadeSelecionada;
    }

    set cidadeSelecionada(cidade){
        this._cidadeSelecionada = cidade;
    }

    alreadyConnected = false;

    connectedCallback(){
        if(this.alreadyConnected) return;
        this.alreadyConnected = true;

        this.load();
    }

    load(){
        getStatesByCity().then(result => {
            this.cidadesByEstado = JSON.parse(result);
            this.estados = [];
            for(var estado in this.cidadesByEstado){
                this.estados.push({label: estado, value: estado});
            }
        }).catch(err => {
            console.error(err);
        })
    }

    handleEstadoChange(event){
        var estadoSelecionado = event.detail.value;
        for(var estado in this.cidadesByEstado){
            if(estado == estadoSelecionado){
                this.cidades = [];
                
                for(var cid of this.cidadesByEstado[estado]){
                    this.cidades.push({label: cid.Name, value: cid.Id});
                }

                break;
            }
        }
        this.estadoSelecionado = estadoSelecionado;
    }

    handleCidadeChange(event){
        this.cidadeSelecionada = event.detail.value;
        const attributeChangeEvent = new FlowAttributeChangeEvent('cidadeSelecionada', this._cidadeSelecionada);
        this.dispatchEvent(attributeChangeEvent);
    }

    get isCidadeDisabled(){
        return !this.estadoSelecionado;
    }

    get isEstadoDisabled(){
        return !this.estados || this.estados.length == 0;
    }

}