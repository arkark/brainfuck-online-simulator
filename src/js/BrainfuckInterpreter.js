import Buckets from 'buckets-js';

const BUFFER_SIZE = 1000;
const CHAR_SIZE = 256;

const sleep = msec => new Promise((resolve) => setTimeout(resolve, msec));

export default class {
  constructor() {
    this.interval = 0;
    this.shouldPause = false;
    this.shouldStop = false;
    this.execListener = ()=>{};
    this.outputListener = ()=>{};
    this.errorListener = ()=>{};
    this.finishListener = ()=>{};
    this.inputQueue = new Buckets.Queue();
  }

  get bufferSize() {
    return BUFFER_SIZE;
  }

  async run(code) {
    await this._run(code);
    this.finishListener();
  }

  async _run(code) {
    let memory = Array.from({length: BUFFER_SIZE}, ()=>0);
    let pointer = 0;
    let programCounter = 0;

    const incPointer = async () => {
      pointer++;
    };
    const decPointer = async () => {
      pointer--;
    };
    const incValue = async () => {
      memory[pointer] = (memory[pointer] + 1)%CHAR_SIZE;
    };
    const decValue = async () => {
      memory[pointer] = (memory[pointer] - 1 + CHAR_SIZE)%CHAR_SIZE;
    };
    const output = async () => {
      this.outputListener(String.fromCharCode(memory[pointer]));
    };
    const input = async () => {
      while(this.inputQueue.isEmpty()) {
        // waiting for any input to be added to this.inputQueue
        await sleep(100);
        if (this.shouldStop) return;
      }
      memory[pointer] = this.inputQueue.dequeue();
    };
    const jumpForward = async () => {
      if (memory[pointer] != 0) return;
      for(let level=0; ; programCounter++) {
        if (programCounter<0 || programCounter>=code.length) {
          this.errorListener("Error: matching `]` command is not found");
          return;
        }
        if (code[programCounter] == '[') level++;
        if (code[programCounter] == ']') level--;
        if (level == 0) break;
      }
    };
    const jumpBackward = async () => {
      if (memory[pointer] == 0) return;
      for(let level=0; ; programCounter--) {
        if (programCounter<0 || programCounter>=code.length) {
          this.errorListener("Error: matching `[` command is not found");
          return;
        }
        if (code[programCounter] == '[') level--;
        if (code[programCounter] == ']') level++;
        if (level == 0) break;
      }
    };

    this.shouldPause = false;
    this.shouldStop = false;
    for(let i=0; i<BUFFER_SIZE; i++) {
      this.execListener(i, memory);
    }
    this.inputQueue.clear();

    for(; programCounter<code.length; programCounter++) {
      if (this.shouldStop) return;
      while(this.shouldPause) {
        // waiting for resume
        await sleep(100);
      }
      if (pointer<0 || pointer>=BUFFER_SIZE) {
        this.errorListener("Error: out of memory");
        return;
      }
      switch(code[programCounter]) {
        case '>': await incPointer(); break;
        case '<': await decPointer(); break;
        case '+': await incValue(); break;
        case '-': await decValue(); break;
        case '.': await output(); break;
        case ',': await input(); break;
        case '[': await jumpForward(); break;
        case ']': await jumpBackward(); break;
        default: continue;
      }
      this.execListener(pointer, memory);
      if (this.interval > 0) {
        await sleep(this.interval);
      }
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
    this.inputQueue.add((ch%CHAR_SIZE + CHAR_SIZE)%CHAR_SIZE);
  }

}
