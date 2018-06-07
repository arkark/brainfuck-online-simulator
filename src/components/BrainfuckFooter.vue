<template>
  <footer class="footer">
    <div class="container">
      <div class="content">
        <div class="field has-addons">
          <div class="control">
            <a
              class="button is-small"
              href="https://github.com/ArkArk/brainfuck-online-simulator"
              target="_blank"
            >
              <b-icon pack="fab" icon="github"></b-icon>
              <span>GitHub</span>
            </a>
          </div>
          <div class="control">
            <a
              class="button is-twitter is-small"
              href="https://twitter.com/arkark_"
              target="_blank"
            >
              <b-icon pack="fab" icon="twitter"></b-icon>
              <span>Twitter</span>
            </a>
          </div>
        </div>
        <p>&copy; 2018 - Ark
          <br><span style="font-size: xx-small; color: #fff">
            -[-------&gt;+&lt;]&gt;---.++++++.-----------.++++++.&gt;--[--&gt;+++++&lt;]&gt;.-[-&gt;+++++&lt;]&gt;.[---&gt;+&lt;]&gt;----.[--&gt;+&lt;]&gt;-----.---.-[-----&gt;+&lt;]&gt;--.--------.-[---&gt;+&lt;]&gt;--.+[-&gt;+++&lt;]&gt;+.++++++++.------------.++++++++++.+[--&gt;+&lt;]&gt;.-----[-&gt;++&lt;]&gt;-.+++++++.-[---&gt;+&lt;]&gt;--.-------.[---&gt;+&lt;]&gt;+++.
          </span>
        </p>
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
