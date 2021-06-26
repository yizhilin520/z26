///<reference path="../node_modules/typescript/lib/lib.es6.d.ts"/>
///<reference path="../node_modules/@types/node/index.d.ts" />

//允许ts,tsx文件引入json文件
declare module '*.json' {
  var data: any;
  export = data;
}

//允许ts,tsx文件引入scss文件
declare module '*.scss' {
  var styles: any;
  export = styles;
}

declare module '*.html' {
  var data: string;
  export = data;
}
declare module '*.css' {
  var styles: string;
  export = styles;
}

interface Window {
  
}

declare module '*.ejs' {
  var file: any;
  export = file;
}