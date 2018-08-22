const PRICE = 9.99;
const LOAD_NUM = 10;
new Vue({
  el: '#app',

  data: {
    total: 0,
    items: [],
    price: PRICE,
    cart: [],
    newSearch: '90s',
    lastSearch: '',
    loading: false,
    results: []
  },
  computed:{
    noMoreItems: function(){
      return this.results.length && this.results.length === this.items.length
    }
  },
  mounted: function(){
    this.onSubmit();
    let elem = document.getElementById('product-list-bottom')
    let watcher = scrollMonitor.create(elem);
    watcher.enterViewport(() => {
      console.log('in view');
      this.appendItems();
    })
    
  },
  methods: {
    appendItems: function(){
      if(this.items.length < this.results.length){
        const append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
        this.items = this.items.concat(append)
      }
    },
    emptySearch: function(){
      this.newSearch = '';
    },
    addItem: function(index) {
      let item = this.items[index];
      let found = false;
      for(let i = 0; i < this.cart.length; i++){
        if(this.cart[i].id === item.id) {
          this.cart[i].qty ++;
          found = true;
          break;
        }
      }
      if(!found){
        this.cart.push({
          id: item.id,
          title: item.title,
          qty: 1,
          price: PRICE
        })
      }
      this.total += 9.99;
    },

    inc: function(item){
      item.qty ++;
      this.total += item.price;
    },

    dec: function(item){
      item.qty --;
      this.total -= item.price;
      if(item.qty <= 0){
        this.cart = this.cart.filter(i => i.id === item.id ? false : true);
      }
    },

    onSubmit: function(event){
      if(!this.newSearch.length) return;
      this.items = [];
      this.loading = true;
      this.$http.get(`/search/${this.newSearch}`)
      .then(function(res){
        this.results = res.data;
        this.appendItems();
        this.lastSearch = this.newSearch;
        this.loading = false;
      })
    }
  },

  filters: {
    currency: function(price) {
      return `$ ${price.toFixed(2)}`
    }
  }
})

