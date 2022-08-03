'use strict';
import iconv from "iconv-lite";
import {MutableBuffer} from "mutable-buffer";
import * as _ from "./commands";
import {Adapter} from "escpos-adapter";

export interface ScreenOptions {
  encoding?: string | undefined;
}

/**
 * [function ESC/POS Screen]
 */
export default class Screen<T extends unknown[]> {
  private adapter: Adapter<T>;
  private buffer: MutableBuffer;
  private encoding: string;

  /**
   * @param  {[Adapter]} adapter [eg: usb, network, or serialport]
   * @param  {[ScreenOptions]} options
   * @return {[Screen]} Screen  [the escpos Screen instance]
   */
  constructor(adapter: Adapter<T>, options?: ScreenOptions) {
    this.adapter = adapter;
    this.buffer = new MutableBuffer();
    this.encoding = options?.encoding ?? 'GB18030';
  }

  /**
   * Clears all displayed characters
   * @return {[Screen]} Screen  [the escpos Screen instance]
   */
  clear() {
    this.buffer.write(_.SCREEN.CLR);
    return this;
  };

  /**
   * Clears the line containing the cursor
   * @return {[Screen]} Screen  [the escpos Screen instance]
   */
  clearLine() {
    this.buffer.write(_.SCREEN.CAN);
    return this;
  };

  /**
   * Moves the cursor up one line
   * @return {[Screen]} Screen  [the escpos Screen instance]
   */
  moveUp() {
    this.buffer.write(_.SCREEN.US_LF);
    return this;
  };

  /**
   * Moves the cursor one character position to the left
   * @return {[Screen]} Screen  [the escpos Screen instance]
   */
  moveLeft() {
    this.buffer.write(_.SCREEN.BS);
    return this;
  };

  /**
   * Moves the cursor one character position to the right
   * @return {[Screen]} Screen  [the escpos Screen instance]
   */
  moveRight() {
    this.buffer.write(_.SCREEN.HT);
    return this;
  };

  /**
   * Moves the cursor down one line
   * @return {[Screen]} Screen  [the escpos Screen instance]
   */
  moveDown() {
    this.buffer.write(_.SCREEN.LF);
    return this;
  };

  /**
   * Moves the cursor to the left-most position on the upper line (home position)
   * @return {[Screen]} Screen  [the escpos Screen instance]
   */
  moveHome() {
    this.buffer.write(_.SCREEN.HOM);
    return this;
  };

  /**
   * Moves the cursor to the right-most position on the current line
   * @return {[Screen]} Screen  [the escpos Screen instance]
   */
  moveMaxRight() {
    this.buffer.write(_.SCREEN.US_CR);
    return this;
  };

  /**
   * Moves the cursor to the left-most position on the current line
   * @return {[Screen]} Screen  [the escpos Screen instance]
   */
  moveMaxLeft() {
    this.buffer.write(_.SCREEN.CR);
    return this;
  };

  /**
   * Moves the cursor to the bottom position
   * @return {[Screen]} Screen  [the escpos Screen instance]
   */
  moveBottom() {
    this.buffer.write(_.SCREEN.US_B);
    return this;
  };

  /**
   * Moves the cursor to the nth position on the mth line
   * @param  {[type]}   n       [description]
   * @param  {[type]}   m       [description]
   * @return {[Screen]} Screen  [the escpos Screen instance]
   */
  move(n: number, m: number) {
    this.buffer.write(_.SCREEN.US_$);
    this.buffer.writeUInt8(n);
    this.buffer.writeUInt8(m);
    return this;
  };

  /**
   * Selects overwrite mode as the screen display mode
   * @return {[Screen]} Screen  [the escpos Screen instance]
   */
  overwrite() {
    this.buffer.write(_.SCREEN.US_MD1);
    return this;
  };

  /**
   * Selects vertical scroll mode as the screen display mode
   * @return {[Screen]} Screen  [the escpos Screen instance]
   */
  verticalScroll() {
    this.buffer.write(_.SCREEN.US_MD2);
    return this;
  };

  /**
   * Selects horizontal scroll mode as the display screen mode
   * @return {[Screen]} Screen  [the escpos Screen instance]
   */
  horizontalScroll() {
    this.buffer.write(_.SCREEN.US_MD3);
    return this;
  };

  /**
   * Turn cursor display mode on/off
   * @param  {[type]}   visible [description]
   * @return {[Screen]} Screen  [the escpos Screen instance]
   */
  cursor(visible: boolean) {
    this.buffer.write(_.SCREEN.US_C);
    this.buffer.writeUInt8(visible ? 1 : 0);
    return this;
  };

  /**
   * Sets display screen blank interval
   * @param  {[type]}   step    [description]
   * @return {[Screen]} Screen  [the escpos Screen instance]
   */
  blink(step: number) {
    this.buffer.write(_.SCREEN.US_E);
    this.buffer.writeUInt8(step);
    return this;
  };

  /**
   * Sets the counter time and displays it in the bottom right of the screen
   * @param  {[type]}   h       [description]
   * @param  {[type]}   m       [description]
   * @return {[Screen]} Screen  [the escpos Screen instance]
   */
  timer(h: number, m: number) {
    this.buffer.write(_.SCREEN.US_T);
    this.buffer.writeUInt8(h);
    this.buffer.writeUInt8(m);
    return this;
  };

  /**
   * Displays the time counter at the right side of the bottom line
   * @return {[Screen]} Screen  [the escpos Screen instance]
   */
  displayTimer() {
    this.buffer.write(_.SCREEN.US_U);
    return this;
  };

  /**
   * Set brightness
   * @param  {[type]}   level   [description]
   * @return {[Screen]} Screen  [the escpos Screen instance]
   */
  brightness(level: number) {
    this.buffer.write(_.SCREEN.US_X);
    this.buffer.writeUInt8(level);
    return this;
  };

  /**
   * Selects or cancels reverse display of the characters received after this command
   * @param  {[type]}   enable       [description]
   * @return {[Screen]} Screen  [the escpos Screen instance]
   */
  reverse(enable: boolean) {
    this.buffer.write(_.SCREEN.US_r);
    this.buffer.writeUInt8(enable ? 1 : 0);
    return this;
  };

  /**
   * Set status confirmation for DTR signal
   * @param  {[type]}   n       [description]
   * @return {[Screen]} Screen  [the escpos Screen instance]
   */
  DTR(n: boolean) {
    this.buffer.write(_.SCREEN.US_v);
    this.buffer.writeUInt8(n ? 1 : 0);
    return this;
  };

  /**
   * [function print]
   * @param  {[String]}  content  [mandatory]
   * @return {[Screen]} Screen  [the escpos Screen instance]
   */
  print(content: string | Buffer) {
    this.buffer.write(content);
    return this;
  };

  /**
   * [function Print encoded alpha-numeric text with End Of Line]
   * @param  {[String]}  content  [mandatory]
   * @param  {[String]}  encoding [optional]
   * @return {[Screen]} Screen  [the escpos Screen instance]
   */
  text(content: string, encoding = this.encoding) {
    return this.print(iconv.encode(content, encoding));
  };

  /**
   * [function encode text]
   * @param  {[String]}  encoding [mandatory]
   * @return {[Screen]} Screen  [the escpos Screen instance]
   */
  encode(encoding: string) {
    this.encoding = encoding;
    return this;
  };

  /**
   * Send data to hardware and flush buffer
   * @return {[Screen]} printer  [the escpos printer instance]
   */
  flush() {
    const buf = this.buffer.flush();
    this.adapter.write(buf);
    return this;
  };

  /**
   * [close description]
   * @param  {Function} callback [description]
   * @param  {[type]}   closeArgs  [description]
   * @return {[type]}            [description]
   */
  close(callback: (error: Error | null) => void, ...closeArgs: T) {
    this.flush();
    this.adapter.close(callback, ...closeArgs);
  };
}
