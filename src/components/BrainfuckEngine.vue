<template>
  <section class="engine" height="auto">
    <b-field label="Code:">
      <b-input
        type="textarea"
        v-model="code"
      ></b-input>
    </b-field>

    <b-collapse class="card" :open="false">
      <div slot="trigger" slot-scope="props" class="card-header">
        <p class="card-header-title">
          Memory:
        </p>
        <a class="card-header-icon">
          <b-icon
            pack="fas"
            :icon="props.open ? 'caret-up' : 'caret-down'">
          </b-icon>
        </a>
      </div>
      <div class="card-content">
        <div class="content" style="height: 150px; overflow: scroll;">
          <div
            class="is-cell code"
            :class="index==pointer ? 'is-current' : 'is-not-current'"
            v-for="(value, index) in memory"
            :key="index"
          >
            {{showValue(value)}}
          </div>
        </div>
      </div>
      <div class="card-footer">
        <nav class="breadcrumb is-centered card-footer-item" aria-label="breadcrumbs">
          <ul>
            <li :class="memoryShowMode==0 ? `is-active` : ``">
              <a @click="memoryShowMode=0">dec</a>
            </li>
            <li :class="memoryShowMode==1 ? `is-active` : ``">
              <a @click="memoryShowMode=1">hex</a>
            </li>
            <li :class="memoryShowMode==2 ? `is-active` : ``">
              <a @click="memoryShowMode=2">char</a>
            </li>
          </ul>
        </nav>
      </div>
    </b-collapse>


    <div class="level is-mobile" style="margin: 12px 0px;">
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
              <button
                class="button"
                @click="stop"
                :disabled="!isRunning"
              >
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
              style="margin-right: 0.5em;"
            >
          </b-tooltip>
        </div>
      </div>
    </div>

    <form
      @submit.prevent="input"
      style="margin: 12px 0px;"
    >
      <b-field>
        <b-input
          v-model="inputText"
          :disabled="!isRunning"
        >
        </b-input>
        <div class="control">
          <button
            class="button is-dark"
            :disabled="!isRunning"
          >Input</button>
        </div>
      </b-field>
    </form>


    <b-field label="Input history:">
      <div class="field">
        <b-input
          type="textarea"
          :rows="3"
          v-model="inputHistory"
          @input="autoScrollBottom('inputHistory', $event)"
          ref="inputHistory"
          readonly
          disabled
        >
        </b-input>
        <div class="control has-addons-right">
          <button
            class="button is-dark is-small"
            @click="clearInputHistory"
          >
            <b-icon pack="fas" icon="times"></b-icon>
          </button>
        </div>
      </div>
    </b-field>

    <b-field
      label="Output:"
      :type="hasError ? 'is-danger' : ''"
    >
      <div class="field">
        <b-input
          type="textarea"
          :rows="10"
          :value="hasError ? errorMessage : outputMessage"
          @input="autoScrollBottom('output', $event)"
          ref="output"
          readonly
          disabled
        >
        </b-input>
        <div class="control has-addons-right">
          <button
            class="button is-dark is-small"
            @click="clearOutput"
          >
            <b-icon pack="fas" icon="times"></b-icon>
          </button>
        </div>
      </div>
    </b-field>

  </section>
</template>

<script>
import Interpreter from '../js/BrainfuckInterpreter.js';
import 'bulma-slider/dist/bulma-slider.min.css';

export default {
  data: function() {
    return {
      code: '+++++++++[>++++++++>+++++++++++>+++++<<<-]>.>++.+++++++..+++.>-.------------.<++++++++.--------.+++.------.--------.>+.',
      inputText: '',
      inputHistory: '',
      interpreter: new Interpreter(),
      outputMessage: "",
      errorMessage: "",
      isRunning: false,
      isPausing: false,
      interval: 0,
      pointer: 0,
      memory: [],
      memoryShowMode: 0 // dec, hex, char
    };
  },
  computed: {
    hasError: function() {
      return this.errorMessage.length != 0;
    }
  },
  watch: {
    interval: function(value) {
      this.interpreter.setInterval(value);
    }
  },
  mounted: function() {
    this.interpreter.setOutputListener(
      (ch) => this.outputMessage += ch
    );
    this.interpreter.setExecListener(
      (pointer, memory) => {
        this.pointer = pointer;
        this.$set(this.memory, pointer, memory[pointer]);
      }
    );
    this.interpreter.setErrorListener(
      (message) => this.errorMessage = message
    );
    this.interpreter.setFinishListener(() => {
      this.isRunning = false;
      this.isPausing = false;
    });
    this.memory = Array.from({length: this.interpreter.bufferSize}, ()=>0);
  },
  methods: {
    run: function() {
      this.isRunning = true;
      this.inputHistory = "";
      this.outputMessage = "";
      this.errorMessage = "";
      this.interpreter.run(this.code);
    },
    stop: function() {
      this.resume();
      this.interpreter.stop();
    },
    pause: function() {
      this.isPausing = true;
      this.interpreter.pause();
    },
    resume: function() {
      this.interpreter.resume();
      this.isPausing = false;
    },
    input: function() {
      for(let ch of this.inputText) {
        this.interpreter.addInput(ch.charCodeAt(0));
      }
      this.inputHistory += this.inputText + '\n';
      this.inputText = '';
    },
    autoScrollBottom: function(name, value) {
      let e = this.$refs[name].$refs.textarea;
      e.value = value;
      e.scrollTop = e.scrollHeight;
    },
    clearInputHistory: function() {
      this.inputHistory = '';
    },
    clearOutput: function() {
      this.outputMessage = '';
    },
    showValue: function(value) {
      switch(this.memoryShowMode) {
        case 0: return value;
        case 1: return '0x'+('00'+value.toString(16)).slice(-2);
        case 2:
          return 0x20<=value && value<=0x7e ?
            String.fromCodePoint(value) :
            '0x'+('00'+value.toString(16)).slice(-2);
      }
    }
  }
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