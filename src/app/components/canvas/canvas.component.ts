import { Component, OnInit, OnChanges, Renderer, Input, ViewChild, SimpleChanges, AfterViewInit } from '@angular/core';

export interface DrawEvent {
  type : string
}

export interface DrawEventSettings extends DrawEvent {
  color : string,
  width : number
}

export interface DrawEventPoint extends DrawEvent {
  x : number,
  y : number
}

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() color: string;
  @Input() lineWidth : number;
  @Input() drawable: boolean;
  @ViewChild("canvas") canvas : any;
  drawEvents: any[];
  redoEvents: any[];
  canvasElement : any;
  previousX : number;
  previousY : number;
  context: any;
  rect: any;

  constructor(private renderer: Renderer) {
    this.drawEvents = [];
    this.redoEvents = [];
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.canvasElement = this.canvas.nativeElement;
    this.renderer.setElementAttribute(this.canvasElement, "height", "400");
    this.context = this.canvasElement.getContext('2d');
  }

  ngOnChanges(changes: SimpleChanges) {
    // if(this.drawEvents){
    //   this.drawEvents.push({
    //     type: 'settings',
    //     color: this.color,
    //     width: this.lineWidth
    //   });
    // }
  }

  start(event){
    if(this.drawable){

      this.redoEvents = [];

      this.rect = this.canvasElement.getBoundingClientRect();
      // this.startDrawing(event.touches[0].clientX, event.touches[0].clientY);
      this.startDrawing(event.touches[0].clientX - this.rect.left, event.touches[0].clientY - this.rect.top);

      this.drawEvents.push({
        type: 'settings',
        color: this.color,
        width: this.lineWidth
      });
      this.drawEvents.push({
        type: event.type,
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      });
    }
  }

  startDrawing(x:number, y:number){
    this.previousX = x;
    this.previousY = y;

    this.context.lineJoin = 'round';
    this.context.beginPath();
    this.context.arc(this.previousX, this.previousY, this.lineWidth/2, 0, 2 * Math.PI, false);
    this.context.fillStyle = this.color;
    this.context.fill();
    this.context.closePath();
  }

  move(event){
    if(this.drawable){
      this.moveDrawing(event.touches[0].clientX - this.rect.left, event.touches[0].clientY - this.rect.top);

      this.drawEvents.push({
        type: event.type,
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      });
    }
  }

  moveDrawing(x:number, y:number){

    let currentX = x;
    let currentY = y;

    this.context.lineJoin = 'round';
    this.context.beginPath();
    this.context.moveTo(this.previousX, this.previousY);
    this.context.lineTo(currentX, currentY);
    this.context.closePath();
    this.context.lineWidth = this.lineWidth;
    this.context.strokeStyle = this.color;
    this.context.stroke();

    this.previousX = currentX;
    this.previousY = currentY;

  }

  clear(){
    this.clearDrawing();
    this.drawEvents.push({
      type: 'clear'
    });
  }

  clearDrawing(){
    this.context.rect(0, 0, 1000, 1000);
    this.context.fillStyle = '#ffffff';
    this.context.fill();
  }

  drawWithTimeout(item, timeout: number) {
    this.rect = this.canvasElement.getBoundingClientRect();

    if(item.type === 'touchstart') {
      timeout += 50;
    }
    if(item.type === 'touchmove') {
      timeout += 50;
    }

    setTimeout(() => {
      if(item.type === 'touchstart') {

        this.startDrawing(item.x - this.rect.left, item.y - this.rect.top);
      }

      if(item.type === 'touchmove') {

        this.moveDrawing(item.x - this.rect.left, item.y - this.rect.top);

      }

      if(item.type ==='settings'){
        this.color = item.color;
        this.lineWidth = item.width;
      }

      if(item.type ==='clear'){
        this.clearDrawing();
      }

    }, timeout);
    return timeout;
  }

  draw(item) {
    this.rect = this.canvasElement.getBoundingClientRect();
    if(item.type === 'touchstart') {
      this.startDrawing(item.x - this.rect.left, item.y - this.rect.top);
    }

    if(item.type === 'touchmove') {
      this.moveDrawing(item.x - this.rect.left, item.y - this.rect.top);
    }

    if(item.type ==='settings'){
      this.color = item.color;
      this.lineWidth = item.width;
    }

    if(item.type ==='clear'){
      this.clearDrawing();
    }
  }

  drawAllWithTimeout(){
    let timeout = 50;
    if(this.drawEvents) {
      this.drawEvents.forEach((item, index, array) => {
          timeout = this.drawWithTimeout(item, timeout);
        });
    }
  }

  drawAll(){
    if(this.drawEvents) {
      this.drawEvents.forEach((item, index, array) => {
          this.draw(item);
        });
    }
  }

  setAndDrawAllWithTimeout(drawEvents){
    this.drawEvents = drawEvents;
    this.drawAllWithTimeout();
  }

  undo(){
    let event, color = this.color, width = this.lineWidth;


    event = this.drawEvents[this.drawEvents.length-1];
    if(event && event.type === 'clear'){
      this.redoEvents.push(this.drawEvents.pop());
    } else {
      while (event && event.type !== "settings"){
        this.redoEvents.push(this.drawEvents.pop());
        event = this.drawEvents[this.drawEvents.length-1];
      }
      if(event) this.redoEvents.push(this.drawEvents.pop());
    }

    this.clearDrawing();
    this.drawAll();
    this.color = color;
    this.lineWidth = width;
  }

  redo(){
    if (this.redoEvents.length !== 0){
      let event;

      console.log("%o %o", this.redoEvents, this.redoEvents[this.redoEvents.length-1]);

      event = this.redoEvents[this.redoEvents.length-1];
      if(event && event.type === 'clear'){
        this.drawEvents.push(this.redoEvents.pop());
      } else {
        this.drawEvents.push(this.redoEvents.pop());
        event = this.redoEvents[this.redoEvents.length-1];
        while(event && (event.type !=='clear' && event.type !=='settings')){
          this.drawEvents.push(this.redoEvents.pop());
          event = this.redoEvents[this.redoEvents.length-1];
        }
      }

      this.drawAll();
    }
    
  }

}
