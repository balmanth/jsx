# JSX-Core

This module is part of [BPL (Balmanth's Personal Library)](https://github.com/topics/nodejs-bpl) and provides a set of functions and classes to build interfaces using a custom JSX over TypeScript, but it doesn't provide a renderer.

## Install

Using npm:

```sh
npm i @balmanth/jsx-core
```

## Reference

After installing the module, you need to import it as in the following example:

```ts
import * as JSX from '@balmanth/jsx-core';
```

And configure your `tsconfig.json` as in the example below:

```json
{
  "jsxFactory": "JSX.create",
  "jsx": "react"
}
```

> This part isn't needed if you want just to extend the module.

...Then you can follow all the quick reference examples.

- Class [Attachment](./reference/attachment.md)
- Class [Component](./reference/component.md)
- Class [Fragment](./reference/fragment.md)
- Class [Element](./reference/element.md)
- Class [Text](./reference/text.md)
- Class [Node](./reference/node.md)
- Function [create](./reference/create.md)
- Function [json](./reference/json.md)

## License

[MIT](https://balmante.eti.br)
