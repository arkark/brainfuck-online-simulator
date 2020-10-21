import Buckets from "buckets-js";

const BUFFER_SIZE = 1000;
const CHAR_SIZE = 256;

const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec));

export default class {
  constructor() {
    this.interval = 0;
    this.shouldPause = false;
    this.shouldStop = false;
    this.execListener = () => {};
    this.outputListener = () => {};
    this.errorListener = () => {};
    this.finishListener = () => {};
    this.inputQueue = new Buckets.Queue();
    this.parenMap = new Map();
    this.dupCountArray = null;
  }

  get bufferSize() {
    return BUFFER_SIZE;
  }

  async run(code) {
    await this._init(code);
    await this._run(code);
    this.finishListener();
  }

  async _init(code) {
    this.shouldPause = false;
    this.shouldStop = false;
    this.inputQueue.clear();
    this.parenMap.clear();

    const stack = new Buckets.Stack();
    for (
      let programCounter = 0;
      programCounter < code.length;
      programCounter++
    ) {
      switch (code[programCounter]) {
        case "[":
          {
            stack.push(programCounter);
          }
          break;
        case "]":
          {
            if (!stack.isEmpty()) {
              let begin = stack.pop();
              let end = programCounter;
              this.parenMap.set(begin, end);
              this.parenMap.set(end, begin);
            }
          }
          break;
      }
    }

    this.dupCountArray = Array.from({ length: code.length }, () => 0);
    let lastCh = null;
    let cnt = 0;
    for (
      let programCounter = code.length - 1;
      programCounter >= 0;
      programCounter--
    ) {
      let ch = code[programCounter];
      if (ch != lastCh || ch == "[" || ch == "]" || ch == "." || ch == ",") {
        lastCh = ch;
        cnt = 0;
      }
      this.dupCountArray[programCounter] = ++cnt;
    }
  }

  async _run(code) {
    let memory = Array.from({ length: BUFFER_SIZE }, () => 0);
    let pointer = 0;
    let programCounter = 0;

    for (let i = 0; i < BUFFER_SIZE; i++) {
      this.execListener(i, memory);
    }

    while (programCounter < code.length) {
      let optMode = this.interval == 0;
      let dupCount = optMode ? this.dupCountArray[programCounter] : 1;

      if (this.shouldStop) return;
      while (this.shouldPause) {
        // waiting for resume
        if (Math.random() < 0.1) await sleep(100);
      }
      if (pointer < 0 || pointer >= BUFFER_SIZE) {
        this.errorListener("Error: out of memory");
        return;
      }
      switch (code[programCounter]) {
        case ">":
          {
            pointer += dupCount;
          }
          break;
        case "<":
          {
            pointer -= dupCount;
          }
          break;
        case "+":
          {
            memory[pointer] = (memory[pointer] + dupCount) % CHAR_SIZE;
          }
          break;
        case "-":
          {
            memory[pointer] =
              (((memory[pointer] - dupCount) % CHAR_SIZE) + CHAR_SIZE) %
              CHAR_SIZE;
          }
          break;
        case ".":
          {
            this.outputListener(String.fromCharCode(memory[pointer]));
            await sleep(0);
          }
          break;
        case ",":
          {
            while (this.inputQueue.isEmpty()) {
              // waiting for any input to be added to this.inputQueue
              await sleep(100);
              if (this.shouldStop) return;
            }
            memory[pointer] = this.inputQueue.dequeue();
          }
          break;
        case "[":
          {
            if (memory[pointer] == 0) {
              programCounter = this.parenMap.get(programCounter);
              if (typeof programCounter === "undefined") {
                this.errorListener("Error: matching `]` command is not found");
                return;
              }
            }
          }
          break;
        case "]":
          {
            if (memory[pointer] != 0) {
              programCounter = this.parenMap.get(programCounter);
              if (typeof programCounter === "undefined") {
                this.errorListener("Error: matching `[` command is not found");
                return;
              }
            }
          }
          break;
      }
      this.execListener(pointer, memory);
      if (!optMode) {
        await sleep(this.interval);
      }
      programCounter += dupCount;
    }
  }

  pause() {
    this.shouldPause = true;
  }

  resume() {
    this.shouldPause = false;
  }

  stop() {
    this.shouldStop = true;
  }

  setInterval(interval) {
    this.interval = interval;
  }
  setExecListener(listener) {
    this.execListener = listener;
  }
  setOutputListener(listener) {
    this.outputListener = listener;
  }
  setErrorListener(listener) {
    this.errorListener = listener;
  }
  setFinishListener(listener) {
    this.finishListener = listener;
  }

  addInput(ch) {
    this.inputQueue.add(((ch % CHAR_SIZE) + CHAR_SIZE) % CHAR_SIZE);
  }
}
