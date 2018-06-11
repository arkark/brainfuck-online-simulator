<template>
  <footer class="footer">
    <div class="container">
      <div class="content">
        <p>
          Brainfuck online editor, interpreter, and simulator :)
        </p>
        <p>
          The source code is licensed under <a href="https://opensource.org/licenses/MIT">MIT</a>
          <br>&copy; 2018 - Ark
        </p>
        <div class="field has-addons">
          <div class="control">
            <a
              class="button"
              href="https://github.com/ArkArk/brainfuck-online-simulator"
              target="_blank"
            >
              <b-icon pack="fab" icon="github"></b-icon>
              <span>GitHub</span>
            </a>
          </div>
          <div class="control">
            <a
              class="button is-twitter"
              href="https://twitter.com/arkark_"
              target="_blank"
            >
              <b-icon pack="fab" icon="twitter"></b-icon>
              <span>Twitter</span>
            </a>
          </div>
          <span style="font-size: xx-small; color: #fff">
            -[-------&gt;+&lt;]&gt;---.++++++.-----------.++++++.&gt;--[--&gt;+++++&lt;]&gt;.-[-&gt;+++++&lt;]&gt;.[---&gt;+&lt;]&gt;----.[--&gt;+&lt;]&gt;-----.---.-[-----&gt;+&lt;]&gt;--.--------.-[---&gt;+&lt;]&gt;--.+[-&gt;+++&lt;]&gt;+.++++++++.------------.++++++++++.+[--&gt;+&lt;]&gt;.-----[-&gt;++&lt;]&gt;-.+++++++.-[---&gt;+&lt;]&gt;--.-------.[---&gt;+&lt;]&gt;+++.
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>

export default {
  data: function() {
    return {
    };
  }
};
</script>

<style scoped>
.is-twitter {
  background: #1b95e0;
  color: #fff;
}
</style>
