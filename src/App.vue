<script setup>
import { computed, reactive, ref } from 'vue'

const products = [
  { id: 1, name: 'Pistachio', price: 4.5 },
  { id: 2, name: 'Dark chocolate', price: 4.0 },
  { id: 3, name: 'Strawberry', price: 3.5 },
  { id: 4, name: 'Lemon sorbet', price: 3.0 },
]

const cart = reactive([])

function add(product) {
  const line = cart.find((l) => l.id === product.id)
  if (line) line.qty += 1
  else cart.push({ ...product, qty: 1 })
}

function decrease(line) {
  line.qty -= 1
  if (line.qty <= 0) cart.splice(cart.indexOf(line), 1)
}

const subtotal = computed(() => cart.reduce((sum, l) => sum + l.price * l.qty, 0))

const code = ref('')
const discount = ref(0)

function applyCode() {
  if (code.value.trim().toUpperCase() === 'GELATO10') discount.value += 10
}

const total = computed(() => subtotal.value - discount.value)
const money = (n) => '$' + n.toFixed(2)
</script>

<template>
  <main>
    <h1>Gelato Cart</h1>

    <section>
      <h2>Flavours</h2>
      <ul class="products">
        <li v-for="p in products" :key="p.id">
          <span>{{ p.name }}</span>
          <span>{{ money(p.price) }}</span>
          <button :aria-label="'Add ' + p.name" @click="add(p)">Add</button>
        </li>
      </ul>
    </section>

    <section>
      <h2>Your cart</h2>
      <p v-if="cart.length === 0" class="empty">Your cart is empty.</p>
      <ul v-else class="cart">
        <li v-for="l in cart" :key="l.id">
          <span>{{ l.name }}</span>
          <span class="qty">
            <button :aria-label="'Decrease ' + l.name" @click="decrease(l)">-</button>
            <b>{{ l.qty }}</b>
            <button :aria-label="'Increase ' + l.name" @click="add(l)">+</button>
          </span>
          <span>{{ money(l.price * l.qty) }}</span>
        </li>
      </ul>
      <form class="discount" @submit.prevent="applyCode">
        <input v-model="code" placeholder="Discount code" aria-label="Discount code" />
        <button type="submit">Apply</button>
        <span v-if="discount" class="note">Discount {{ money(discount) }}</span>
      </form>
      <p class="total">Total <b data-testid="total">{{ money(total) }}</b></p>
    </section>
  </main>
</template>

<style>
body { font-family: system-ui, sans-serif; background: #fff7f2; color: #3a1f1f; margin: 0; }
main { max-width: 560px; margin: 40px auto; padding: 0 20px; }
h1 { font-size: 32px; }
ul { list-style: none; padding: 0; }
li { display: grid; grid-template-columns: 1fr auto auto; gap: 16px; align-items: center; padding: 10px 0; border-bottom: 1px solid #f0d9d0; }
button { background: #8a1c3a; color: #fff; border: 0; border-radius: 8px; padding: 6px 14px; cursor: pointer; font-size: 15px; }
.qty { display: flex; gap: 10px; align-items: center; }
.total { font-size: 22px; text-align: right; }
.empty { color: #9a7a7a; }
.discount { display: flex; gap: 10px; align-items: center; margin-top: 16px; }
.discount input { padding: 7px 10px; border: 1px solid #d9b8ad; border-radius: 8px; font-size: 15px; }
.note { color: #2f7a4a; }
</style>
