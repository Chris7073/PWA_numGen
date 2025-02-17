<template>
  <div class="container d-flex flex-column align-items-center vh-100 justify-content-center position-relative">
    <!-- Notification with Bootstrap -->
    <div v-if="notifica" class="alert alert-dismissible fade show position-absolute top-0 mt-3 text-center"
      style="max-width: 450px; z-index: 1000; border: none;" :class="notificaTipo" role="alert">
      <strong>{{ notificaIcon }}</strong> {{ notifica }}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>

    <h3 class="fw-bold mb-3">Random Number Generator</h3>

    <div class="card shadow-sm p-4 rounded-3 bg-white text-dark w-100" style="max-width: 500px; border: none;">
      <div class="card-body text-center">
        <div class="d-flex gap-3 mb-3">
          <input type="number" v-model.number="importo1"
            class="form-control form-control-lg text-center border-secondary" placeholder="Min" style="flex: 1;" min="0"
            max="99">
          <input type="number" v-model.number="importo2"
            class="form-control form-control-lg text-center border-secondary" placeholder="Max" style="flex: 1;" min="0"
            max="99">
        </div>
        <div class="d-flex justify-content-between mb-3">
          <div class="form-check text-start">
            <input class="form-check-input" type="checkbox" id="autoGenerate" v-model="autoGenerate">
            <label class="form-check-label" for="autoGenerate">Auto generate</label>
          </div>
        </div>
        <button class="btn btn-primary btn-lg w-100 rounded-3 shadow-sm text-white" @click="generaNumero"
          :disabled="animating">
          {{ animating ? 'Generating...' : 'Generate Number' }}
        </button>
      </div>
    </div>

    <!-- Accordion for History and Stats -->
    <div class="accordion w-100 mt-4" id="historyAccordion" style="max-width: 500px;">
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingOne">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne"
            aria-expanded="true" aria-controls="collapseOne">
            Last Extracted Number: {{ risultato || '-' }}
          </button>
        </h2>
        <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne"
          data-bs-parent="#historyAccordion">
          <div class="accordion-body">
            <!-- History Section -->
            <div v-if="storico.length" class="mb-3">
              <p class="fw-bold">History</p>
              <div class="d-flex flex-wrap justify-content-center gap-2">
                <span v-for="(num, index) in storico.slice(0, 25)" :key="index"
                  class="badge bg-primary text-white p-2">{{ num }}</span>
              </div>
              <p v-if="storico.length > 25">and more...</p>
              <button class="btn btn-outline-primary btn-sm mt-2" @click="copiaCronologia">Copy History</button>
            </div>

            <!-- Stats Section -->
            <div v-if="storico.length">
              <p class="mb-1">📊 <strong>Stats</strong></p>
              <p class="mb-1">Max: {{ max }} | Min: {{ min }}</p>
              <p class="mb-0">Most Frequent: {{ numeroPiuFrequente }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="mt-4 text-center text-muted small">
      <p>&copy; 2025 Random Number Generator - All rights reserved</p>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      importo1: null,
      importo2: null,
      risultato: '',
      animating: false,
      autoGenerate: false,
      storico: [],
      notifica: '',
      notificaTipo: 'alert-danger',
      notificaIcon: '⚠️',
      autoGenerateInterval: null
    };
  },
  computed: {
    max() {
      return this.storico.length ? Math.max(...this.storico) : '-';
    },
    min() {
      return this.storico.length ? Math.min(...this.storico) : '-';
    },
    numeroPiuFrequente() {
      if (!this.storico.length) return '-';
      const freq = this.storico.reduce((acc, num) => { acc[num] = (acc[num] || 0) + 1; return acc; }, {});
      return Object.keys(freq).reduce((a, b) => freq[a] > freq[b] ? a : b);
    }
  },
  watch: {
    autoGenerate(val) {
      if (val) {
        this.autoGenerateInterval = setInterval(this.generaNumero, 2000);
      } else {
        clearInterval(this.autoGenerateInterval);
      }
    }
  },
  methods: {
    generaNumero() {
      if (!isNaN(this.importo1) && !isNaN(this.importo2) && this.importo1 >= 0 && this.importo2 >= 0 && this.importo1 < this.importo2) {
        this.notifica = '';
        this.animating = true;
        setTimeout(() => {
          this.finalizeResult();
        }, 0);
      } else {
        this.mostraNotifica("Error! Please enter valid values.", false);
      }
    },
    finalizeResult() {
      this.risultato = `${Math.floor(Math.random() * (this.importo2 - this.importo1 + 1)) + this.importo1}`;
      this.animating = false;
      this.storico.unshift(this.risultato);
      if (this.storico.length > 50) this.storico.pop();
    },
    copiaCronologia() {
      navigator.clipboard.writeText(this.storico.slice(0, this.storico.length()).join(", "));
      this.mostraNotifica("History copied successfully!", true);
    },
    mostraNotifica(messaggio, successo = true) {
      this.notifica = messaggio;
      this.notificaTipo = successo ? 'alert-success' : 'alert-danger';
      this.notificaIcon = successo ? '✅' : '⚠️';

      setTimeout(() => {
        this.notifica = '';
      }, 3000);
    }
  }
};
</script>
