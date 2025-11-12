// // ImageNode.ts
// import { DecoratorNode } from 'lexical';
// import * as React from 'react';

// export class ImageNode extends DecoratorNode<JSX.Element> {
//     __src: string;
//     __alt: string;

//     static getType() {
//         return 'image';
//     }

//     static clone(node: ImageNode) {
//         return new ImageNode(node.__src, node.__alt);
//     }

//     constructor(src: string, alt = '') {
//         super();
//         this.__src = src;
//         this.__alt = alt;
//     }

//     createDOM() {
//         const div = document.createElement('div');
//         div.style.display = 'inline-block';
//         return div;
//     }

//     updateDOM() {
//         return false;
//     }

//     decorate() {
//         return <img src={this.__src} alt={this.__alt} style={{ maxWidth: '100%' }} />;
//     }
// }

// export function $createImageNode(src: string, alt = '') {
//     return new ImageNode(src, alt);
// }

// export function $isImageNode(node: any): node is ImageNode {
//     return node instanceof ImageNode;
// }
