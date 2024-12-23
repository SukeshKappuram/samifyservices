import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.scss'],
})
export class CaptchaComponent implements OnInit {
  @Input() config: any = {
    type: 1,
    length: 6,
    cssClass: 'custom',
    back: {
      stroke: '#049aad',
      solid: '#f2efd2',
    },
    font: {
      color: '#000000',
      size: '50px',
      style:'bold'
    },
  };
  @Output() captchaCode = new EventEmitter();
  @Output() captchaResultUpdated = new EventEmitter();

  captch_input = '';
  captchInput: any = {};
  code: any = null;
  resultCode: any = null;
  checkCaptchaValue = false;
  isCaptchaValid = false;

  ngOnInit(): void {
    this.createCaptcha();
  }

  onSubmit() {
    if (this.captch_input !== this.resultCode) {
      this.showError();
      this.captch_input = '';
      this.reloadCaptcha();
    } else {
      this.captchInput['errors'] = false;
      this.isCaptchaValid = true;
      this.captchaResultUpdated.emit(this.isCaptchaValid);
    }
  }

  showError() {
    this.captchInput['touched'] = true;
    this.captchInput['errors'] = true;
  }

  checkCaptcha() {
    if (this.captch_input === this.resultCode) {
      this.checkCaptchaValue = true;
      return true;
    } else {
      this.checkCaptchaValue = false;
      return false;
    }
  }

  createCaptcha() {
    switch (this.config.type) {
      case 1:
        const char =
          Math.random().toString(24).substring(2, this.config.length) +
          Math.random().toString(24).substring(2, 4).toUpperCase();
        this.code = this.resultCode = char;
        break;
      case 2:
        const num1 = Math.floor(Math.random() * 99);
        const num2 = Math.floor(Math.random() * 9);
        const operators = ['+', '-'];
        const operator =
          operators[Math.floor(Math.random() * operators.length)];
        this.code = num1 + operator + num2 + '=?';
        this.resultCode = operator == '+' ? num1 + num2 : num1 - num2;
        break;
    }
    setTimeout(() => {
      const captcahCanvas: any = document.getElementById('captcahCanvas');
      if(!captcahCanvas){
        return;
      }
      const ctx = captcahCanvas.getContext('2d');
      ctx.fillStyle = this.config.back.solid;
      ctx.fillRect(0, 0, captcahCanvas.width, captcahCanvas.height);

      ctx.beginPath();

      captcahCanvas.style.letterSpacing = 15 + 'px';
      ctx.font =
        this.config.font.style +
        ' ' +
        this.config.font.size +
        ' ' +
        this.config.font.family;
      ctx.fillStyle = this.config.font.color;
      ctx.textBaseline = 'middle';
      ctx.fillText(this.code, 40, 50);
      if (this.config.back.stroke) {
        ctx.strokeStyle = this.config.back.stroke;
        for (let i = 0; i < 150; i++) {
          ctx.moveTo(Math.random() * 300, Math.random() * 300);
          ctx.lineTo(Math.random() * 300, Math.random() * 300);
        }
        ctx.stroke();
      }
      this.captchaCode.emit(this.code);
      this.captchaResultUpdated.emit(false);
    }, 100);
  }

  reloadCaptcha(): void {
    this.isCaptchaValid= false
    this.createCaptcha();
  }
}
