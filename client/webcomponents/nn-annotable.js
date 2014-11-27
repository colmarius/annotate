Polymer({
  attached: function() {
    // In Polymer all attributes are properties of "this".
    if (!this.nid) {
      throw 'Attribute missing: nid';
    }
    this.$.get_comments.go();
  },
  ready: function() {
    this.domain = window.location.hostname;
    this.baseapi = this.baseapi || window.location.origin;
    this.comments = [];
  },
  populateComments: function(evt) {
    this.comments = evt.detail.response;
  },
  newComment: function(evt) {
    this.message = "";
    evt.preventDefault();
    if (!this.author || !this.text) {
      this.message = "completa tutti i campi";
      return;
    }
    this.$.new_comment.go();
  },
  resetForm: function() {
    this.author = "";
    this.text = "";
  }
});
