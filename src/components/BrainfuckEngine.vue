<template>
  <section class="engine" height="auto">
    <b-field label="Code:">
      <b-input type="textarea" v-model="code"></b-input>
    </b-field>

    <b-collapse
      class="card"
      :open="visualizingMemory"
      @open="visualizingMemory = true"
      @close="visualizingMemory = false"
    >
      <div slot="trigger" slot-scope="props" class="card-header">
        <p class="card-header-title">Memory:</p>
        <a class="card-header-icon">
          <b-icon pack="fas" :icon="props.open ? 'caret-up' : 'caret-down'">
          </b-icon>
        </a>
      </div>
      <div class="card-content">
        <div
          class="content"
          style="height: 150px; overflow-y: scroll"
          v-if="visualizingMemory"
        >
          <div
            class="is-cell code"
            :class="index == pointer ? 'is-current' : 'is-not-current'"
            v-for="(value, index) in memory"
            :key="index"
          >
            {{ showValue(value) }}
          </div>
        </div>
      </div>
      <div class="card-footer">
        <nav
          class="breadcrumb is-centered card-footer-item"
          aria-label="breadcrumbs"
        >
          <ul>
            <li :class="memoryShowMode == 0 ? `is-active` : ``">
              <a @click="memoryShowMode = 0">dec</a>
            </li>
            <li :class="memoryShowMode == 1 ? `is-active` : ``">
              <a @click="memoryShowMode = 1">hex</a>
            </li>
            <li :class="memoryShowMode == 2 ? `is-active` : ``">
              <a @click="memoryShowMode = 2">char</a>
            </li>
          </ul>
        </nav>
      </div>
    </b-collapse>

    <div class="level is-mobile" style="margin: 12px 0px">
      <div class="level-left">
        <div class="level-item">
          <div class="field has-addons">
            <div class="control">
              <button
                class="button"
                @click="isPausing ? resume() : run()"
                :disabled="isRunning && !isPausing"
              >
                <b-icon pack="fas" icon="play"></b-icon>
              </button>
            </div>
            <div class="control">
              <button
                class="button"
                @click="pause"
                :disabled="!isRunning || isPausing"
              >
                <b-icon pack="fas" icon="pause"></b-icon>
              </button>
            </div>
            <div class="control">
              <button class="button" @click="stop" :disabled="!isRunning">
                <b-icon pack="fas" icon="stop"></b-icon>
              </button>
            </div>
          </div>
        </div>
        <div class="level-item">
          <b-tooltip
            type="is-dark"
            class="is-fullwidth"
            :label="'Interval: ' + interval + ' ms'"
            position="is-right"
            always
          >
            <input
              type="range"
              class="slider"
              min="0"
              max="100"
              step="1"
              v-model="interval"
              style="margin-right: 0.5em"
            />
          </b-tooltip>
        </div>
      </div>
    </div>

    <form @submit.prevent="input" style="margin: 12px 0px">
      <b-field>
        <b-input v-model="inputText" :disabled="isRunning && !inPause">
        </b-input>
        <div class="control">
          <button class="button is-dark" :disabled="isRunning && !inPause">
            Input Text
          </button>
        </div>
      </b-field>
    </form>

    <form @submit.prevent="inputCharCode" style="margin: 12px 0px">
      <b-field>
        <b-input
          v-model.number="inputCode"
          :disabled="isRunning && !inPause"
          type="number"
          min="0"
          max="255"
          step="1"
        >
        </b-input>
        <div class="control">
          <button class="button is-dark" :disabled="isRunning && !inPause">
            Input Value
          </button>
        </div>
      </b-field>
    </form>

    <b-checkbox v-model="repeatHistory"> Repeat History </b-checkbox>

    <b-field label="Input history:">
      <div class="field">
        <b-input
          type="textarea"
          :rows="inputHistoryRows"
          v-model="inputHistoryText"
          ref="inputHistory"
          readonly
        >
        </b-input>
        <div class="control">
          <button
            class="button is-small"
            @click="inputHistoryRows = Math.max(1, inputHistoryRows - 1)"
          >
            <b-icon pack="fas" icon="angle-double-up"></b-icon>
          </button>
          <button class="button is-small" @click="inputHistoryRows++">
            <b-icon pack="fas" icon="angle-double-down"></b-icon>
          </button>
          <button class="button is-small" @click="clearInputHistory">
            <b-icon pack="fas" icon="times"></b-icon>
          </button>
        </div>
      </div>
    </b-field>

    <b-field label="Output:" :type="hasError ? 'is-danger' : ''">
      <div class="field">
        <b-input
          type="textarea"
          :rows="outputRows"
          :value="hasError ? errorMessage : outputMessage"
          ref="output"
          readonly
        >
        </b-input>
        <div class="control">
          <button
            class="button is-small"
            @click="outputRows = Math.max(1, outputRows - 1)"
          >
            <b-icon pack="fas" icon="angle-double-up"></b-icon>
          </button>
          <button class="button is-small" @click="outputRows++">
            <b-icon pack="fas" icon="angle-double-down"></b-icon>
          </button>
          <button class="button is-small" @click="clearOutput">
            <b-icon pack="fas" icon="times"></b-icon>
          </button>
        </div>
      </div>
    </b-field>
  </section>
</template>

<script>
import Interpreter from "@/js/BrainfuckInterpreter.js";
import "bulma-slider/dist/css/bulma-slider.min.css";

const defaultCode =
  "+++++++++[>++++++++>+++++++++++>+++++<<<-]>.>++.+++++++..+++.>-.------------.<++++++++.--------.+++.------.--------.>+.";
import puzzleCode from "@/../15puzzle-brainfuck/src/15puzzle.bf";

export default {
  data: function () {
    const code = this.$route.name === "15puzzle" ? puzzleCode : defaultCode;
    return {
      code,
      inputText: "",
      inputCode: 0,
      inputHistory: [],
      repeatHistory: false,
      interpreter: new Interpreter(),
      outputMessage: "",
      errorMessage: "",
      inputHistoryRows: 3,
      outputRows: 10,
      isRunning: false,
      isPausing: false,
      interval: 0,
      pointer: 0,
      memory: [],
      memoryShowMode: 0, // dec, hex, char
      visualizingMemory: false,
    };
  },
  computed: {
    hasError: function () {
      return this.errorMessage.length != 0;
    },
    inputHistoryText: function () {
      return this.inputHistory
        .map((history) =>
          history.type == "text" ? history.val : this.toChar(history.val)
        )
        .join("\n");
    },
  },
  watch: {
    interval: function (value) {
      this.interpreter.setInterval(value);
    },
    inputHistory: function () {
      this.scrollToBottom("inputHistory");
    },
    outputMessage: function () {
      this.scrollToBottom("output");
    },
  },
  mounted: function () {
    this.interpreter.setOutputListener((ch) => (this.outputMessage += ch));
    this.interpreter.setExecListener((pointer, memory) => {
      this.pointer = pointer;
      this.$set(this.memory, pointer, memory[pointer]);
    });
    this.interpreter.setErrorListener(
      (message) => (this.errorMessage = message)
    );
    this.interpreter.setFinishListener(() => {
      this.isRunning = false;
      this.isPausing = false;
    });
    this.memory = Array.from({ length: this.interpreter.bufferSize }, () => 0);
  },
  methods: {
    run: function () {
      this.isRunning = true;
      this.outputMessage = "";
      this.errorMessage = "";

      this.interpreter.run(this.code);

      if (this.repeatHistory) {
        for (const history of this.inputHistory) {
          switch (history.type) {
            case "code":
              this.addCharCode(history.val);
              break;

            case "text":
              this.addText(history.val);
              break;
          }
        }
      } else {
        this.inputHistory = [];
      }
    },
    stop: function () {
      this.resume();
      this.interpreter.stop();
    },
    pause: function () {
      this.isPausing = true;
      this.interpreter.pause();
    },
    resume: function () {
      this.interpreter.resume();
      this.isPausing = false;
    },
    addText: function (text) {
      for (let ch of text) {
        this.interpreter.addInput(ch.charCodeAt(0));
      }
    },
    addCharCode: function (charCode) {
      this.interpreter.addInput(charCode);
    },
    input: function () {
      this.addText(this.inputText);
      this.inputHistory = [
        ...this.inputHistory,
        { type: "text", val: this.inputText },
      ];
      this.inputText = "";
    },
    inputCharCode: function () {
      this.addCharCode(this.inputCode);
      this.inputHistory = [
        ...this.inputHistory,
        { type: "code", val: this.inputCode },
      ];
      this.inputCode = 0;
    },
    scrollToBottom: function (name) {
      let e = this.$refs[name].$refs.textarea;
      e.scrollTop = e.scrollHeight;
    },
    clearInputHistory: function () {
      this.inputHistory = [];
    },
    clearOutput: function () {
      this.outputMessage = "";
    },
    toHex: function (value) {
      return "0x" + ("00" + value.toString(16)).slice(-2);
    },
    toChar: function (value) {
      return 0x20 <= value && value <= 0x7e
        ? String.fromCodePoint(value)
        : this.toHex(value);
    },
    showValue: function (value) {
      switch (this.memoryShowMode) {
        case 0:
          return value;
        case 1:
          return this.toHex(value);
        case 2:
          return this.toChar(value);
      }
    },
  },
};
</script>

<style>
.engine {
  padding: 20px;
}
.is-cell {
  font-size: small;
  width: 48px;
  height: 24px;
  line-height: 24px;
  margin: 0.5px;
  text-align: center;
  vertical-align: middle;
  display: inline-block;
}
.is-not-current {
  border: 1px solid #ccc;
  border-radius: 3px;
}
.is-current {
  border: 2px solid #444;
  border-radius: 3px;
}
</style>
