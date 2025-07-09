# @thecoderzeus/scroll-reveal-fx

[![NPM Version](https://img.shields.io/npm/v/@thecoderzeus/scroll-reveal-fx.svg)](https://www.npmjs.com/package/@thecoderzeus/scroll-reveal-fx)
[![License](https://img.shields.io/npm/l/@thecoderzeus/scroll-reveal-fx.svg)](https://github.com/thecoderzeus/scroll-reveal-fx/blob/main/LICENSE)

Uma suíte de animação leve e poderosa para criar interações ricas e elegantes baseadas no scroll. Altamente customizável, modular e sem dependências.

## Features

- **Animação de Revelação:** Efeitos de `fade`, `slide`, `scale`, `blur`, `flip`, `rotate`, `roll` e `flicker` para qualquer elemento.
- **Animação de Texto Avançada:** Anime texto por caractere/palavra com efeitos como `fade`, `slide`, ou use modos especiais como `typewriter` e ordem aleatória.
- **Animação de SVG:** Desenhe SVGs na tela conforme o scroll.
- **Efeito Parallax:** Crie uma ilusão de profundidade movendo elementos em velocidades diferentes.
- **Gatilhos Personalizados:** Dispare a animação de um elemento com base na visibilidade de outro.
- **Callbacks de Eventos:** Execute seu próprio código nos principais pontos do ciclo de vida da animação (`onReveal`, `onComplete`, `onReset`).
- **Altamente Customizável:** Controle duração, atraso, easing, stagger e muito mais.

## Installation

```bash
npm install @thecoderzeus/scroll-reveal-fx
# ou
yarn add @thecoderzeus/scroll-reveal-fx
```

## API e Módulos

A biblioteca é modular. Você pode importar somente o que precisa.

---

### 1. `revealOnScroll` (Core)

A função principal para animar elementos quando eles entram na tela.

**Importação:**
```javascript
import { revealOnScroll } from '@thecoderzeus/scroll-reveal-fx';
```

**Uso Básico:**
```javascript
revealOnScroll({
  selector: '.my-element',
  effect: 'slide',
  direction: 'up'
});
```

**Opções do Core:**

| Opção | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `selector` | `string` | `'.reveal'` | Seletor CSS para os elementos a serem animados. |
| `trigger` | `string | HTMLElement` | `null` | Seletor ou elemento que dispara a animação. Se `null`, o próprio elemento é o gatilho. |
| `effect` | `string` | `'fade'` | Efeito: `'fade'`, `'slide'`, `'scale'`, `'blur'`, `'flip'`, `'rotate'`, `'roll'`, `'flicker'`. |
| `threshold` | `number` | `0.25` | Porcentagem de visibilidade (0-1) para disparar a animação. |
| `duration` | `number` | `800` | Duração da animação em ms. |
| `delay` | `number` | `0` | Atraso inicial da animação em ms. |
| `stagger` | `number` | `150` | Atraso em ms entre cada elemento da sequência. |
| `easing` | `string` | `'cubic-bezier(0.5, 0, 0, 1)'` | Função de `easing` do CSS. |
| `once` | `boolean` | `true` | Se `true`, a animação ocorre apenas uma vez. |
| `reset` | `boolean` | `false` | Se `once: false`, reseta o elemento ao sair da tela. |
| `onReveal` | `function` | `null` | Callback executado quando a animação inicia. Recebe o elemento como argumento. |
| `onComplete`| `function` | `null` | Callback executado quando a animação termina. |
| `onReset` | `function` | `null` | Callback executado quando o elemento é resetado. |

---

### 2. `animateText`

Para animar texto com múltiplos efeitos.

**Importação:**
```javascript
import { animateText } from '@thecoderzeus/scroll-reveal-fx';
```

**Uso:**

**1. Efeitos Padrão (Fade, Slide, etc.)**
```javascript
// Anima cada letra com um efeito de 'fade' e ordem aleatória
animateText({
  selector: '.my-title',
  splitType: 'chars', // 'chars' ou 'words'
  effect: 'fade',     // Qualquer efeito do core: slide, scale, etc.
  randomOrder: true,  // Opcional: revela em ordem aleatória
  stagger: 30
});
```

**2. Efeito Máquina de Escrever (Typewriter)**
```javascript
// Simula o texto sendo digitado
animateText({
  selector: '.my-paragraph',
  effect: 'typewriter',
  typewriterSpeed: 40, // Velocidade em ms por caractere
  once: false,         // Opcional: repete a animação
  reset: true
});
```

**Opções Adicionais:**

| Opção | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `splitType`| `string` | `'chars'` | Como dividir o texto: `'chars'` ou `'words'`. Não se aplica ao `typewriter`. |
| `randomOrder`| `boolean` | `false` | Se `true`, revela as partes em ordem aleatória. Não se aplica ao `typewriter`.|
| `effect`| `string` | `'slide'` | Além dos efeitos do core, aceita `'typewriter'` para o modo especial. |
| `typewriterSpeed`| `number` | `50` | Velocidade em ms entre cada caractere no modo `typewriter`. |

*(Herda todas as outras opções do `revealOnScroll` para os efeitos padrão)*

---

### 3. `drawSVG`

Anima o traçado de caminhos (`<path>`) dentro de um SVG.

**Importação:**
```javascript
import { drawSVG } from '@thecoderzeus/scroll-reveal-fx';
```

**Uso:**
```html
<svg id="my-logo" ...>
  <path d="..."/>
  <path d="..."/>
</svg>
```
```javascript
drawSVG({
  selector: '#my-logo',
  duration: 3000,
  stagger: 300,
  once: false,
  reset: true
});
```
*(Herda opções de duração, stagger, delay, once, reset, etc.)*

---

### 4. `applyParallax`

Aplica um efeito de parallax a um elemento durante o scroll.

**Importação:**
```javascript
import { applyParallax } from '@thecoderzeus/scroll-reveal-fx';
```

**Uso:**
```javascript
applyParallax({
  selector: '.parallax-bg',
  intensity: 0.3
});
```

**Opções:**

| Opção | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `selector` | `string` | `'.parallax'` | Seletor para os elementos. |
| `intensity`| `number` | `0.2` | Força do efeito. Positivo = mais lento. Negativo = mais rápido. |
| `threshold`| `number` | `100` | Distância em px do viewport para iniciar o cálculo. |

---

## License

Este projeto está licenciado sob a [Licença MIT](https://github.com/TheCoderZeus/scroll-reveal-fx/blob/main/LICENSE).
