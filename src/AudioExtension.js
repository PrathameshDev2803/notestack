import { Node } from '@tiptap/core';

const Audio = Node.create({
  name: 'audio',

  group: 'block',
  atom: true,

  selectable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      controls: {
        default: true,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'audio[src]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['audio', HTMLAttributes];
  },
});

export default Audio;
