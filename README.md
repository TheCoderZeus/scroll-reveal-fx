# @thecoderzeus/scroll-reveal-fx

[![NPM Version](https://img.shields.io/npm/v/@thecoderzeus/scroll-reveal-fx.svg)](https://www.npmjs.com/package/@thecoderzeus/scroll-reveal-fx)
[![License](https://img.shields.io/npm/l/@thecoderzeus/scroll-reveal-fx.svg)](https://github.com/thecoderzeus/scroll-reveal-fx/blob/main/LICENSE)

Uma biblioteca leve e poderosa para revelar elementos com animações elegantes conforme o usuário rola a página. Altamente customizável e fácil de usar.

## Features

- **Múltiplos Efeitos:** `fade`, `slide`, `zoom`, `blur`, `flip`, e `rotate`.
- **Altamente Customizável:** Ajuste duração, atraso, direção da animação, e muito mais.
- **Animação em Cascata (Stagger):** Anime elementos em sequência para um efeito visual mais agradável.
- **Controle de Execução:** Configure animações para rodar uma única vez ou repetidamente.
- **Sem Dependências:** Feito com JavaScript puro, usando a API `IntersectionObserver`.
- **Fácil Integração:** Funciona perfeitamente com qualquer framework, incluindo React, Vue, e Angular.

## Installation

```bash
npm install @thecoderzeus/scroll-reveal-fx
# ou
yarn add @thecoderzeus/scroll-reveal-fx
```

## Usage

### Uso Básico (HTML e JS)

1.  Adicione a classe ou seletor que você usará nos seus elementos HTML. O padrão é `.reveal`.

    ```html
    <div class="reveal">Olá, Mundo!</div>
    <div class="reveal">Outro elemento.</div>
    ```

2.  Importe e chame a função no seu arquivo JavaScript.

    ```javascript
    import { revealOnScroll } from '@thecoderzeus/scroll-reveal-fx';

    // Inicializa com as opções padrão (efeito 'fade')
    revealOnScroll();
    ```

### Uso com React

O uso com React é simples. Apenas chame a função dentro de um hook `useEffect` com um array de dependências vazio para garantir que ela rode apenas uma vez, após o componente ser montado.

```jsx
import { useEffect } from 'react';
import { revealOnScroll } from '@thecoderzeus/scroll-reveal-fx';
import './styles.css';

function MyComponent() {
  useEffect(() => {
    // Inicializa a biblioteca para todos os elementos com a classe 'reveal-effect'
    revealOnScroll({
      selector: '.reveal-effect',
      effect: 'slide',
      direction: 'up',
      duration: 800,
      stagger: 150, // Atraso de 150ms entre cada elemento
    });
  }, []);

  return (
    <div>
      <section className="reveal-effect">
        <h2>Seção 1</h2>
        <p>Conteúdo da seção...</p>
      </section>
      <section className="reveal-effect">
        <h2>Seção 2</h2>
        <p>Conteúdo da seção...</p>
      </section>
      <section className="reveal-effect">
        <h2>Seção 3</h2>
        <p>Conteúdo da seção...</p>
      </section>
    </div>
  );
}

export default MyComponent;
```

## API Options

Você pode passar um objeto de configuração para a função `revealOnScroll` para customizar o comportamento.

| Opção | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `selector` | `string` | `'.reveal'` | Seletor CSS para os elementos a serem animados. |
| `effect` | `string` | `'fade'` | Efeito de animação. Valores: `'fade'`, `'slide'`, `'zoom'`, `'blur'`, `'flip'`, `'rotate'`. |
| `threshold` | `number` | `0.25` | Porcentagem (0 a 1) do elemento que precisa estar visível para disparar a animação. |
| `duration` | `number` | `800` | Duração da animação em milissegundos. |
| `delay` | `number` | `0` | Atraso inicial para a animação em milissegundos. |
| `easing` | `string` | `'cubic-bezier(0.5, 0, 0, 1)'` | Função de `easing` do CSS para a transição. |
| `direction` | `string` | `'up'` | Direção para o efeito `'slide'`. Valores: `'up'`, `'down'`, `'left'`, `'right'`. |
| `scale` | `number` | `0.9` | Escala inicial para o efeito `'zoom'`. |
| `rotation` | `number` | `15` | Rotação inicial (em graus) para o efeito `'rotate'`. |
| `stagger` | `number` | `150` | Atraso em milissegundos entre a animação de cada elemento em sequência. |
| `once` | `boolean` | `true` | Se `true`, a animação ocorre apenas uma vez. |
| `reset` | `boolean` | `false` | Se `once` for `false`, define se o elemento deve retornar ao estado inicial ao sair da tela. |

### Exemplo Avançado

Combinando várias opções para um efeito mais complexo.

```javascript
import { revealOnScroll } from '@thecoderzeus/scroll-reveal-fx';

revealOnScroll({
  selector: '.custom-reveal',
  effect: 'zoom',
  duration: 1200,
  scale: 0.5,
  stagger: 200,
  once: false,
  reset: true,
  easing: 'ease-in-out',
});
```

## License

Este projeto está licenciado sob a [Licença MIT](LICENSE).
